import { SimulatorCase } from '../types';

export const SIMULATOR_CASES: SimulatorCase[] = [
  {
    id: 'case-1-misclassified-scholar',
    caseNumber: '01',
    title: 'The Village Commuter',
    context: 'The university AI predicts that Priya (a 3rd-year engineering student from a rural village) has an 82% likelihood of failing Operating Systems based on a 52% recorded physical attendance in 8:00 AM lectures.',
    aiClassification: 'High Failure Risk — Trigger Automatic Academic Probation Alert',
    hiddenContext: 'Priya lives in a village 60 km from campus in rural Rajasthan. The first state bus reaches the city only at 8:40 AM, and she helps on the family farm before leaving. She downloads lecture recordings at a cyber café each afternoon, studies offline at night, and scores 88% on unannounced lab practicals.',
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
          'Severe demoralization of a dedicated rural scholar',
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
        description: 'Have the course instructor review Priya’s lab work, meet her at a time that fits the bus schedule, and formally accept recorded-lecture viewing as attendance.',
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
        expertRationale: 'While superficially appearing to offer a compromise, this ultimatum ignores the reality of rural bus timings, farm duties and physical well-being (Annamaya and Pranamaya koshas).'
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
    id: 'case-3-kisan-season',
    caseNumber: '03',
    title: 'The Harvest-Season Gap',
    context: 'Every October the AI flags Suresh, a second-year agriculture student, as "Sudden Disengagement — Likely Dropout". His attendance falls from 85% to 48% for three weeks and he submits no online quizzes.',
    aiClassification: 'Likely Dropout — Recommend Removal from Merit Scholarship List',
    hiddenContext: 'Suresh comes from a small farming family in Vidarbha. During the kharif harvest he works in the fields, where there is almost no mobile signal. He comes back every November and has finished in the top 20% of his class every semester. The model was trained on urban data and has never seen this seasonal pattern.',
    choices: [
      {
        id: 'c3-auto',
        title: 'Remove Him from the Scholarship List as Recommended',
        description: 'Trust the dropout prediction and free up the scholarship for another student.',
        benefits: ['Follows the model output with no faculty effort'],
        risks: [
          'Withdraws money from a family that depends on it, which makes dropping out more likely',
          'Treats a seasonal pattern the model never learned as a sign of failure',
          'Penalises agricultural livelihoods'
        ],
        stakeholders: ['Student (Suresh)', 'Scholarship Committee', 'Family'],
        applicablePrinciples: ['Breaches Ahimsa (causes economic harm)', 'Breaches Nyaya (training data does not represent rural students)'],
        isRecommended: false,
        expertRationale: 'The model has never seen a rural agricultural calendar, so its "dropout" signal is a data gap, not knowledge. Acting on it causes real harm to a high-performing student.'
      },
      {
        id: 'c3-calendar',
        title: 'Mentor Review and a Harvest-Aware Academic Calendar',
        description: 'A mentor confirms the pattern from past semesters. The institution offers offline coursework packs for harvest weeks and retrains the model with seasonal context, so it stops flagging this pattern.',
        benefits: [
          'Keeps the scholarship and the student',
          'Fixes the model for every student from a farming family, not only Suresh',
          'Respects the student\'s livelihood and family duty'
        ],
        risks: ['Needs a one-time model review and some extra work for faculty'],
        stakeholders: ['Student', 'Faculty Mentor', 'Analytics Team', 'Rural Student Cell'],
        applicablePrinciples: ['Nyaya (representative evidence)', 'Samata (equity)', 'Dharma (human stewardship)', 'Lokasamgraha (welfare of all)'],
        isRecommended: true,
        expertRationale: 'This response helps the individual student and also corrects the system. Dharma acts on Suresh\'s case, while Nyaya and Samata fix the data so future rural students are not misjudged.'
      },
      {
        id: 'c3-warning',
        title: 'Keep the Scholarship but Send a Formal Warning Letter',
        description: 'Leave the scholarship in place but issue an official warning about low engagement.',
        benefits: ['The scholarship is kept'],
        risks: [
          'Still treats the student as a problem',
          'Leaves the biased model unchanged for next year'
        ],
        stakeholders: ['Student', 'Academic Office'],
        applicablePrinciples: ['Partial Ahimsa', 'Neglects Nyaya (root cause not addressed)'],
        isRecommended: false,
        expertRationale: 'A compromise that still blames the student and leaves the faulty model in place. Next year Suresh, and every student like him, will be flagged again.'
      }
    ]
  },
  {
    id: 'case-4-shared-phone',
    caseNumber: '04',
    title: 'The Shared-Phone Exam',
    context: 'In an online proctored test, the AI proctor marks Pooja\'s attempt as "Suspicious — Possible Malpractice". It recorded a dropped video feed, 11 reconnections, and a second face appearing on camera.',
    aiClassification: 'Malpractice Suspected — Auto-Cancel Attempt and Refer to Disciplinary Committee',
    hiddenContext: 'Pooja took the test on her family\'s only phone from a one-room house in a Jharkhand village, using patchy 3G. The reconnections came from the network dropping. The second face was her younger brother walking past. Her answers match the quality of her classroom work.',
    choices: [
      {
        id: 'c4-cancel',
        title: 'Cancel the Attempt and Refer Her to the Disciplinary Committee',
        description: 'Accept the AI proctor flag as evidence of cheating.',
        benefits: ['Strict, uniform enforcement of exam integrity rules'],
        risks: [
          'Turns poverty and a weak network into an accusation of cheating',
          'Causes serious harm to her reputation and mental health',
          'Discourages rural students from taking online exams at all'
        ],
        stakeholders: ['Student (Pooja)', 'Exam Cell', 'Disciplinary Committee'],
        applicablePrinciples: ['Breaches Nyaya (a proxy treated as proof)', 'Breaches Ahimsa (stigmatising accusation)'],
        isRecommended: false,
        expertRationale: 'Network drops and a crowded home are not evidence of malpractice. Under Nyaya, an accusation needs valid proof, and a dropped video feed is not proof.'
      },
      {
        id: 'c4-review',
        title: 'Human Review, Then a Re-Test with an Offline or Centre Option',
        description: 'An examiner reviews the recording and the answers. Pooja is offered a free re-attempt at a nearby college or Common Service Centre, or a short viva, with no mark against her record.',
        benefits: [
          'Protects exam integrity and the student\'s dignity together',
          'Bases the decision on real evidence',
          'Gives low-connectivity students a fair alternative'
        ],
        risks: ['Takes examiner time and some coordination with a nearby centre'],
        stakeholders: ['Student', 'Examiner', 'Exam Cell', 'Local Testing Centre'],
        applicablePrinciples: ['Dharma (human accountability)', 'Nyaya (valid evidence)', 'Samata (equitable access)', 'Ahimsa'],
        isRecommended: true,
        expertRationale: 'A human makes the decision based on real evidence, and the institution removes the structural barrier. Integrity is kept without punishing her circumstances.'
      },
      {
        id: 'c4-rules',
        title: 'Require Every Student to Have a Private Room and Broadband',
        description: 'Change the exam rules so that only students with a private room and broadband can take online exams.',
        benefits: ['Fewer false flags in future'],
        risks: [
          'Formally excludes rural and low-income students',
          'Makes the digital divide an official eligibility rule'
        ],
        stakeholders: ['All rural students', 'Exam Cell'],
        applicablePrinciples: ['Breaches Samata (exclusion presented as a standard)'],
        isRecommended: false,
        expertRationale: 'This "fixes" the AI by excluding the students it was biased against. Equity means removing barriers, not raising them.'
      }
    ]
  },
  {
    id: 'case-5-regional-medium',
    caseNumber: '05',
    title: 'The Mother-Tongue Scholar',
    context: 'The AI gives Lakshmi, a first-year student, a "Low Engagement" score. She posts only once a semester on the English discussion forum, her written answers get low automated "language quality" scores, and she logs in only on weekends.',
    aiClassification: 'Low Engagement & Communication Deficit — Recommend Remedial English Track',
    hiddenContext: 'Lakshmi is the first in her family to attend college and studied in Odia-medium schools until Class 12. She understands the concepts deeply: her lab practical marks are in the top 15%, and she explains topics fluently to classmates in Odia. Her family shares one phone, which she can use only on weekends.',
    choices: [
      {
        id: 'c5-remedial',
        title: 'Auto-Enrol Her in the Remedial English Track',
        description: 'Follow the AI recommendation and move her out of the regular elective into a non-credit language course.',
        benefits: ['Fast, rule-based processing with no faculty effort'],
        risks: [
          'Treats a language difference as a lack of ability',
          'Delays her degree progress and harms her self-belief',
          'Ignores strong evidence of concept mastery in labs'
        ],
        stakeholders: ['Student (Lakshmi)', 'Academic Office', 'Language Centre'],
        applicablePrinciples: ['Breaches Nyaya (wrong pramana)', 'Breaches Ahimsa (stigmatising label)'],
        isRecommended: false,
        expertRationale: 'Fluency in English is not the same as subject knowledge. Using it as a proxy for learning breaks the Nyaya standard of valid evidence and puts a harmful deficit label on a capable student.'
      },
      {
        id: 'c5-bilingual',
        title: 'Mentor Review, Bilingual Assessment and Device Support',
        description: 'A mentor reviews her lab record, allows answers in Odia or English on concept tests, pairs her with a bilingual peer mentor, and arranges a laptop loan.',
        benefits: [
          'Measures what she actually knows',
          'Respects the NEP 2020 emphasis on mother-tongue learning',
          'Removes the device barrier behind the "weekend-only" pattern'
        ],
        risks: ['Needs bilingual evaluators and some extra faculty time'],
        stakeholders: ['Student', 'Faculty Mentor', 'Peer Mentor Network', 'Library Device Scheme'],
        applicablePrinciples: ['Nyaya (valid evidence)', 'Samata (equity)', 'Dharma (human accountability)', 'Ahimsa (dignity)'],
        isRecommended: true,
        expertRationale: 'This response replaces an unreliable proxy with direct evidence, removes structural barriers, and keeps a human accountable for the decision. All four principles are satisfied.'
      },
      {
        id: 'c5-ignore',
        title: 'Disable Language Scoring for Everyone, With No Review',
        description: 'Switch off automated language scoring across the university and take no other action.',
        benefits: ['Removes one biased signal immediately'],
        risks: [
          'Leaves the device and access barrier untouched',
          'Gives Lakshmi no support or mentoring',
          'Fixes the symptom without auditing other proxies'
        ],
        stakeholders: ['All students', 'Analytics Team'],
        applicablePrinciples: ['Partial Nyaya', 'Neglects Dharma (no human stewardship)'],
        isRecommended: false,
        expertRationale: 'Removing a biased feature is a good start, but fairness needs a full proxy audit and active, caring support. A purely technical fix leaves the student on her own.'
      }
    ]
  }
];
