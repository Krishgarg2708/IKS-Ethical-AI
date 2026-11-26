import { test } from 'node:test';
import assert from 'node:assert/strict';
import { analyse, toPercentages } from '../analysis/engine.ts';
import { nyayaCheck } from '../analysis/fairness.ts';
import { segmentParagraphs } from '../analysis/text.ts';

const PERSONAL = `In my village near Sitapur, every summer the hand pump goes dry by May. My grandmother remembers a time when the old pond behind the temple held water until the monsoon. I wanted to find out what changed, so I asked around.

I talked to three farmers and our panchayat secretary. Ramesh chacha told me the pond was filled with mud in 2009 when the new road was built. Nobody cleaned it after that! Is it surprising that the water table fell? I don't think so, honestly.

We measured two wells with a rope (it took a whole Sunday). One was 38 feet, the other 41 feet. Ten years ago people say it was around 25 feet. My idea is that if we desilt the pond and build small check dams, rain water will stay longer in the ground.`;

const STOCK = `Artificial intelligence plays a crucial role in modern education systems across the world today. It is important to note that these systems analyse student data quickly, efficiently, and accurately. Furthermore, they identify patterns that educators may overlook. Moreover, they provide personalised feedback at scale. Additionally, they reduce administrative workload significantly.

Moreover, it is essential to consider the ethical implications of these technologies carefully. In the realm of fairness, algorithms trained on urban data can misjudge learners. This underscores the importance of human oversight, transparency, and accountability. Furthermore, institutions must navigate the complexities of data privacy. Ultimately, a holistic approach is required for success.

In conclusion, AI serves as a powerful tool for educational transformation in the modern era. It is worth noting that responsible adoption, careful governance, and continuous evaluation are needed. Furthermore, stakeholders must collaborate effectively. Consequently, the potential of AI can be fully realised for every learner.`;

test('percentages always sum to exactly 100', () => {
  for (const s of [[1, 1, 1], [0.333, 0.333, 0.334], [5, 0, 0], [0.1, 0.7, 0.2], [0, 0, 0]]) {
    const p = toPercentages(s);
    assert.equal(p.reduce((a, b) => a + b, 0), 100, JSON.stringify(s));
  }
});

test('analysis is deterministic (no randomness)', async () => {
  const a = await analyse({ text: PERSONAL });
  const b = await analyse({ text: PERSONAL });
  assert.deepEqual([a.independentPct, a.aiPct, a.uncertainPct], [b.independentPct, b.aiPct, b.uncertainPct]);
});

test('personal, specific writing leans independent; stock prose leans AI-assisted', async () => {
  const p = await analyse({ text: PERSONAL });
  const s = await analyse({ text: STOCK });
  assert.equal(p.independentPct + p.aiPct + p.uncertainPct, 100);
  assert.equal(s.independentPct + s.aiPct + s.uncertainPct, 100);
  assert.ok(p.independentPct > p.aiPct, `personal: ${JSON.stringify([p.independentPct, p.aiPct])}`);
  assert.ok(s.aiPct > s.independentPct, `stock: ${JSON.stringify([s.independentPct, s.aiPct])}`);
  assert.ok(s.paragraphs.every(x => x.aiLikelihood > 0.5));
  assert.ok(p.paragraphs.every(x => x.aiLikelihood < 0.5));
  assert.equal(p.method, 'heuristic');
});

test('heuristic never claims more than 85% confidence and always leaves some uncertainty', async () => {
  const s = await analyse({ text: STOCK });
  assert.ok(s.paragraphs.every(x => x.confidence <= 0.85));
  assert.ok(s.uncertainPct > 0);
});

test('Nyaya: disclosure of translation can only raise uncertainty, never the AI estimate', async () => {
  const base = await analyse({ text: STOCK });
  const tr = await analyse({ text: STOCK, disclosure: { usedAi: 'yes', helpTypes: ['translation', 'grammar'] } });
  assert.ok(tr.uncertainPct > base.uncertainPct);
  assert.ok(tr.aiPct <= base.aiPct);
  assert.ok(tr.fairness.warnings.some(w => w.code === 'translation_disclosed'));
});

test('Nyaya: simple English and multilingual text get warnings, not penalties', () => {
  const simple = 'I go to school. I like my school. My teacher is good. We read books. We play games. I help my mother at home. I like to learn new things. My village is small. ';
  const r = nyayaCheck(simple.repeat(4), [simple, simple, simple], {});
  assert.ok(r.warnings.some(w => w.code === 'simple_english'));
  assert.ok(r.confidenceFactor < 1);
  const mixed = 'मेरा गाँव बहुत सुंदर है. Our village has a pond and the farmers use it for irrigation every year during the summer months.';
  assert.ok(nyayaCheck(mixed, [mixed], {}).warnings.some(w => w.code === 'multilingual'));
});

test('advanced vocabulary alone is not an AI signal', async () => {
  const plain = `The committee examined the irrigation proposal and found that the cost was reasonable for the village. The farmers agreed with the plan after a long meeting in the evening. We decided to begin the work in March before the heat arrived.`;
  const fancy = `The committee scrutinised the irrigation proposal and found that the expenditure was judicious for the hamlet. The cultivators concurred with the scheme after a protracted assembly in the evening. We resolved to commence the endeavour in March before the heat arrived.`;
  const a = await analyse({ text: plain }), b = await analyse({ text: fancy });
  assert.equal(a.paragraphs[0].aiLikelihood, b.paragraphs[0].aiLikelihood);
});

test('drafts that match the final text count as independent process evidence', async () => {
  const without = await analyse({ text: STOCK });
  const withDraft = await analyse({ text: STOCK, drafts: STOCK.split('\n\n')[0] });
  assert.ok(withDraft.paragraphs[0].aiLikelihood < without.paragraphs[0].aiLikelihood);
  assert.ok(withDraft.processEvidence.draftsProvided);
});

test('external AI failure falls back to heuristic with a clear limitation', async () => {
  const r = await analyse({ text: PERSONAL }, async () => { throw new Error('HTTP 503'); });
  assert.equal(r.method, 'heuristic');
  assert.ok(r.limitations.some(l => l.includes('unavailable')));
});

test('too little text is refused instead of producing a report', async () => {
  await assert.rejects(analyse({ text: 'Too short to analyse.' }));
});

test('PDF-style hard-wrapped lines are re-joined into paragraphs', () => {
  const t = 'This is a long line of a paragraph that was wrapped by the PDF\nrenderer in the middle of a sentence and continues here on the\nnext line until it ends.\nA new paragraph starts here and it also goes on for quite a while longer.';
  const p = segmentParagraphs(t);
  assert.equal(p.length, 2);
});
