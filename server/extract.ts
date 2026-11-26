// Document text extraction for PDF / DOCX / TXT with strict validation.
// OCR is NOT implemented: scanned (image-only) PDFs are rejected with a clear message
// rather than producing a report from empty or garbage text.
import crypto from 'node:crypto';
import mammoth from 'mammoth';
import { getDocumentProxy } from 'unpdf';

export const MAX_FILE_BYTES = Number(process.env.SWALEKHAN_MAX_FILE_MB || 5) * 1024 * 1024;
export const ALLOWED_EXT = ['pdf', 'docx', 'txt'] as const;
export type FileKind = (typeof ALLOWED_EXT)[number];

export class ExtractionError extends Error {
  constructor(public code: string, message: string, public status = 422) { super(message); }
}

export interface Extracted {
  kind: FileKind;
  text: string;
  pages?: number;
  sha256: string;
  sizeBytes: number;
}

function detectKind(fileName: string, buf: Buffer): FileKind {
  const ext = fileName.toLowerCase().split('.').pop() || '';
  if (!(ALLOWED_EXT as readonly string[]).includes(ext)) {
    throw new ExtractionError('unsupported_type', `“.${ext || '?'}” files are not supported. Please upload a PDF, DOCX or TXT file.`, 415);
  }
  // Magic-byte checks so a renamed file can't masquerade as another type
  if (ext === 'pdf' && buf.subarray(0, 5).toString('latin1') !== '%PDF-') {
    throw new ExtractionError('corrupt_file', 'This file has a .pdf name but is not a valid PDF. It may be corrupted.');
  }
  if (ext === 'docx' && !(buf[0] === 0x50 && buf[1] === 0x4b)) {
    throw new ExtractionError('corrupt_file', 'This file has a .docx name but is not a valid Word document. Older .doc files are not supported — please save as .docx.');
  }
  if (ext === 'txt' && buf.includes(0)) {
    throw new ExtractionError('corrupt_file', 'This .txt file contains binary data and cannot be read as text.');
  }
  return ext as FileKind;
}

export function normaliseText(t: string): string {
  return t
    .replace(/\r\n?/g, '\n')
    .replace(/ /g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export async function extractFromFile(fileName: string, buf: Buffer): Promise<Extracted> {
  if (!buf.length) throw new ExtractionError('empty_file', 'The uploaded file is empty.');
  if (buf.length > MAX_FILE_BYTES) {
    throw new ExtractionError('too_large', `File is too large (${(buf.length / 1048576).toFixed(1)} MB). The limit is ${MAX_FILE_BYTES / 1048576} MB.`, 413);
  }
  const kind = detectKind(fileName, buf);
  const sha256 = crypto.createHash('sha256').update(buf).digest('hex');
  let text = '';
  let pages: number | undefined;

  if (kind === 'txt') {
    text = new TextDecoder('utf-8', { fatal: false }).decode(buf);
  } else if (kind === 'docx') {
    try {
      const r = await mammoth.extractRawText({ buffer: buf });
      text = r.value;
    } catch {
      throw new ExtractionError('corrupt_file', 'We could not read this Word document. It may be corrupted or password-protected.');
    }
  } else {
    try {
      const pdf = await getDocumentProxy(new Uint8Array(buf));
      pages = pdf.numPages;
      const pageTexts: string[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        pageTexts.push(pdfItemsToText(content.items as any[]));
      }
      text = pageTexts.join('\n\n');
    } catch (e: any) {
      const msg = String(e?.message || e);
      if (/password/i.test(msg)) throw new ExtractionError('encrypted_pdf', 'This PDF is password-protected. Please upload an unlocked copy.');
      throw new ExtractionError('corrupt_file', 'We could not read this PDF. It may be corrupted or damaged.');
    }
    const letters = (text.match(/\p{L}/gu) || []).length;
    if (pages && letters / pages < 40) {
      throw new ExtractionError(
        'scanned_pdf',
        'This PDF appears to be scanned (images of pages) and contains almost no selectable text. ' +
        'SwaLekhan does not perform OCR, so it cannot analyse it. Please upload the original DOCX/TXT, ' +
        'a text-based PDF, or paste the text directly. No report has been generated.'
      );
    }
  }

  text = normaliseText(text);
  if (!text) throw new ExtractionError('no_text', 'No readable text was found in this file.');
  return { kind, text, pages, sha256, sizeBytes: buf.length };
}

/**
 * Rebuild lines and paragraphs from positioned PDF text items.
 * A vertical gap clearly larger than the normal line spacing marks a paragraph break.
 */
function pdfItemsToText(items: { str: string; transform: number[]; hasEOL?: boolean; height?: number }[]): string {
  const lines: { y: number; text: string; h: number }[] = [];
  for (const it of items) {
    if (!('str' in it)) continue;
    const y = it.transform[5];
    const last = lines[lines.length - 1];
    if (last && Math.abs(last.y - y) < 2) last.text += it.str;
    else if (it.str.trim()) lines.push({ y, text: it.str, h: it.height || Math.abs(it.transform[3]) || 10 });
  }
  if (!lines.length) return '';
  const gaps = lines.slice(1).map((l, i) => Math.abs(lines[i].y - l.y)).filter(g => g > 0);
  const sorted = [...gaps].sort((a, b) => a - b);
  const typical = sorted[Math.floor(sorted.length * 0.3)] || lines[0].h * 1.2;
  let out = lines[0].text.trim();
  for (let i = 1; i < lines.length; i++) {
    const gap = Math.abs(lines[i - 1].y - lines[i].y);
    out += (gap > typical * 1.45 ? '\n\n' : '\n') + lines[i].text.trim();
  }
  return out;
}
