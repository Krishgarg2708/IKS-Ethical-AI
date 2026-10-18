import { IKSPrinciple } from '../types';

export const IKS_PRINCIPLES: IKSPrinciple[] = [
  {
    id: 'dharma',
    sanskritName: 'Dharma (धर्म)',
    englishTitle: 'Responsibility & Human Stewardship',
    tagline: 'Righteous conduct, institutional duty, and unyielding human accountability.',
    shortDefinition: 'Dharma signifies the duty to act in alignment with cosmic balance, truth, and community welfare. In technology, it requires that humans retain ultimate moral agency and responsibility for automated decisions.',
    philosophicalRoot: 'Derived from the Sanskrit root "dhr" (to uphold or sustain). Expounded in texts like the Mahabharata and Taittiriya Upanishad, emphasizing that authority without moral responsibility disrupts societal equilibrium (lokasamgraha).',
    modernAIAggregation: 'Translates to Human-in-the-Loop (HITL) governance, explainable artificial intelligence (XAI), and unassailable institutional accountability where automated models can never be used as a moral shield to deflect liability.',
    practicalExample: 'When an academic predictive model flags a student for academic probation, institutional Dharma mandates that a dedicated human educator conducts an in-person qualitative review before any penalty or official notice is issued.',
    interactiveScenarioPrompt: 'Deploy human oversight protocol onto an automated flagging algorithm.',
    interactiveEffect: 'Prevents unilateral algorithmic dismissal; forces a mandatory human rationale record and appeal bridge.'
  },
  {
    id: 'ahimsa',
    sanskritName: 'Ahimsa (अहिंसा)',
    englishTitle: 'Non-Harm & Preservation of Dignity',
    tagline: 'Active minimization of psychological, academic, and structural injury.',
    shortDefinition: 'Ahimsa transcends mere non-violence; it is the positive commitment to cause no distress in thought, word, or deed. In AI systems, it demands the elimination of punitive stigmatization and demoralizing classifications.',
    philosophicalRoot: 'Foundational to Vedic, Buddhist, and Jaina traditions, particularly codified in the Patanjali Yoga Sutras (2.35). It emphasizes that institutional systems must nurture human potential rather than inflict avoidable psychological trauma.',
    modernAIAggregation: 'In AI deployment, Ahimsa dictates harm impact assessments, safe failure modes, non-stigmatizing interface language, and ensuring algorithmic interventions empower rather than dishearten vulnerable learners.',
    practicalExample: 'Instead of branding a struggling student with a visible "High Failure Risk" badge that damages self-efficacy, the system discreetly notifies academic counsellors to offer supportive study resources without negative labels.',
    interactiveScenarioPrompt: 'Apply non-stigmatizing interface terminology and supportive intervention routing.',
    interactiveEffect: 'Transforms a punitive disciplinary notice into an empowering academic mentorship invitation.'
  },
  {
    id: 'nyaya-samata',
    sanskritName: 'Nyaya & Samata (न्याय एवं समता)',
    englishTitle: 'Fairness, Contextual Equity & Justice',
    tagline: 'Rigorous inquiry, unbiased evaluation, and consideration of situated reality.',
    shortDefinition: 'Nyaya represents rigorous logical inquiry and just adjudication, while Samata embodies egalitarian fairness. Together, they require that evaluation criteria account for unequal starting conditions and asymmetric resources.',
    philosophicalRoot: 'Nyaya Darshana (one of the six classical schools of Indian philosophy founded by Aksapada Gautama) emphasizes valid knowledge (Pramana) and multi-sided examination (Paksata) before reaching a conclusion.',
    modernAIAggregation: 'Translates to algorithmic fairness testing, detection of proxy variables (e.g., zip codes or IP addresses standing in for economic disadvantage), and contextual awareness rather than blind uniformity.',
    practicalExample: 'Recognizing that students residing in rural zones experience frequent electrical and broadband interruptions, an evaluation model does not equate midnight LMS upload delays with lack of intellectual diligence.',
    interactiveScenarioPrompt: 'Activate contextual socio-technical adjustment to evaluation weighting.',
    interactiveEffect: 'Normalizes assignment timelines against documented regional infrastructure constraints.'
  },
  {
    id: 'holistic-wellbeing',
    sanskritName: 'Sarve Bhavantu Sukhinah (सर्वे भवन्तु सुखिनः)',
    englishTitle: 'Holistic Well-being & Multi-Dimensional Growth',
    tagline: 'Evaluating human flourishing across intellectual, emotional, and social dimensions.',
    shortDefinition: 'The vision of universal welfare, coupled with the Taittiriya Upanishadic framework of the Panchakosha (five sheaths of human existence), insists that human growth cannot be reduced to narrow numeric metrics.',
    philosophicalRoot: 'Rooted in the Brihadaranyaka Upanishad and the Panchakosha model: Annamaya (physical), Pranamaya (vital energy), Manomaya (mental/emotional), Vijnanamaya (intellectual), and Anandamaya (blissful selfhood).',
    modernAIAggregation: 'Replaces single-metric optimization (such as exam scores or attendance percentages) with multi-objective evaluations that monitor stress levels, creative curiosity, collaborative contribution, and personal resilience.',
    practicalExample: 'A university evaluation architecture that pairs academic grade tracking with voluntary wellness check-ins, recognizing that an overburdened caregiver student has demonstrated extraordinary character and resilience.',
    interactiveScenarioPrompt: 'Expand single-scalar metric into a holistic multidimensional flourishing matrix.',
    interactiveEffect: 'Broadens the student profile from a 68% attendance scalar into a multi-attribute developmental profile.'
  }
];
