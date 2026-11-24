import { EthicalSafeguard } from '../types';

export const ETHICAL_SAFEGUARDS: EthicalSafeguard[] = [
  {
    id: 'human-oversight-accountability',
    title: 'Human Oversight and Accountability',
    subtitle: 'Preserving human moral agency, educator discretion, and institutional stewardship over automated decisions.',
    mitigatesRiskIds: ['bias-unfair-treatment', 'harm-to-student-wellbeing'],
    keyFeatures: [
      'Mandatory educator qualitative review before any consequential academic action or formal notice.',
      'Documented decision-making process where human reasoning is archived alongside algorithmic outputs.',
      'Accessible, transparent appeal mechanism enabling students to challenge both inputs and inferences.',
      'Unambiguous institutional ownership: named faculty and academic committees retain full legal and moral responsibility.',
      'Written justification requirement whenever an educator acts upon or overrides an algorithmic recommendation.'
    ],
    iksConnection: 'Deeply grounded in Dharma (institutional responsibility) and the Guru-Shishya tradition, where educational mentorship is fundamentally a sacred interpersonal relationship of moral duty, never an unmonitored mechanical transaction.',
    controls: [
      {
        id: 'ctrl-1',
        title: 'Mandatory Human Review Gate',
        description: 'Prohibit automated generation of disciplinary warnings, course drops, or probation without prior faculty evaluation.',
        mitigatesRisk: 'Both',
        relatedPrinciple: 'Dharma',
        status: 'implemented'
      },
      {
        id: 'ctrl-2',
        title: 'Right to Contest & Due Process',
        description: 'Provide students a 14-day window and user-friendly portal to question automated inferences and provide mitigating context.',
        mitigatesRisk: 'Risk 1: Bias',
        relatedPrinciple: 'Nyaya',
        status: 'implemented'
      },
      {
        id: 'ctrl-3',
        title: 'Audit Trail & Justification Ledger',
        description: 'Maintain an immutable record of when advisors agreed with or overrode algorithmic recommendations, including textual reasons.',
        mitigatesRisk: 'Risk 1: Bias',
        relatedPrinciple: 'Dharma',
        status: 'pending'
      },
      {
        id: 'ctrl-4',
        title: 'Institutional Ownership Roster',
        description: 'Publish clear institutional responsibility matrices so every automated metric has a designated faculty ethics officer accountable for its outcomes.',
        mitigatesRisk: 'Risk 2: Well-being',
        relatedPrinciple: 'Dharma',
        status: 'pending'
      },
      {
        id: 'ctrl-5',
        title: 'Compassionate Advisor Intervention Training',
        description: 'Train academic advisors to use AI insights strictly as prompts for supportive, empathetic mentoring conversations rather than punitive audits.',
        mitigatesRisk: 'Risk 2: Well-being',
        relatedPrinciple: 'Ahimsa',
        status: 'unimplemented'
      }
    ]
  },
  {
    id: 'fairness-testing-student-centred-design',
    title: 'Fairness Testing and Student-Centred Design',
    subtitle: 'Systematic bias mitigation, privacy preservation, representative data curation, and multi-dimensional well-being safeguards.',
    mitigatesRiskIds: ['bias-unfair-treatment', 'harm-to-student-wellbeing'],
    keyFeatures: [
      'Regular pre-deployment and post-deployment fairness audits across socio-economic, linguistic, and regional student cohorts.',
      'Strict data minimization: exclude sensitive proxy variables (e.g. pin codes, family income brackets, device models) from predictive weights.',
      'Self-service rectification protocol allowing students to correct faulty biometric or attendance records swiftly.',
      'Asynchronous & offline accommodations: adjusting participation metrics to respect variable broadband access.',
      'Continuous psychological harm monitoring to ensure predictive dashboards do not induce student anxiety or stigma.',
      'Dynamic recalibration of risk models as student circumstances evolve over the semester.'
    ],
    iksConnection: 'Reflects Nyaya (rigorous examination of evidence), Ahimsa (prevention of algorithmic distress and injury), and the holistic Panchakosha ideal that nurtures the complete individual rather than optimizing an isolated metric.',
    controls: [
      {
        id: 'ctrl-6',
        title: 'Disaggregated Subgroup Bias Auditing',
        description: 'Conduct quarterly statistical parity and false-positive rate comparisons across rural, urban, and economically diverse student segments.',
        mitigatesRisk: 'Risk 1: Bias',
        relatedPrinciple: 'Nyaya',
        status: 'implemented'
      },
      {
        id: 'ctrl-7',
        title: 'Data Minimization & Proxy Scrubbing',
        description: 'Strip home address coordinates, device hardware identifiers, and continuous location telemetry from predictive models.',
        mitigatesRisk: 'Risk 1: Bias',
        relatedPrinciple: 'Nyaya',
        status: 'implemented'
      },
      {
        id: 'ctrl-8',
        title: 'Non-Stigmatizing Interface Design',
        description: 'Replace deficit labels (e.g. "High Dropout Risk") with supportive developmental prompts (e.g. "Study Support Resources Available").',
        mitigatesRisk: 'Risk 2: Well-being',
        relatedPrinciple: 'Ahimsa',
        status: 'pending'
      },
      {
        id: 'ctrl-9',
        title: 'Asynchronous Broadband Tolerance Buffers',
        description: 'Implement a grace period for digital submissions and calculate engagement through offline pack downloads rather than live stream pings.',
        mitigatesRisk: 'Risk 1: Bias',
        relatedPrinciple: 'Samata',
        status: 'pending'
      },
      {
        id: 'ctrl-10',
        title: 'Holistic Flourishing Radar Integration',
        description: 'Pair academic indicators with voluntary student self-reported wellness and advisor qualitative notes to prevent one-dimensional reductionism.',
        mitigatesRisk: 'Risk 2: Well-being',
        relatedPrinciple: 'Holistic Well-being',
        status: 'unimplemented'
      }
    ]
  }
];
