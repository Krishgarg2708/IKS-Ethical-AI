// Professional SwaLekhan AI Contribution Report as a PDF (server-generated with pdfkit).
import PDFDocument from 'pdfkit';
import type { Response } from 'express';
import { VERDICTS } from './service.ts';

const C = { green: '#243B32', ivory: '#F7F3EA', sand: '#E8DDCA', terra: '#A6533C', gold: '#B49A61', charcoal: '#282923', slate: '#66675F', grey: '#9A9A92', white: '#FFFDF8' };
const CAT = { independent: { label: 'Independent indicators', color: C.green }, ai_assisted: { label: 'Possible AI assistance', color: C.gold }, uncertain: { label: 'Inconclusive', color: C.grey } } as const;

// Standard PDF fonts only support Latin-1; replace characters outside it so nothing renders as garbage.
const safe = (s: unknown) => String(s ?? '').replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, '-').replace(/…/g, '...')
  .replace(/[^\x09\x0A\x0D\x20-\x7E\xA0-\xFF]+/g, ' [non-Latin text] ');

export function streamReportPdf(res: Response, b: any) {
  const { assignment: a, report: r, footprint: fp, feedback, reviews, currentAssessment: cur, journey } = b;
  const doc = new PDFDocument({ size: 'A4', margins: { top: 56, bottom: 56, left: 56, right: 56 }, bufferPages: true,
    info: { Title: `SwaLekhan Report - ${safe(a.title)}`, Author: 'Gram to Graph - SwaLekhan AI' } });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="SwaLekhan-Report-${a.id}.pdf"`);
  doc.pipe(res);
  const W = doc.page.width - 112;

  const h2 = (t: string) => { ensure(60); doc.moveDown(0.8).fillColor(C.terra).font('Helvetica-Bold').fontSize(8.5).text(t.toUpperCase(), { characterSpacing: 1.2 }); doc.moveTo(56, doc.y + 3).lineTo(56 + W, doc.y + 3).strokeColor(C.sand).lineWidth(1).stroke(); doc.moveDown(0.6); };
  const body = (t: string, opts: any = {}) => doc.fillColor(C.charcoal).font('Helvetica').fontSize(9.5).text(safe(t), { lineGap: 2, ...opts });
  const kv = (k: string, v: string) => { doc.font('Helvetica-Bold').fontSize(9).fillColor(C.slate).text(k + ':  ', { continued: true }).font('Helvetica').fillColor(C.charcoal).text(safe(v)); };
  function ensure(h: number) { if (doc.y + h > doc.page.height - 70) doc.addPage(); }

  // Header band
  doc.rect(0, 0, doc.page.width, 118).fill(C.green);
  doc.fillColor(C.gold).font('Helvetica-Bold').fontSize(8).text('GRAM TO GRAPH  -  IKS & ETHICAL AI', 56, 34, { characterSpacing: 2 });
  doc.fillColor(C.white).font('Times-Bold').fontSize(24).text('SwaLekhan AI Contribution Report', 56, 50);
  doc.fillColor(C.sand).font('Times-Italic').fontSize(11).text('Your Voice. Your Learning. Your Creation.', 56, 82);
  doc.y = 140;

  h2('Student & assignment');
  kv('Student', `${a.studentName} (${a.studentCode})`);
  kv('Class / level', a.classLevel);
  kv('Subject', a.subject);
  kv('Assignment', a.title);
  if (a.description) kv('Description', a.description);
  kv('Submitted', `${a.createdAt} UTC`);
  kv('Source', a.file ? `${a.file.fileName} (${a.sourceType.toUpperCase()})` : 'Pasted text');
  kv('Teacher review status', a.reviewStatus.replace('_', ' '));

  if (!r) { h2('Analysis'); body('No completed analysis is available for this assignment. No estimate has been produced.'); }
  else {
    h2('SwaLekhan Score - estimated content contribution');
    const y0 = doc.y; const cw = (W - 24) / 3;
    [[r.independentPct, 'Independent writing indicators', C.green], [r.aiPct, 'Possible AI-assistance indicators', C.gold], [r.uncertainPct, 'Uncertain / inconclusive', C.grey]].forEach(([v, l, col], i) => {
      const x = 56 + i * (cw + 12);
      doc.roundedRect(x, y0, cw, 66, 4).fillAndStroke(C.ivory, C.sand);
      doc.rect(x, y0, 4, 66).fill(col as string);
      doc.fillColor(col as string).font('Times-Bold').fontSize(26).text(`${v}%`, x + 14, y0 + 10);
      doc.fillColor(C.slate).font('Helvetica').fontSize(8).text(l as string, x + 14, y0 + 44, { width: cw - 20 });
    });
    // stacked bar
    const by = y0 + 78; let bx = 56;
    [[r.independentPct, C.green], [r.aiPct, C.gold], [r.uncertainPct, C.grey]].forEach(([v, col]) => { const w = (W * (v as number)) / 100; if (w > 0) doc.rect(bx, by, w, 8).fill(col as string); bx += w; });
    doc.x = 56; doc.y = by + 18;
    kv('Total words', String(r.wordCount)); kv('Paragraphs analysed', String(r.paragraphCount));
    kv('Analysis confidence', `${r.confidenceLabel} (${Math.round(r.confidence * 100)}%)`);
    kv('Method', `${r.method === 'hybrid' ? 'Heuristic + language-model review' : 'Transparent heuristic indicators'} (${r.engineVersion})`);
    kv('Report generated', `${r.createdAt} UTC`);
    if (cur?.source === 'teacher') {
      doc.moveDown(0.4);
      body(`Teacher-verified assessment: ${VERDICTS[cur.verdict] || cur.verdict} - independent ${cur.independentPct}%, AI-assisted ${cur.aiPct}%, uncertain ${cur.uncertainPct}% (by ${cur.teacherName}, ${cur.at} UTC). Reason: ${cur.reason}`, { oblique: true });
    }
    doc.moveDown(0.4); body(r.summary);

    h2('Nyaya Fairness Check');
    if (!r.fairness.warnings.length) body('No fairness warnings were raised for this submission.');
    for (const w of r.fairness.warnings) { ensure(40); doc.font('Helvetica-Bold').fontSize(9.5).fillColor(w.severity === 'important' ? C.terra : C.charcoal).text(`${w.title} (${w.severity})`); body(w.detail); doc.moveDown(0.3); }
    if (r.fairness.adjustmentsApplied.length) { doc.moveDown(0.2); body('Adjustments applied: ' + r.fairness.adjustmentsApplied.join(' ')); }
    doc.moveDown(0.3); body('Signals SwaLekhan never uses as evidence: ' + r.fairness.excludedSignals.join(' '), { oblique: true });

    h2('Paragraph-wise analysis');
    for (const p of r.paragraphs) {
      ensure(90);
      const cat = CAT[p.category as keyof typeof CAT];
      const top = doc.y;
      doc.font('Helvetica-Bold').fontSize(9).fillColor(cat.color).text(`Paragraph ${p.idx}  -  ${cat.label}`, 66);
      doc.font('Helvetica').fontSize(8).fillColor(C.slate).text(`AI-assistance likelihood ${Math.round(p.aiLikelihood * 100)}%  |  Independent ${Math.round(p.independentLikelihood * 100)}%  |  Confidence ${Math.round(p.confidence * 100)}%  |  ${p.wordCount} words`, 66);
      const ex = p.text.length > 420 ? p.text.slice(0, 420) + '...' : p.text;
      doc.moveDown(0.2).font('Times-Italic').fontSize(9.5).fillColor(C.charcoal).text(`"${safe(ex)}"`, 66, doc.y, { width: W - 10, lineGap: 1.5 });
      const inds = (p.indicators || []).filter((i: any) => i.direction !== 'neutral' || i.signal.startsWith('Style'));
      if (inds.length) { doc.moveDown(0.2).font('Helvetica').fontSize(8).fillColor(C.slate).text(inds.map((i: any) => `${i.direction === 'ai' ? '[AI]' : i.direction === 'independent' ? '[IND]' : '[--]'} ${safe(i.signal)}`).join('   '), 66, doc.y, { width: W - 10 }); }
      if (p.assistanceHint) doc.font('Helvetica-Oblique').fontSize(8).fillColor(C.slate).text(safe(p.assistanceHint), 66, doc.y, { width: W - 10 });
      doc.rect(56, top, 3, doc.y - top).fill(cat.color);
      doc.x = 56; doc.moveDown(0.7);
    }

    h2('Writing-process evidence');
    const pe = r.processEvidence;
    kv('Drafts supplied', pe.draftsProvided ? `Yes (average phrasing overlap ${Math.round(pe.draftOverlapAvg * 100)}%)` : 'No');
    kv('Revision history supplied', pe.revisionHistoryProvided ? 'Yes' : 'No');
    kv('Thinking Footprint questions answered', `${pe.reflectionAnswered} of 8`);
    kv('AI use disclosed', { yes: 'Yes', no: 'No', prefer_not: 'Prefers not to say', not_given: 'Not answered' }[pe.disclosure as string] || pe.disclosure);
    if (pe.helpTypes?.length) kv('Disclosed help types', pe.helpTypes.join(', '));
  }

  h2('My Thinking Footprint (self-reported, supporting context only)');
  if (!fp) body('The student did not provide a Thinking Footprint.');
  else {
    const qs: [string, string][] = [['original_idea', 'Original idea'], ['research_method', 'How the topic was researched'], ['used_ai', 'Used AI tools'], ['ai_tools', 'Tools used'],
      ['ai_help_detail', 'How AI helped'], ['independent_parts', 'Parts written independently'], ['learnings', 'What was learned'], ['main_argument', 'Main argument in own words'], ['reflection', 'Reflection'], ['references_list', 'References & sources']];
    for (const [k, l] of qs) if (fp[k]) { ensure(30); kv(l, k === 'used_ai' ? ({ yes: 'Yes', no: 'No', prefer_not: 'Prefers not to say' } as any)[fp[k]] : String(fp[k]).slice(0, 1200)); doc.moveDown(0.15); }
    if (fp.ai_help_types?.length) kv('Types of AI help', fp.ai_help_types.join(', '));
    if (fp.drafts) kv('Drafts', `${String(fp.drafts).split(/\s+/).length} words supplied`);
  }

  if (journey?.length > 1) {
    h2('Learning Journey (this student, authorised records only)');
    for (const j of journey) { ensure(16); body(`${j.createdAt.slice(0, 10)}  ${j.title} (${j.subject}) - ${j.analysed ? `independent ${j.independentPct}% / AI-assisted ${j.aiPct}% / uncertain ${j.uncertainPct}%` : 'not analysed'}${j.teacherVerdict ? ' - teacher verified' : ''}`); }
  }

  h2('Teacher observations');
  const obs = [...feedback.map((f: any) => ({ at: f.createdAt, t: `${f.kind === 'clarification_request' ? 'Clarification requested' : f.kind === 'student_response' ? 'Student response' : 'Feedback'} - ${f.author}: ${f.message}` })),
    ...reviews.map((rv: any) => ({ at: rv.createdAt, t: rv.action === 'override' ? `Assessment updated by ${rv.teacherName}: ${VERDICTS[rv.updated_assessment?.verdict] || ''} (${rv.updated_assessment?.independentPct}/${rv.updated_assessment?.aiPct}/${rv.updated_assessment?.uncertainPct}). Previous: ${rv.previous_assessment ? `${rv.previous_assessment.independentPct}/${rv.previous_assessment.aiPct}/${rv.previous_assessment.uncertainPct}` : 'n/a'}. Reason: ${rv.reason}` : `Marked as reviewed by ${rv.teacherName}${rv.reason ? ': ' + rv.reason : ''}` }))]
    .sort((x, y) => String(x.at).localeCompare(String(y.at)));
  if (!obs.length) body('No teacher observations have been recorded yet.');
  for (const o of obs) { ensure(24); body(`${o.at} UTC - ${o.t}`); doc.moveDown(0.2); }

  if (r) {
    h2('Important limitations & disclaimer');
    for (const l of r.limitations) { ensure(20); body('-  ' + l); }
  }
  doc.moveDown(0.6);
  ensure(50);
  doc.roundedRect(56, doc.y, W, 44, 4).fill(C.sand);
  doc.fillColor(C.green).font('Helvetica-Bold').fontSize(8.5).text('Automated analysis cannot establish exact authorship. This report describes writing indicators only and must never, on its own, be used to grade, penalise or accuse a student.', 66, doc.y + 9, { width: W - 20 });

  const range = doc.bufferedPageRange();
  for (let i = 0; i < range.count; i++) {
    doc.switchToPage(i);
    doc.page.margins.bottom = 0;
    doc.font('Helvetica').fontSize(7.5).fillColor(C.grey).text(`Gram to Graph - SwaLekhan AI  |  Assignment #${a.id}  |  Page ${i + 1} of ${range.count}`, 56, doc.page.height - 38, { width: W, align: 'center', lineBreak: false });
  }
  doc.end();
}
