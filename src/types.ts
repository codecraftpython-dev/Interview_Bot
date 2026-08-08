export type NavTab = 'dashboard' | 'interviews' | 'candidates' | 'feedback' | 'settings';

export interface InterviewSettings {
  persona: 'Senior AI Systems Architect' | 'Principal Staff Engineer' | 'Cohort Mentor & Guide';
  interviewMode: 'adaptive' | 'balanced' | 'deep_technical';
  difficultyBehavior: 'adaptive' | 'fixed_intermediate' | 'fixed_advanced' | 'fixed_expert';
  questionCount: number; // 8, 10, or 12
  followUpIntensity: 'low' | 'balanced' | 'high';
  coverageStrategy: 'balanced' | 'weak_areas_first' | 'broadest_coverage';
  autoProbeSkipped: boolean;
}

export const DEFAULT_INTERVIEW_SETTINGS: InterviewSettings = {
  persona: 'Senior AI Systems Architect',
  interviewMode: 'adaptive',
  difficultyBehavior: 'adaptive',
  questionCount: 8,
  followUpIntensity: 'balanced',
  coverageStrategy: 'balanced',
  autoProbeSkipped: true,
};

export interface CandidateMember {
  id: string;
  name: string;
  jobRole: string;
  yearsExperience: number;
  education: string;
  status: string;
}

export interface CandidateMission {
  day: number;
  title: string;
  passed?: boolean;
  attempts?: number;
  skipped?: boolean;
}

export interface CandidateSignals {
  commitDays: number;
  missionsCompleted: number;
  missionsFirstTry: number;
}

export interface CandidateRecord {
  member: CandidateMember;
  missions: CandidateMission[];
  signals: CandidateSignals;
}

export interface CurriculumModuleSpec {
  n: number;
  title: string;
  days: [number, number];
}

export interface CurriculumDaySpec {
  day: number;
  title: string;
  type: string;
  tools: string[];
  objectives: string[];
}

export interface CurriculumDataSpec {
  cohort: string;
  modules: CurriculumModuleSpec[];
  days: CurriculumDaySpec[];
}

export interface Candidate {
  id: string;
  name: string;
  role: string;
  experience: string;
  avatarUrl?: string;
  cohortName: string;
  completedMissions: number;
  totalMissions: number;
  readinessScore: number; // 0-100
  strongAreas: string[];
  areasToProbe: string[];
  skippedTopics: string[];
  lastActive: string;
  status: 'Ready for Interview' | 'Interview in Progress' | 'Interview Completed' | 'Needs Review';
  rawRecord?: CandidateRecord;
}

export interface CurriculumTopic {
  id: string;
  title: string;
  category: 'RAG Systems' | 'Agent Architecture' | 'Evaluation & Monitoring' | 'Deployment & Infra' | 'Prompt Engineering';
  status: 'completed' | 'in_progress' | 'probe_needed' | 'skipped';
  masteryScore?: number; // percentage
}

export interface InterviewSpec {
  id: string;
  title: string;
  durationMinutes: string;
  questionCount: number;
  coveredAreasCount: number;
  difficulty: 'Adaptive' | 'Standard' | 'Hardcore';
  targetRole: string;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'candidate';
  text: string;
  timestamp: string;
  topicTag?: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
  followUpSuggestions?: string[];
  isStreaming?: boolean;
}

export interface AnswerEvaluation {
  score: number; // 0.0 to 1.0
  technicalAccuracy: number;
  depth: number;
  reasoning: number;
  completeness: number;
  conceptsDemonstrated: string[];
  conceptsMissing: string[];
  misconceptions: string[];
  answerQuality: 'weak' | 'developing' | 'strong' | 'excellent' | 'non_responsive';
  recommendedAction: 'clarify' | 'probe' | 'increase_difficulty' | 'change_topic' | 'reinforce';
}

export interface InterviewQuestionRecord {
  questionNumber: number;
  questionText: string;
  curriculumDay: number;
  topicTag: string;
  category: string;
  difficulty: 'Foundation' | 'Intermediate' | 'Advanced' | 'Expert';
  codeSnippet?: {
    language: string;
    code: string;
  };
  followUpSuggestions?: string[];
}

export interface InterviewAnswerRecord {
  questionNumber: number;
  answerText: string;
  timestamp: string;
  evaluation?: AnswerEvaluation;
}

export interface InterviewState {
  sessionId: string;
  candidateId: string;
  status: 'active' | 'completed' | 'paused';
  currentQuestionNumber: number; // Single source of truth for the active question number (1-indexed)
  totalQuestions: number;
  currentQuestion: string;
  currentCurriculumDay: number;
  currentFocusTopic: string;
  currentCategory: string;
  difficulty: 'Foundation' | 'Intermediate' | 'Advanced' | 'Expert' | 'Adaptive';
  elapsedSeconds: number;
  isActive: boolean;
  isPaused: boolean;
  messages: ChatMessage[];
  questionsAsked: InterviewQuestionRecord[];
  answers: InterviewAnswerRecord[];
  coveredDays: number[]; // Set of unique curriculum days asked
  coveredTopics: { title: string; completed: boolean; active?: boolean }[];
  learningSignals: string[];
  candidateStrategy: {
    targetDays: number[];
    strongDays: number[];
    probeDays: number[];
    skippedDays: number[];
  };
  startedAt: string;
  updatedAt: string;
  // Optional alias for backward compatibility:
  currentQuestionIndex?: number;
}

export interface FeedbackSummary {
  candidateId: string;
  candidateName: string;
  candidateRole?: string;
  sessionId?: string;
  completedAt?: string;
  questionLimit?: number;
  totalQuestionsAnswered?: number;
  overallScore: number;
  overallAssessment?: 'Strong' | 'Satisfactory' | 'Developing' | 'Needs Review';
  assessmentConfidence?: 'High' | 'Medium' | 'Low';
  confidenceReason?: string;
  executiveSummary?: string;
  technicalAccuracy: number;
  systemDesignDepth: number;
  communicationClarity: number;
  profileVsEvidence?: {
    profileContext: string;
    interviewEvidence: string;
  };
  strengths: string[];
  growthAreas: string[];
  technicalAreasAssessed?: {
    topic: string;
    score: number;
    level: string;
    evidence: string;
  }[];
  curriculumAssessments?: {
    day: number;
    topic: string;
    assessment: 'Strong' | 'Developing' | 'Needs Review';
    evidence: string;
  }[];
  areasOfUncertainty?: {
    question: string;
    responseSummary: string;
    missingConcept: string;
    strongerAnswerApproach: string;
  }[];
  strongestResponses?: {
    question: string;
    candidateAnswer: string;
    whyStrong: string;
  }[];
  communicationAssessment?: {
    score: number;
    analysis: string;
    vocabulary: string;
    clarity: string;
  };
  engineeringThinking?: {
    score: number;
    analysis: string;
    tradeOffReasoning: string;
  };
  nextSteps?: string[];
  transcriptHighlights: {
    question: string;
    candidateAnswer: string;
    evalNote: string;
  }[];
  curriculumDaysCovered?: number;
  recommendedStudyPlan?: {
    day: number;
    topic: string;
    action: string;
  }[];
}

export interface CompletedSessionRecord {
  sessionId: string;
  candidateId: string;
  candidateName: string;
  candidateRole: string;
  completedAt: string;
  sessionState: InterviewState;
  feedback: FeedbackSummary;
  settings: InterviewSettings;
}
