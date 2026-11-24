import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'How does the IKS principle of Ahimsa (non-harm) specifically apply to the design of AI-driven student evaluation systems?',
    options: [
      'By requiring AI systems to only use positive grading curves that give everyone top marks.',
      'By eliminating punitive deficit-based labeling, preventing psychological distress, and ensuring algorithmic interventions prioritize student dignity and support.',
      'By prohibiting any form of testing or performance assessment in academic institutions.',
      'By replacing all digital computer systems with ancient palm-leaf manuscript records.'
    ],
    correctIndex: 1,
    explanation: 'Ahimsa in computational ethics focuses on actively avoiding psychological, emotional, and structural harm. In student analytics, this means replacing demoralizing stigma ("High Failure Risk") with constructive, dignifying academic support pathways.',
    iksConcept: 'Ahimsa (Non-Harm & Dignity)'
  },
  {
    id: 'q2',
    question: 'Under the principle of Dharma (responsibility and moral duty), what is the non-negotiable role of human educators when an AI model recommends disciplinary action?',
    options: [
      'Educators should rubber-stamp the AI recommendation within 60 seconds to maintain algorithmic efficiency.',
      'Educators must abdicate judgment completely since predictive algorithms are mathematically unbiased.',
      'Educators must exercise qualitative review, understand the student’s lived context, and retain ultimate moral and legal accountability for any decision.',
      'Educators should only review the decision if the student pays a formal institutional appeal deposit.'
    ],
    correctIndex: 2,
    explanation: 'Dharma insists that moral agency belongs exclusively to humans. An algorithmic score is merely an informational tool, not a decision-maker. Institutional leaders and educators bear full responsibility for actions taken.',
    iksConcept: 'Dharma (Responsibility & Oversight)'
  },
  {
    id: 'q3',
    question: 'What is a major root cause of algorithmic bias in university performance prediction systems?',
    options: [
      'Students intentionally confusing the AI by using different colored notebooks.',
      'Using digital proxies (such as continuous high-speed LMS interactions or timestamped midnight submissions) that conflate socioeconomic bandwidth access with intellectual capability.',
      'The computer processor running at varying clock speeds in hot weather.',
      'Translating ancient Sanskrit sutras into Python code syntax.'
    ],
    correctIndex: 1,
    explanation: 'When systems rely on digital trace proxies like late-night upload speeds or video stream lengths, they inadvertently penalize students facing rural digital divides, intermittent electricity, or family work duties—mistaking lack of bandwidth for lack of merit.',
    iksConcept: 'Nyaya (Contextual Fairness & Evidence)'
  },
  {
    id: 'q4',
    question: 'A rural student has 62% attendance but cares for her family, commutes 3 hours a day and still passes every exam. How does Panchakosha challenge an AI that judges her by attendance alone?',
    options: [
      'It suggests students should only be evaluated on their physical athletic prowess.',
      'It insists that human beings possess multi-dimensional dimensions (physical, energetic, emotional, intellectual, and deeper selfhood) that cannot be reduced to a single attendance or grade percentage.',
      'It requires five separate AI algorithms to run simultaneously on every test.',
      'It claims that academic evaluations should be conducted strictly once every five years.'
    ],
    correctIndex: 1,
    explanation: 'The Taittiriya Upanishad’s Panchakosha model illuminates that human flourishing encompasses physical stamina, emotional equilibrium, intellectual curiosity, and purposeful ethics. Reducing a student to an automated "risk score" ignores their holistic resilience and character.',
    iksConcept: 'Holistic Well-being (Panchakosha)'
  },
  {
    id: 'q5',
    question: 'Which of the following describes the "Safeguard of Human Oversight and Accountability"?',
    options: [
      'Requiring a mandatory teacher review before consequential academic decisions, an audit trail of rationale, and an accessible student appeal channel.',
      'Hiring an external consulting firm to delete student records once a year.',
      'Installing more biometric cameras to monitor teachers during lecture delivery.',
      'Allowing an AI chatbot to automatically send expulsion notices directly to parents.'
    ],
    correctIndex: 0,
    explanation: 'Human oversight safeguards mandate that consequential life or academic impacts are never automated; faculty must evaluate context, document reasons for choices, and provide learners a clear avenue to challenge erroneous predictions.',
    iksConcept: 'Dharma & Institutional Governance'
  },
  {
    id: 'q6',
    question: 'In Indian epistemology (Nyaya Darshana), Pramana refers to valid means of knowledge. In ethical AI, what does this warn us against?',
    options: [
      'Using open-source software libraries in university portals.',
      'Mistaking unverified proxy variables and statistical noise for genuine empirical truth (Satya) about a student’s capability.',
      'Allowing students to read physical textbooks in the library.',
      'Teaching mathematical logic to computer engineering students.'
    ],
    correctIndex: 1,
    explanation: 'Nyaya epistemology teaches that valid knowledge (Prama) requires verified sources (Pramana: perception, inference, comparison, testimony). Treating a missed login caused by a power cut, or a late upload over 2G, as definitive proof of low ability violates the standard of sound knowledge.',
    iksConcept: 'Nyaya (Pramana & Epistemic Rigor)'
  },
  {
    id: 'q7',
    question: 'When this project uses IKS to fix AI bias against rural students, how should the link between ancient philosophy and modern AI be presented?',
    options: [
      'As a historical claim that ancient Indian texts directly described modern digital computer algorithms.',
      'As an interpretive application of timeless ethical and epistemological frameworks to modern technological challenges, promoting thoughtful human-centred AI governance.',
      'As an argument that modern computer science should be abandoned entirely in favor of oral memorization.',
      'As an aesthetic marketing theme that requires no operational changes in university software.'
    ],
    correctIndex: 1,
    explanation: 'Rigorous academic research treats IKS as an interpretive, rich conceptual reservoir offering profound insights into duty (Dharma), non-violence (Ahimsa), equity (Nyaya), and holistic flourishing (Sukhinah), without falsely asserting that ancient sages literally engineered digital neural networks.',
    iksConcept: 'Academic Integrity & Epistemic Nuance'
    },
  {
    id: 'q8',
    question: 'A rural student on a shared phone logs into the LMS only twice a week but scores 80% in exams. What does Nyaya (valid evidence) suggest the AI should do?',
    options: [
      'Flag the student as disengaged, because the login count is low.',
      'Treat login frequency as an unreliable proxy for this student and give more weight to direct evidence of learning, such as exam and lab performance.',
      'Ask the student to log in more often so the data looks better.',
      'Remove the student from the dataset completely.'
    ],
    correctIndex: 1,
    explanation: 'Under Nyaya, knowledge has to rest on a valid pramana. Login counts here mostly reflect device and bandwidth access, while exam results are much more direct evidence of learning.',
    iksConcept: 'Nyaya (Pramana)'
  },
  {
    id: 'q9',
    question: 'An AI applies the same 75% attendance threshold to a hostel student and to a student with a 3-hour daily commute and frequent power cuts. Which principle shows why this is unfair?',
    options: [
      'Samata: equal rules on unequal ground produce unequal outcomes, so thresholds should account for context.',
      'Ahimsa: attendance should never be measured.',
      'Dharma: the AI alone is responsible for the decision.',
      'None. The same rule for everyone is always fair.'
    ],
    correctIndex: 0,
    explanation: 'Samata means equity, not identical treatment. Fairness means removing barriers that stop students from showing what they have learned.',
    iksConcept: 'Samata (Equity)'
  },
  {
    id: 'q10',
    question: 'In a cohort audit, the AI flags 78% of rural students but only 7% of urban students, even though both groups have the same exam ability. What does this disparity show?',
    options: [
      'Rural students are less capable.',
      'The model is probably measuring access conditions rather than learning, and needs a fairness review before it is used.',
      'The urban students must have cheated.',
      'Disparities between groups do not matter if the overall accuracy is high.'
    ],
    correctIndex: 1,
    explanation: 'When ability is the same but flag rates are very different, the gap comes from the features the model uses. Auditing results by group is a core safeguard, and it is the Samata check in practice.',
    iksConcept: 'Samata & Fairness Auditing'
  },
  {
    id: 'q11',
    question: 'The AI flags a first-generation student from a regional-medium background. What response best reflects Dharma and Ahimsa together?',
    options: [
      'Send an automatic "Academic Failure Risk" email to the student and their parents.',
      'Lower the student\'s internal grade so expectations are realistic.',
      'Have a mentor review the flag privately and offer bilingual resources, peer mentoring and flexible deadlines, without any punitive label.',
      'Ignore the flag, because AI flags are always wrong.'
    ],
    correctIndex: 2,
    explanation: 'Dharma keeps a human accountable for the decision. Ahimsa means the response should protect the student\'s dignity. The flag is a reason to offer support, not a verdict.',
    iksConcept: 'Dharma + Ahimsa'
  }
];
