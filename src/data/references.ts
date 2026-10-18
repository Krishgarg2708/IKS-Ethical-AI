export interface ReferenceItem {
  id: string;
  category: 'Official Policy & Governance' | 'International Ethical Frameworks' | 'Classical Philosophical Foundations' | 'Contemporary Academic Research';
  title: string;
  authorOrInstitution: string;
  year: string;
  summary: string;
  relevanceToProject: string;
  url?: string;
}

export const VERIFIED_REFERENCES: ReferenceItem[] = [
  {
    id: 'ref-1',
    category: 'Official Policy & Governance',
    title: 'Responsible AI for All: Adopting the Framework – A Practice Guide for Operationalising Principles for AI',
    authorOrInstitution: 'NITI Aayog (National Institution for Transforming India), Government of India',
    year: '2021',
    summary: 'Comprehensive national policy documents delineating core principles of system safety, equality, non-discrimination, privacy, transparency, and accountability for AI systems deployed across public sectors in India.',
    relevanceToProject: 'Directly informs the project’s two safeguards: human oversight accountability gates and mandatory fairness testing across socio-economic strata.',
    url: 'https://www.niti.gov.in'
  },
  {
    id: 'ref-2',
    category: 'Official Policy & Governance',
    title: 'Indian Knowledge Systems (IKS) Division Guidelines & National Education Policy (NEP) 2020',
    authorOrInstitution: 'Ministry of Education & All India Council for Technical Education (AICTE), Government of India',
    year: '2020',
    summary: 'The national mandate to integrate traditional Indian epistemological approaches, ethical values, and holistic human development into contemporary higher education and scientific innovation.',
    relevanceToProject: 'Grounds the project’s educational philosophy of integrating ancient wisdom (Dharma, Ahimsa, Nyaya) into modern STEM and data science pedagogy.',
    url: 'https://iksindia.org'
  },
  {
    id: 'ref-3',
    category: 'International Ethical Frameworks',
    title: 'Recommendation on the Ethics of Artificial Intelligence',
    authorOrInstitution: 'UNESCO (United Nations Educational, Scientific and Cultural Organization)',
    year: '2021',
    summary: 'Adopted unanimously by 193 Member States, this landmark global standard establishes values of human rights, dignity, environmental flourishing, diversity, and the imperative that AI should never undermine human autonomy.',
    relevanceToProject: 'Mirrors the project’s emphasis on Ahimsa (non-harm) and the preservation of human dignity within algorithmic evaluation.',
    url: 'https://www.unesco.org/en/artificial-intelligence/recommendation-ethics'
  },
  {
    id: 'ref-4',
    category: 'International Ethical Frameworks',
    title: 'Ethically Aligned Design: A Vision for Prioritizing Human Well-being with Autonomous and Intelligent Systems',
    authorOrInstitution: 'IEEE Global Initiative on Ethics of Autonomous and Intelligent Systems',
    year: '2019',
    summary: 'A seminal engineering standard advocating that AI systems prioritize multi-dimensional human well-being, affective flourishing, and robust institutional accountability over reductive efficiency metrics.',
    relevanceToProject: 'Directly aligns with the project’s fourth pillar: Sarve Bhavantu Sukhinah and multi-attribute student flourishing over single-metric tracking.',
    url: 'https://standards.ieee.org'
  },
  {
    id: 'ref-5',
    category: 'Classical Philosophical Foundations',
    title: 'Taittiriya Upanishad (Shiksha Valli & Brahmananda Valli) & Nyaya Sutras of Aksapada Gautama',
    authorOrInstitution: 'Classical Indian Epistemological Traditions',
    year: 'c. 6th–2nd Century BCE',
    summary: 'Core treatises detailing the Panchakosha (five sheaths of human holistic embodiment) and the Nyaya epistemology of Pramana (verified valid knowledge), Paksata (contextual examination), and Dharmam Chara (duty-bound action).',
    relevanceToProject: 'Provides the interpretive conceptual foundation for rejecting reductive scalar modeling and mandating due inquiry before passing judgment.',
    url: 'https://iksindia.org/research'
  },
  {
    id: 'ref-6',
    category: 'Contemporary Academic Research',
    title: 'Algorithmic Injustice in Higher Education: Predictive Analytics and the Reinforcement of Historical Disadvantage',
    authorOrInstitution: 'ACM Conference on Fairness, Accountability, and Transparency (ACM FAccT)',
    year: '2022',
    summary: 'Peer-reviewed empirical studies exposing how university dropout risk algorithms rely on digital trace proxies that systematically penalize low-income, first-generation, and rural students.',
    relevanceToProject: 'Directly validates the two core ethical risks analyzed in the interactive scenario: bias from proxy variables and psychological harm to student well-being.',
    url: 'https://facctconference.org'
  }
];
