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
    question: 'How does the concept of Panchakosha (five layers of human existence) challenge conventional single-metric student evaluation?',
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
    explanation: 'Nyaya epistemology teaches that valid knowledge (Prama) requires verified sources (Pramana: perception, inference, comparison, testimony). Treating a faulty biometric RFID swipe or a missed morning click as definitive proof of low intellect violates the standard of sound knowledge.',
    iksConcept: 'Nyaya (Pramana & Epistemic Rigor)'
  },
  {
    id: 'q7',
    question: 'How should scholarly institutions frame the relationship between ancient Indian philosophical concepts and modern machine learning ethics?',
    options: [
      'As a historical claim that ancient Indian texts directly described modern digital computer algorithms.',
      'As an interpretive application of timeless ethical and epistemological frameworks to modern technological challenges, promoting thoughtful human-centred AI governance.',
      'As an argument that modern computer science should be abandoned entirely in favor of oral memorization.',
      'As an aesthetic marketing theme that requires no operational changes in university software.'
    ],
    correctIndex: 1,
    explanation: 'Rigorous academic research treats IKS as an interpretive, rich conceptual reservoir offering profound insights into duty (Dharma), non-violence (Ahimsa), equity (Nyaya), and holistic flourishing (Sukhinah), without falsely asserting that ancient sages literally engineered digital neural networks.',
    iksConcept: 'Academic Integrity & Epistemic Nuance'
  }
];
