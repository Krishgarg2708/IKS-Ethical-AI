import { SimulatorCase } from '../types';

export const SIMULATOR_CASES: SimulatorCase[] = [
  {
    id: 'case-1-misclassified-scholar',
    caseNumber: '01',
    title: 'The Asynchronous Achiever',
    context: 'The university AI predicts that Priya (a 3rd-year engineering student) has an 82% likelihood of failing Operating Systems based on a 52% recorded physical attendance in 8:00 AM lectures.',
    aiClassification: 'High Failure Risk — Trigger Automatic Academic Probation Alert',
    hiddenContext: 'Priya works a 4:00 AM to 7:00 AM logistics shift to support her ailing grandmother. She downloads lecture recordings every afternoon, submits top-decile code repositories on GitHub, and scores 88% on unannounced lab practicals.',
    choices: [
      {
        id: 'c1-auto',
        title: 'Endorse AI Prediction & Issue Formal Probation Warning',
        description: 'Trust the statistical correlation between morning attendance and historical student outcomes to enforce standard policy.',
        benefits: [
          'Strict, uniform application of university attendance rules',
          'Fast automated administrative throughput with zero faculty time expenditure'
        ],
        risks: [
          'Severe demoralization of a dedicated working scholar',
          'Damage to student confidence and unwarranted financial scholarship cancellation',
          'Algorithmic blindness to actual domain mastery demonstrated in laboratory projects'
        ],
        stakeholders: ['Student (Priya)', 'University Administration', 'Financial Aid Office'],
        applicablePrinciples: ['Breaches Ahimsa (inflicts psychological harm)', 'Breaches Dharma (abdicates human judgment)'],
        isRecommended: false,
        expertRationale: 'This choice treats correlation as causation and ignores demonstrable mastery. It inflicts unmerited harm (violating Ahimsa) and abdicates human mentorship responsibility (violating Dharma).'
      },
      {
        id: 'c1-override',
        title: 'Conduct Qualitative Faculty Review & Adjust Evaluation Modality',
        description: 'Have the course instructor evaluate Priya’s project code, meet during office hours, and formally accept asynchronous learning logs.',
        benefits: [
          'Preserves student dignity and recognizes real intellectual achievement',
          'Deepens faculty-student trust and mentorship bond',
          'Prevents false-positive academic penalty while upholding course rigor'
        ],
        risks: [
          'Requires 20–30 minutes of faculty time for personalized review',
          'Demands flexible administrative tracking for non-standard schedules'
        ],
        stakeholders: ['Student', 'Course Instructor', 'Academic Dean'],
        applicablePrinciples: ['Dharma (Duty of educator)', 'Nyaya (Contextual fairness)', 'Ahimsa (Protection against distress)'],
        isRecommended: true,
        expertRationale: 'This exemplifies true Dharma: the educator exercises moral agency and investigative inquiry (Nyaya), verifying real knowledge (Pramana) rather than blindly obeying a mechanistic metric.'
      },
      {
        id: 'c1-hybrid',
        title: 'Require Immediate Make-Up Morning Attendance with No Review',
        description: 'Offer a conditional waiver if the student signs an attendance contract promising 90% morning attendance for the rest of term.',
        benefits: [
          'Maintains traditional classroom attendance standard without immediate failure'
        ],
        risks: [
          'Forces the student to choose between family survival (employment) and degree completion',
          'Fails to investigate the root cause of the absence pattern',
          'Increases chronic sleep deprivation and burnout'
        ],
        stakeholders: ['Student', 'Family dependents', 'Student Health Center'],
        applicablePrinciples: ['Neglects Holistic Well-being', 'Superficial compliance without compassion'],
        isRecommended: false,
        expertRationale: 'While superficially appearing to offer a compromise, this ultimatum ignores the human reality of economic necessity and physical well-being (Annamaya and Pranamaya koshas).'
      }
    ]
  },
  {
    id: 'case-2-connectivity-disparity',
    caseNumber: '02',
    title: 'The Bandwidth Divide',
    context: 'The automated learning analytics system deducts 15% from Rohan’s weekly continuous assessment score because assignments are consistently submitted at 11:58 PM, and his LMS video interaction duration is 40% below the class median.',
    aiClassification: 'Chronic Procrastination & Low Engagement Flag',
    hiddenContext: 'Rohan lives in a rural hamlet with 2G mobile connectivity and frequent rolling blackouts. He walks 4 kilometers every Saturday to a community digital kiosk to download lecture transcripts in batch, studying offline from printed texts.',
    choices: [
      {
        id: 'c2-auto',
        title: 'Retain Automated Late-Window Deductions',
        description: 'Enforce timestamp deadlines uniformly across all enrolled students to ensure competitive standardization.',
        benefits: [
          'Uniform rule enforcement without subjective variance',
          'Encourages early preparation for urban students with continuous power'
        ],
        risks: [
          'Penalizes geographic and economic disadvantage rather than academic understanding',
          'Encourages student drop-out among rural cohorts',
          'Directly violates equity principles by treating unequal realities as identical'
        ],
        stakeholders: ['Rural student cohort', 'Department Chair', 'LMS Analytics Vendor'],
        applicablePrinciples: ['Breaches Samata (true equity requires contextual awareness)', 'Breaches Nyaya'],
        isRecommended: false,
        expertRationale: 'Samata (equitable justice) establishes that treating deeply unequal circumstances with rigid formal equality yields profound injustice. Real fairness requires recognizing socio-technical asymmetries.'
      },
      {
        id: 'c2-offline-buffer',
        title: 'Grant Asynchronous Offline Grace Windows & Batch Submission Parity',
        description: 'Allow verified low-bandwidth students to submit weekly packets on weekly collection days without automated penalty, evaluating offline reading logs.',
        benefits: [
          'Removes artificial systemic barriers for rural and underprivileged scholars',
          'Aligns institutional metrics with true learning rather than high-speed internet availability',
          'Fosters an inclusive educational ecosystem'
        ],
        risks: [
          'Requires instructors to manage dual submission timelines for batch submissions'
        ],
        stakeholders: ['Rural students', 'Faculty graders', 'Digital Access Working Group'],
        applicablePrinciples: ['Nyaya & Samata (Contextual justice)', 'Ahimsa (Preventing systemic harm)', 'Lokasamgraha (Universal public welfare)'],
        isRecommended: true,
        expertRationale: 'This policy aligns institutional operations with Lokasamgraha (upliftment of all) and Samata, dismantling proxy discrimination while preserving high academic standards.'
      },
      {
        id: 'c2-loaner',
        title: 'Offer Mobile Hotspot Device with Strict Mandatory Daily Zoom Check-ins',
        description: 'Provide a cellular dongle from university emergency funds on the condition that the student logs into live video feeds every day.',
        benefits: [
          'Provides tangible hardware assistance to address digital disparity'
        ],
        risks: [
          'Fails if the student’s rural geography lacks cellular tower reception regardless of dongle',
          'Imposes surveillance check-in burden on a student already navigating challenging logistics'
        ],
        stakeholders: ['Student', 'IT Helpdesk', 'Campus Aid Fund'],
        applicablePrinciples: ['Well-intentioned but lacks deep contextual inquiry (Nyaya)'],
        isRecommended: false,
        expertRationale: 'Technical subsidies are commendable, but conditioning support on rigid video surveillance displays technical ignorance of rural topography and adds stress rather than holistic relief.'
      }
    ]
  },
  {
    id: 'case-3-faculty-dissent',
    caseNumber: '03',
    title: 'The Disputed Classroom Presence',
    context: 'An AI computer-vision engagement tracking camera installed in lecture halls assigns Ananya a 34/100 "Inattentive / Non-Participatory" score because she rarely raises her hand, looks down frequently, and exhibits minimal facial expressions.',
    aiClassification: 'Passive Disengagement — Recommend Advisor Intervention for Disciplinary Review',
    hiddenContext: 'Dr. Sen, the senior philosophy and logic professor, notes that Ananya takes exhaustive handwritten Sanskrit and analytic philosophy syntheses during class. Her end-of-term seminar essay submitted to Dr. Sen was peer-reviewed as the most original paper of the semester.',
    choices: [
      {
        id: 'c3-trust-ai',
        title: 'Prioritize Sensor Dashboard Over Professor’s Qualitative Note',
        description: 'Maintain the low participation score in the central university grade book, arguing that sensor telemetry is objective and immune to human favoritism.',
        benefits: [
          'Data-driven standardization across all multi-section course cohorts'
        ],
        risks: [
          'Replaces genuine human pedagogy with pseudoscience and biomechanical surveillance',
          'Penalizes deep reflective thinkers, introverts, and non-Western learning modes',
          'Destroys the sacred trust of the Guru-Shishya pedagogical dialogue'
        ],
        stakeholders: ['Student', 'Professor Dr. Sen', 'Academic Senate'],
        applicablePrinciples: ['Violates Dharma (displaces human wisdom with mechanical proxy)', 'Violates Ahimsa'],
        isRecommended: false,
        expertRationale: 'Reducing intellectual engagement to facial twitches or hand-raising gestures commits an epistemic fallacy. Nyaya emphasizes that direct perception (Pratyaksha) and inference must be grounded in valid knowledge of true nature.'
      },
      {
        id: 'c3-faculty-primacy',
        title: 'Uphold Faculty Prerogative & Decommission Biometric Facial Tracking',
        description: 'Allow Dr. Sen to override the synthetic score with a top-tier participation mark and petition the Academic Senate to audit sensor validity.',
        benefits: [
          'Reaffirms the pedagogical primacy of human educators and mentorship',
          'Protects reflective, contemplative learning styles from algorithmic punishment',
          'Catalyzes institutional review of invasive surveillance tech'
        ],
        risks: [
          'Exposes university procurement to sunk-cost debates over biometric camera contracts'
        ],
        stakeholders: ['Educator community', 'Student union', 'University Ethics Board'],
        applicablePrinciples: ['Dharma (Academic stewardship)', 'Holistic Well-being', 'Pramana (Valid knowledge over flawed proxy)'],
        isRecommended: true,
        expertRationale: 'In IKS, true learning (Jnana) involves internal contemplation (Manana and Nididhyasana). Treating outward theatrical participation as the only proof of intellect is fundamentally misguided.'
      },
      {
        id: 'c3-re-test',
        title: 'Require Ananya to Undergo an Oral Defense to Prove Sensor Error',
        description: 'Exempt the student from the low score only if she sits before a panel to verbally defend her understanding.',
        benefits: [
          'Creates a formal evidentiary trail verifying competence'
        ],
        risks: [
          'Places an unfair burden of proof on a quiet student while peers with standard smiles are spared',
          'Inflicts unnecessary anxiety and feelings of guilt for simply taking handwritten notes'
        ],
        stakeholders: ['Student', 'Examination Committee'],
        applicablePrinciples: ['Shifts burden of institutional error onto vulnerable learner'],
        isRecommended: false,
        expertRationale: 'When an institutional tool is visibly flawed, forcing an innocent student into an adversarial examination breaches Ahimsa by inflicting avoidable emotional stress.'
      }
    ]
  },
  {
    id: 'case-4-right-to-rectification',
    caseNumber: '04',
    title: 'The Ghost Deficit (RFID Malfunction)',
    context: 'A student, Dev, notices his portal shows zero attendance for the entire month of August in Fluid Mechanics, lowering his composite grade by two letter bands.',
    aiClassification: 'Irrevocable Attendance Shortfall — System Locked for Final Grade Processing',
    hiddenContext: 'Dev’s student RFID badge was demagnetized during a physics lab in late July. He attended every single 9:00 AM session and signed the paper sign-in sheet on the lecturer’s desk, but the automated database did not sync paper entries before locking.',
    choices: [
      {
        id: 'c4-strict-lock',
        title: 'Refuse Correction Citing System Freeze Deadlines',
        description: 'Explain that the university examination software locks database rows 10 days before finals to ensure audit integrity and cannot be modified.',
        benefits: [
          'Zero IT database modifications during high-risk final calculation windows'
        ],
        risks: [
          'Blatant institutional injustice where known factual truth is subordinate to software settings',
          'Dev loses eligibility for graduate school entrance exams',
          'Severe loss of institutional credibility and potential legal appeal'
        ],
        stakeholders: ['Student (Dev)', 'Registrar Office', 'IT Database Administrator'],
        applicablePrinciples: ['Complete violation of Satya (Truth) and Nyaya (Justice)', 'Institutional abdication of Dharma'],
        isRecommended: false,
        expertRationale: 'Satya (truth) and Nyaya (justice) are the bedrock of any ethical institution. To maintain a known falsehood in a database because "the computer locked the row" is a moral catastrophe.'
      },
      {
        id: 'c4-expedited-rectification',
        title: 'Expedite Human-Approved Data Correction with Paper Sign-In Cross-Check',
        description: 'Enable an administrative override protocol where the lecturer verifies the physical ledger, amends Dev’s attendance, and logs an audit memo.',
        benefits: [
          'Restores objective factual truth to institutional records',
          'Vindicates the student’s diligence and rights under ethical AI governance',
          'Reinforces student trust in administrative fairness'
        ],
        risks: [
          'Requires registrar administrator to issue a cryptographic database modification audit log'
        ],
        stakeholders: ['Student', 'Course Instructor', 'Registrar', 'Data Protection Officer'],
        applicablePrinciples: ['Satya (Upholding empirical truth)', 'Nyaya (Due process & rectification)', 'Dharma (Moral duty of registrar)'],
        isRecommended: true,
        expertRationale: 'This fulfills the fundamental ethical safeguard of human oversight and the Right to Rectification. Upholding Satya (factual truth) takes precedence over bureaucratic convenience.'
      },
      {
        id: 'c4-compromise',
        title: 'Offer Dev a Supplementary Exam to Compensate for Lost Attendance Marks',
        description: 'Offer Dev a chance to take an extra 3-hour exam on Saturday to earn back the attendance points.',
        benefits: [
          'Provides a pathway for Dev to recover marks without changing the database'
        ],
        risks: [
          'Penalizes the student with extra unpaid study hours for an institutional hardware failure',
          'Fails to acknowledge or correct the underlying technological error'
        ],
        stakeholders: ['Student', 'Exam Invigilators'],
        applicablePrinciples: ['Punishes the victim of system malfunction', 'Fails moral accountability'],
        isRecommended: false,
        expertRationale: 'Dev did nothing wrong. Forcing a student who already attended 100% of classes to write an extra exam treats the student as the guilty party, violating Ahimsa and basic fairness.'
      }
    ]
  }
];
