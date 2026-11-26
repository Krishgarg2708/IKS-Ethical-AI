// Browser-side text extraction for PDF / DOCX / TXT (no server needed).
export const MAX_MB = 10;

export async function extractText(file: File): Promise<string> {
  const ext = file.name.toLowerCase().split('.').pop();
  if (file.size > MAX_MB * 1024 * 1024) throw new Error(`File is larger than ${MAX_MB} MB.`);
  if (ext === 'txt' || ext === 'md') return file.text();
  const buf = await file.arrayBuffer();
  if (ext === 'docx') {
    // @ts-ignore – browser bundle has no type declarations
    const mammoth = (await import('mammoth/mammoth.browser')).default;
    const r = await mammoth.extractRawText({ arrayBuffer: buf });
    return r.value;
  }
  if (ext === 'pdf') {
    const { getDocumentProxy, extractText } = await import('unpdf');
    const pdf = await getDocumentProxy(new Uint8Array(buf));
    const { text } = await extractText(pdf, { mergePages: false });
    const joined = (Array.isArray(text) ? text : [text]).join('\n\n');
    if (joined.replace(/\s/g, '').length < 50) throw new Error('This PDF has no readable text (it may be a scan). Please upload a text-based PDF or DOCX.');
    return joined;
  }
  throw new Error('Unsupported file. Please upload PDF, DOCX or TXT.');
}

