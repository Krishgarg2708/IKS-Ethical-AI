export type PageTab = 
  | 'home' 
  | 'scenario' 
  | 'principles' 
  | 'risks' 
  | 'safeguards' 
  | 'simulator' 
  | 'assessment' 
  | 'about';

export interface StudentIndicators {
  attendance: number; // percentage 0-100
  examScore: number; // percentage 0-100
  assignmentCompletion: number; // percentage 0-100
  participationScore: number; // percentage 0-100
  connectivityConstrained: boolean;
  familyCaregivingDuty: boolean;
  workingPartTime: boolean;
}

export interface IKSPrinciple {
  id: string;
  sanskritName: string;
  englishTitle: string;
  tagline: string;
  shortDefinition: string;
  philosophicalRoot: string;
  modernAIAggregation: string;
  practicalExample: string;
  interactiveScenarioPrompt: string;
  interactiveEffect: string;
}

export interface EthicalRisk {
  id: string;
  title: string;
  shortDescription: string;
  rootCause: string[];
  exampleSituation: string;
  whoIsAffected: string[];
  possibleConsequences: string[];
  relevantPrinciples: string[];
  severityAssessments: {
    level: 'Low' | 'Moderate' | 'Severe' | 'Critical';
    educationalNote: string;
  }[];
}

export interface SafeguardControl {
  id: string;
  title: string;
  description: string;
  mitigatesRisk: string; // 'Risk 1', 'Risk 2', or 'Both'
  relatedPrinciple: string;
  status: 'implemented' | 'pending' | 'unimplemented';
}

export interface EthicalSafeguard {
  id: string;
  title: string;
  subtitle: string;
  mitigatesRiskIds: string[];
  keyFeatures: string[];
  iksConnection: string;
  controls: SafeguardControl[];
}

export interface SimulatorChoice {
  id: string;
  title: string;
  description: string;
  benefits: string[];
  risks: string[];
  stakeholders: string[];
  applicablePrinciples: string[];
  isRecommended: boolean;
  expertRationale: string;
}

export interface SimulatorCase {
  id: string;
  caseNumber: string;
  title: string;
  context: string;
  aiClassification: string;
  hiddenContext: string;
  choices: SimulatorChoice[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  iksConcept: string;
}
