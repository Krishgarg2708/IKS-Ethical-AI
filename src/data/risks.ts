import { EthicalRisk } from '../types';

export const ETHICAL_RISKS: EthicalRisk[] = [
  {
    id: 'bias-unfair-treatment',
    title: 'Bias and Unfair Treatment',
    shortDescription: 'Disproportionate academic disadvantage resulting from unrepresentative data, rigid proxy metrics, and neglect of asymmetric socio-technical access.',
    rootCause: [
      'Historical training data reflecting systemic socio-economic privileges rather than intrinsic learning ability.',
      'Treating continuous high-speed broadband and campus proximity as unstated default conditions.',
      'Using digital trace data (LMS click frequency, login timestamps) as proxies for student intellectual engagement.',
      'Absence of subgroup fairness auditing across diverse regional, economic, and linguistic student populations.'
    ],
    exampleSituation: 'A first-generation university student living in a rural area must travel 12 kilometers to access broadband. The institutional predictive system monitors LMS access frequency at 10:00 PM and flags the student as "disengaged", recommending an automated academic probation alert.',
    whoIsAffected: [
      'Students from rural or digitally marginalized households',
      'Working students financing their own higher education',
      'Students with caregiving or family duties',
      'Neurodivergent students who absorb material asynchronously rather than in standard video attendance streams'
    ],
    possibleConsequences: [
      'Unwarranted denial of merit scholarships or honors track placements',
      'Reinforcement of historical socio-economic inequities within the university pipeline',
      'Erosion of trust between student communities and institutional administration',
      'Erroneous predictive feedback that misleads academic advisors'
    ],
    relevantPrinciples: [
      'Nyaya & Samata (Fairness, Contextual Equity & Justice)',
      'Dharma (Institutional Responsibility & Moral Duty)'
    ],
    severityAssessments: [
      {
        level: 'Low',
        educationalNote: 'Minor discrepancy in tracking non-credit supplementary tasks; easily noticed and resolved during standard office hours without formal academic penalty.'
      },
      {
        level: 'Moderate',
        educationalNote: 'Systematic score reduction on minor homework weightings for students submitting via mobile tethering; requires manual grade book adjustments by faculty.'
      },
      {
        level: 'Severe',
        educationalNote: 'Automated revocation of scholarship eligibility or disqualification from elective courses due to uncorrected algorithmic flags. High institutional liability.'
      },
      {
        level: 'Critical',
        educationalNote: 'System-wide compounding disadvantage where marginalized cohorts are disproportionately tracked into remedial streams without human recourse. Structural injustice.'
      }
    ]
  },
  {
    id: 'harm-to-student-wellbeing',
    title: 'Harm to Student Well-being',
    shortDescription: 'Psychological distress, demoralization, loss of self-efficacy, and social stigma induced by reductive predictive labeling and automated surveillance.',
    rootCause: [
      'Reduction of a living human learner to a deterministic numerical "risk score".',
      'Deficit-oriented labeling ("Probable Dropout", "Chronic Deficit") that induces the Pygmalion / Golem effect.',
      'Absence of empathetic human communication when communicating automated assessments.',
      'Constant background behavioral surveillance creating an environment of fear and algorithmic compliance rather than curiosity.'
    ],
    exampleSituation: 'An otherwise capable student experiencing a sudden personal bereavement misses three classes. The automated system generates a red banner on the student portal: "ACADEMIC FAILURE RISK: HIGH". The student internalizes the label, suffers severe anxiety, and ceases attending lectures entirely.',
    whoIsAffected: [
      'Students coping with acute personal or medical emergencies',
      'Scholars battling imposter syndrome or first-year adjustment stress',
      'Educators whose pedagogical relationships are mediated and distorted by rigid statistical dashboards',
      'The broader academic culture, which shifts from mentorship to algorithmic policing'
    ],
    possibleConsequences: [
      'Self-fulfilling prophetic decline in student academic performance and retention',
      'Severe escalation of anxiety, depressive symptoms, and withdrawal from peer study groups',
      'Dehumanization of the teaching profession, reducing teachers to dashboard processors',
      'Permanent alienation of promising minds from higher education'
    ],
    relevantPrinciples: [
      'Ahimsa (Non-Harm & Preservation of Dignity)',
      'Sarve Bhavantu Sukhinah (Holistic Well-being & Panchakosha)'
    ],
    severityAssessments: [
      {
        level: 'Low',
        educationalNote: 'Brief student confusion regarding an automated calendar prompt; easily clarified with an informal advisor chat.'
      },
      {
        level: 'Moderate',
        educationalNote: 'Heightened exam anxiety sparked by a cautionary email dashboard notice; addressed through supportive peer tutoring.'
      },
      {
        level: 'Severe',
        educationalNote: 'Acute demoralization and clinical stress resulting from public or semi-public risk flagging; student considers academic withdrawal.'
      },
      {
        level: 'Critical',
        educationalNote: 'Widespread psychological harm across the student body, culture of fear, and erosion of mental health support mechanisms replaced by surveillance algorithms.'
      }
    ]
  }
];
