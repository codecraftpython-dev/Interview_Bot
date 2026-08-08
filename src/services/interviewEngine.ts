import {
  Candidate,
  InterviewState,
  ChatMessage,
  InterviewQuestionRecord,
  AnswerEvaluation,
  InterviewSettings,
  DEFAULT_INTERVIEW_SETTINGS,
  CurriculumDaySpec,
} from '../types';
import curriculumData from '../data/curriculum.json';

const ALL_CURRICULUM = (curriculumData as any).days as CurriculumDaySpec[];

function getTopicForSpec(spec: CurriculumDaySpec): string {
  return spec.title || `Day ${spec.day} Curriculum Topic`;
}

function getCategoryForSpec(spec: CurriculumDaySpec): string {
  return spec.type || 'AI Systems Engineering';
}

function getQuestionsForSpec(spec: CurriculumDaySpec, difficulty: string): string {
  const tools = spec.tools?.length ? spec.tools.join(', ') : 'standard tooling';
  const primaryObj = spec.objectives?.[0] || 'core technical requirements';
  const topic = getTopicForSpec(spec);

  if (difficulty === 'Expert') {
    return `For Day ${spec.day} (${topic}), how do you architect production resilience, high throughput, and zero-downtime scaling when integrating ${tools}? Specifically, address how you satisfy "${primaryObj}" under adverse production failure modes.`;
  }
  if (difficulty === 'Advanced') {
    return `Looking at Day ${spec.day} (${topic}), what are the key architectural trade-offs, performance bottlenecks, and edge-case failure modes when working with ${tools}? How would you implement "${primaryObj}"?`;
  }
  if (difficulty === 'Intermediate') {
    return `Regarding Day ${spec.day} (${topic}), walk through your practical implementation approach using ${tools}. How do you ensure "${primaryObj}" is properly designed and verified?`;
  }
  return `On Day ${spec.day} (${topic}), explain the core principles and setup steps when using ${tools} to accomplish "${primaryObj}".`;
}

// Helper to derive candidate interview strategy from candidate profile
export function deriveCandidateStrategy(candidate: Candidate, settings?: InterviewSettings) {
  const strongDays: number[] = [];
  const probeDays: number[] = [];
  const skippedDays: number[] = [];

  const strongAreas = candidate.strongAreas || [];
  const areasToProbe = candidate.areasToProbe || [];
  const skippedTopics = candidate.skippedTopics || [];

  ALL_CURRICULUM.forEach((spec) => {
    const titleLower = spec.title ? spec.title.toLowerCase() : '';
    const typeLower = spec.type ? spec.type.toLowerCase() : '';

    const isStrong = strongAreas.some(
      (sa) => sa && (
        (titleLower && (titleLower.includes(sa.toLowerCase()) || sa.toLowerCase().includes(titleLower))) ||
        (typeLower && sa.toLowerCase().includes(typeLower))
      )
    );
    const isProbe = areasToProbe.some(
      (ap) => ap && (
        (titleLower && (titleLower.includes(ap.toLowerCase()) || ap.toLowerCase().includes(titleLower))) ||
        (typeLower && ap.toLowerCase().includes(typeLower))
      )
    );
    const isSkipped = skippedTopics.some(
      (st) => st && (
        (titleLower && (titleLower.includes(st.toLowerCase()) || st.toLowerCase().includes(titleLower))) ||
        (typeLower && st.toLowerCase().includes(typeLower))
      )
    );

    if (isSkipped) {
      skippedDays.push(spec.day);
    } else if (isProbe) {
      probeDays.push(spec.day);
    } else if (isStrong) {
      strongDays.push(spec.day);
    }
  });

  const covered = new Set([...strongDays, ...probeDays, ...skippedDays]);
  const remaining = ALL_CURRICULUM.map((c) => c.day).filter((d) => !covered.has(d));

  let targetDays: number[] = [];
  if (settings?.coverageStrategy === 'weak_areas_first') {
    targetDays = [...skippedDays, ...probeDays, ...strongDays, ...remaining];
  } else if (settings?.coverageStrategy === 'broadest_coverage') {
    // Interleave across categories
    targetDays = ALL_CURRICULUM.map((c) => c.day);
  } else {
    // Balanced sequence: start with strong baseline day, then probe days, skipped days, then remaining
    targetDays = [
      ...(strongDays.length > 0 ? [strongDays[0]] : []),
      ...probeDays,
      ...skippedDays,
      ...strongDays.slice(1),
      ...remaining,
    ];
  }

  // Fallback if targetDays is empty
  const finalTargetDays = targetDays.length >= 4 ? targetDays : ALL_CURRICULUM.map((c) => c.day);

  return {
    targetDays: finalTargetDays,
    strongDays,
    probeDays,
    skippedDays,
  };
}

export function createNewInterviewSession(
  candidate: Candidate,
  settingsOrQuestions: number | InterviewSettings = DEFAULT_INTERVIEW_SETTINGS
): InterviewState {
  const settings: InterviewSettings =
    typeof settingsOrQuestions === 'number'
      ? { ...DEFAULT_INTERVIEW_SETTINGS, questionCount: settingsOrQuestions }
      : settingsOrQuestions;

  const totalQuestions = Math.max(8, settings.questionCount || 10);
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const isoNow = new Date().toISOString();

  const strategy = deriveCandidateStrategy(candidate, settings);
  const q1Day = strategy.targetDays[0] || ALL_CURRICULUM[0].day;
  const q1Spec = ALL_CURRICULUM.find((c) => c.day === q1Day) || ALL_CURRICULUM[0];

  // Initial difficulty based on difficultyBehavior or readiness score
  let initialDifficulty: 'Foundation' | 'Intermediate' | 'Advanced' | 'Expert' = 'Intermediate';
  if (settings.difficultyBehavior === 'fixed_intermediate') {
    initialDifficulty = 'Intermediate';
  } else if (settings.difficultyBehavior === 'fixed_advanced') {
    initialDifficulty = 'Advanced';
  } else if (settings.difficultyBehavior === 'fixed_expert') {
    initialDifficulty = 'Expert';
  } else {
    initialDifficulty = candidate.readinessScore > 85 ? 'Intermediate' : 'Foundation';
  }

  const q1Text = getQuestionsForSpec(q1Spec, initialDifficulty);
  const q1Topic = getTopicForSpec(q1Spec);
  const q1Category = getCategoryForSpec(q1Spec);
  const completedCount = candidate.completedMissions ?? 0;
  const totalMissionsCount = candidate.totalMissions || 31;

  const welcomeMessage: ChatMessage = {
    id: `m-init-${Date.now()}`,
    sender: 'ai',
    text: `Hello ${candidate.name}. Welcome to your technical interview session (${settings.persona}).\n\nI have reviewed your curriculum progression across your completed missions (${completedCount} of ${totalMissionsCount} missions completed). Today we will conduct a ${settings.interviewMode.replace('_', ' ')} assessment across AI systems architecture, vector retrieval, and agentic workflows.\n\n**Question 1 of ${totalQuestions}** (Day ${q1Spec.day} · ${q1Topic}):\n\n${q1Text}`,
    timestamp: now,
    topicTag: q1Topic,
    followUpSuggestions: [
      `Discuss ${q1Spec.tools[0] || 'trade-offs'} implementation`,
      'Explain latency & throughput trade-offs',
      'Elaborate on production failure modes',
    ],
  };

  const initialQuestionRecord: InterviewQuestionRecord = {
    questionNumber: 1,
    questionText: q1Text,
    curriculumDay: q1Spec.day,
    topicTag: q1Topic,
    category: q1Category,
    difficulty: initialDifficulty,
    followUpSuggestions: welcomeMessage.followUpSuggestions,
  };

  return {
    sessionId,
    candidateId: candidate.id,
    status: 'active',
    currentQuestionNumber: 1,
    currentQuestionIndex: 1,
    totalQuestions,
    currentQuestion: q1Text,
    currentCurriculumDay: q1Spec.day,
    currentFocusTopic: q1Topic,
    currentCategory: q1Category,
    difficulty: settings.difficultyBehavior === 'adaptive' ? 'Adaptive' : initialDifficulty,
    elapsedSeconds: 0,
    isActive: true,
    isPaused: false,
    messages: [welcomeMessage],
    questionsAsked: [initialQuestionRecord],
    answers: [],
    coveredDays: [q1Spec.day],
    coveredTopics: ALL_CURRICULUM.map((spec) => ({
      title: `Day ${spec.day}: ${getTopicForSpec(spec)}`,
      completed: false,
      active: spec.day === q1Spec.day,
    })),
    learningSignals: [
      `Session initialized for ${candidate.name} (${candidate.role})`,
      `Persona: ${settings.persona} | Mode: ${settings.interviewMode}`,
      `Targeting 4+ curriculum days based on learning history`,
    ],
    candidateStrategy: strategy,
    startedAt: isoNow,
    updatedAt: isoNow,
  };
}

export async function processCandidateAnswer(
  currentState: InterviewState,
  candidate: Candidate,
  answerText: string,
  settings: InterviewSettings = DEFAULT_INTERVIEW_SETTINGS
): Promise<InterviewState> {
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const timestamp = now;

  // 1. Candidate message
  const candidateMsg: ChatMessage = {
    id: `cand-${Date.now()}`,
    sender: 'candidate',
    text: answerText,
    timestamp,
  };

  const updatedMessages = [...currentState.messages, candidateMsg];
  const qNum = currentState.currentQuestionNumber;

  // Attempt server API evaluation & question generation
  let apiResult: any = null;
  try {
    const res = await fetch('/api/interview/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        candidate,
        settings,
        currentQuestionNumber: qNum,
        totalQuestions: currentState.totalQuestions,
        currentQuestion: currentState.currentQuestion,
        currentCurriculumDay: currentState.currentCurriculumDay,
        currentTopic: currentState.currentFocusTopic,
        currentCategory: currentState.currentCategory,
        currentDifficulty: currentState.difficulty,
        candidateAnswer: answerText,
        coveredDays: currentState.coveredDays,
        questionsAskedCount: currentState.questionsAsked.length,
        conversationHistory: updatedMessages,
        availableCurriculum: ALL_CURRICULUM,
      }),
    });

    if (res.ok) {
      apiResult = await res.json();
    }
  } catch (err) {
    apiResult = null;
  }

  // Fallback to local state-aware evaluator if API fails or is offline
  if (!apiResult) {
    apiResult = evaluateAnswerLocally(currentState, candidate, answerText, settings);
  }

  const {
    isRelevantAnswer,
    evaluation,
    feedback,
    nextQuestionNumber,
    nextCurriculumDay = currentState.currentCurriculumDay,
    nextQuestionText,
    nextTopic = currentState.currentFocusTopic,
    nextCategory = currentState.currentCategory,
    nextDifficulty = 'Intermediate',
    learningSignal,
    followUpSuggestions = [],
  } = apiResult;

  // Record candidate answer with evaluation
  const newAnswerRecord = {
    questionNumber: qNum,
    answerText,
    timestamp,
    evaluation,
  };
  const updatedAnswers = [...currentState.answers, newAnswerRecord];

  // Update unique covered days
  const updatedCoveredDays = Array.from(
    new Set([...currentState.coveredDays, ...(isRelevantAnswer ? [nextCurriculumDay] : [])])
  );

  // Completion Check Rules (Enforces minimum 8 questions AND minimum 4 curriculum days)
  const isLastQuestion =
    (nextQuestionNumber > currentState.totalQuestions || currentState.questionsAsked.length >= currentState.totalQuestions) &&
    currentState.questionsAsked.length >= 8 &&
    updatedCoveredDays.length >= 4;

  let fullAiText = '';
  if (!isRelevantAnswer) {
    fullAiText = feedback;
  } else if (isLastQuestion) {
    fullAiText = `${feedback}\n\n**Interview Complete!** You have completed ${currentState.questionsAsked.length} technical questions covering ${updatedCoveredDays.length} curriculum days. Thank you for walking through your system architecture reasoning. Click "Exit" to review your detailed evaluation card.`;
  } else {
    fullAiText = `${feedback}\n\n**Question ${nextQuestionNumber} of ${currentState.totalQuestions}** (Day ${nextCurriculumDay} · ${nextTopic}):\n\n${nextQuestionText}`;
  }

  const aiMsg: ChatMessage = {
    id: `ai-${Date.now()}`,
    sender: 'ai',
    text: fullAiText,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    topicTag: nextTopic,
    followUpSuggestions,
  };

  const finalMessages = [...updatedMessages, aiMsg];

  // Record question asked if valid transition
  const newQuestionsAsked = [...currentState.questionsAsked];
  if (isRelevantAnswer && !isLastQuestion) {
    newQuestionsAsked.push({
      questionNumber: nextQuestionNumber,
      questionText: nextQuestionText,
      curriculumDay: nextCurriculumDay,
      topicTag: nextTopic,
      category: nextCategory,
      difficulty: nextDifficulty,
      followUpSuggestions,
    });
  }

  // Update learning signals
  const updatedSignals = [...currentState.learningSignals];
  if (learningSignal) {
    updatedSignals.push(learningSignal);
  }

  // Update covered topics UI display list
  const updatedCoveredTopics = currentState.coveredTopics.map((ct) => {
    if (ct.title.includes(currentState.currentFocusTopic)) {
      return { ...ct, completed: isRelevantAnswer, active: !isRelevantAnswer };
    }
    if (ct.title.includes(nextTopic)) {
      return { ...ct, active: true };
    }
    return ct;
  });

  return {
    ...currentState,
    currentQuestionNumber: isRelevantAnswer ? nextQuestionNumber : qNum,
    currentQuestionIndex: isRelevantAnswer ? nextQuestionNumber : qNum,
    currentQuestion: isLastQuestion ? 'Interview Completed' : (isRelevantAnswer ? nextQuestionText : currentState.currentQuestion),
    currentCurriculumDay: isRelevantAnswer ? nextCurriculumDay : currentState.currentCurriculumDay,
    currentFocusTopic: isRelevantAnswer ? nextTopic : currentState.currentFocusTopic,
    currentCategory: isRelevantAnswer ? nextCategory : currentState.currentCategory,
    difficulty: isRelevantAnswer ? nextDifficulty : currentState.difficulty,
    status: isLastQuestion ? 'completed' : 'active',
    isActive: !isLastQuestion,
    messages: finalMessages,
    answers: updatedAnswers,
    questionsAsked: newQuestionsAsked,
    coveredDays: updatedCoveredDays,
    coveredTopics: updatedCoveredTopics,
    learningSignals: updatedSignals,
    updatedAt: new Date().toISOString(),
  };
}

// State-aware local answer evaluator & question generator fallback
function evaluateAnswerLocally(
  currentState: InterviewState,
  candidate: Candidate,
  answerText: string,
  settings?: InterviewSettings
) {
  const cleanAnswer = (answerText || '').toString().trim().toLowerCase();
  const words = cleanAnswer.split(/\s+/).filter(Boolean);
  const qNum = currentState.currentQuestionNumber;

  // Check for greetings or non-technical input
  const greetings = ['hi', 'hello', 'hey', 'greetings', 'yo', 'test', 'sup'];
  const isGreeting = greetings.includes(cleanAnswer) || (words.length <= 2 && greetings.some((g) => cleanAnswer.includes(g)));
  const isTooShort = words.length < 3 && !cleanAnswer.includes('top') && !cleanAnswer.includes('vector') && !cleanAnswer.includes('mcp');

  if (isGreeting || isTooShort || cleanAnswer === 'idk' || cleanAnswer === 'i dont know') {
    const isExplicitIdk = cleanAnswer === 'idk' || cleanAnswer === 'i dont know';

    const nonRespEval: AnswerEvaluation = {
      score: 0.05,
      technicalAccuracy: 0.0,
      depth: 0.0,
      reasoning: 0.0,
      completeness: 0.0,
      conceptsDemonstrated: [],
      conceptsMissing: ['Technical context', 'System architecture terms'],
      misconceptions: [],
      answerQuality: 'non_responsive',
      recommendedAction: 'clarify',
    };

    if (isExplicitIdk) {
      return {
        isRelevantAnswer: false,
        evaluation: nonRespEval,
        feedback: `Understood, ${candidate.name}. If you're unfamiliar with Day ${currentState.currentCurriculumDay} (${currentState.currentFocusTopic}), we can break it down. For **Question ${qNum}**, consider the core objective: how does your design prevent duplicate retrieval chunks or limit latency spikes?`,
        nextQuestionNumber: qNum,
        nextCurriculumDay: currentState.currentCurriculumDay,
        nextQuestionText: currentState.currentQuestion,
        nextTopic: currentState.currentFocusTopic,
        nextCategory: currentState.currentCategory,
        nextDifficulty: currentState.difficulty,
        learningSignal: `Question ${qNum}: Candidate requested clarification on Day ${currentState.currentCurriculumDay}`,
        followUpSuggestions: ['Explain key trade-offs', 'Provide basic principles'],
        isInterviewComplete: false,
      };
    }

    return {
      isRelevantAnswer: false,
      evaluation: nonRespEval,
      feedback: `Hello ${candidate.name}. That appears to be a brief greeting or non-technical note.\n\nTo evaluate your system design depth for **Question ${qNum}**, please address the specific technical challenge asked above: *"${currentState.currentQuestion}"*`,
      nextQuestionNumber: qNum,
      nextCurriculumDay: currentState.currentCurriculumDay,
      nextQuestionText: currentState.currentQuestion,
      nextTopic: currentState.currentFocusTopic,
      nextCategory: currentState.currentCategory,
      nextDifficulty: currentState.difficulty,
      learningSignal: `Question ${qNum}: Awaiting technical answer on ${currentState.currentFocusTopic}`,
      followUpSuggestions: ['Answer technical question', 'Request clarification'],
      isInterviewComplete: false,
    };
  }

  // Technical answer evaluation
  let score = 0.5;
  let conceptsDemonstrated: string[] = [];
  let conceptsMissing: string[] = [];
  let feedbackText = '';
  let learningSignal = '';

  if (cleanAnswer.includes('top-k') || cleanAnswer.includes('top k') || cleanAnswer.includes('increase top')) {
    score = 0.75;
    conceptsDemonstrated = ['top-k retrieval', 'recall expansion'];
    conceptsMissing = ['re-ranking stage', 'context window dilution'];
    feedbackText = `You highlighted expanding **top-k** parameters. Increasing top-k improves raw recall and ensures critical candidate chunks aren't cut off prematurely. However, higher top-k values increase vector DB query latency and introduce context noise. Pairing top-k expansion with a downstream cross-encoder or MMR re-ranker optimizes both recall and precision.`;
    learningSignal = `Question ${qNum}: Articulated top-k recall expansion trade-offs`;
  } else if (cleanAnswer.includes('rerank') || cleanAnswer.includes('mmr') || cleanAnswer.includes('cohere') || cleanAnswer.includes('re-rank')) {
    score = 0.90;
    conceptsDemonstrated = ['MMR re-ranking', 'diversity scoring', 'cross-encoders'];
    conceptsMissing = ['latency budgeting'];
    feedbackText = `Strong architectural reasoning on **re-ranking** and diversity scoring. Using Maximal Marginal Relevance (MMR) or Cohere ReRank effectively eliminates duplicate vector clusters while preserving contextual precision before injecting chunks into the prompt context window.`;
    learningSignal = `Question ${qNum}: Applied MMR re-ranking to solve semantic duplication`;
  } else if (cleanAnswer.includes('hnsw') || cleanAnswer.includes('m') || cleanAnswer.includes('ef_construct') || cleanAnswer.includes('index')) {
    score = 0.85;
    conceptsDemonstrated = ['HNSW index parameters', 'indexing throughput vs recall'];
    conceptsMissing = ['quantization trade-offs'];
    feedbackText = `Solid understanding of **HNSW graph index parameters**. Tuning max edges per node (m) and construction search depth (ef_construct) is key to balancing build time vs recall at scale. Decoupling index construction into background workers prevents query API latency spikes.`;
    learningSignal = `Question ${qNum}: Explained HNSW indexing parameter tuning`;
  } else if (cleanAnswer.includes('mcp') || cleanAnswer.includes('schema') || cleanAnswer.includes('zod') || cleanAnswer.includes('tool')) {
    score = 0.88;
    conceptsDemonstrated = ['MCP tool protocols', 'Zod schema validation', 'circuit breakers'];
    conceptsMissing = ['multi-agent context passing'];
    feedbackText = `Accurate observation regarding **Model Context Protocol (MCP)** tool execution and schema guards. Enforcing JSON schema constraints and implementing retry handlers prevents downstream agent pipeline failures when external API integrations behave unpredictably.`;
    learningSignal = `Question ${qNum}: Demonstrated MCP tool integration and schema enforcement`;
  } else if (cleanAnswer.includes('cache') || cleanAnswer.includes('circuit') || cleanAnswer.includes('redis') || cleanAnswer.includes('fallback')) {
    score = 0.82;
    conceptsDemonstrated = ['circuit breakers', 'LRU cache fallbacks', 'SLA protection'];
    conceptsMissing = ['cache invalidation strategies'];
    feedbackText = `Excellent resilience pattern design. Implementing an in-memory **LRU cache** or secondary keyword fallback when primary vector DB query latency exceeds SLAs keeps agentic execution loops responsive under heavy load.`;
    learningSignal = `Question ${qNum}: Designed high-availability resilience fallbacks`;
  } else {
    score = 0.60;
    conceptsDemonstrated = ['general system reasoning'];
    conceptsMissing = ['quantitative SLAs', 'edge-case failure modes'];
    const snippet = answerText.length > 80 ? answerText.substring(0, 80) + '...' : answerText;
    feedbackText = `Thank you for detailing your approach: *"${snippet}"*. You outlined practical trade-offs for ${currentState.currentFocusTopic}. Considering real-world operational constraints, balancing precision, execution latency, and error handling is critical for reliable AI engineering.`;
    learningSignal = `Question ${qNum}: Provided architectural explanation for Day ${currentState.currentCurriculumDay}`;
  }

  const evalObj: AnswerEvaluation = {
    score,
    technicalAccuracy: score,
    depth: score > 0.7 ? 0.8 : 0.5,
    reasoning: score > 0.7 ? 0.85 : 0.6,
    completeness: score > 0.7 ? 0.8 : 0.5,
    conceptsDemonstrated,
    conceptsMissing,
    misconceptions: [],
    answerQuality: score >= 0.85 ? 'excellent' : score >= 0.7 ? 'strong' : 'developing',
    recommendedAction: score >= 0.8 ? 'increase_difficulty' : 'probe',
  };

  // Determine Next Difficulty
  let nextDifficulty: 'Foundation' | 'Intermediate' | 'Advanced' | 'Expert' = 'Intermediate';
  if (score >= 0.88) {
    nextDifficulty = 'Expert';
  } else if (score >= 0.70) {
    nextDifficulty = 'Advanced';
  } else if (score >= 0.40) {
    nextDifficulty = 'Intermediate';
  } else {
    nextDifficulty = 'Foundation';
  }

  // Select Next Curriculum Day & Topic
  const coveredDaysSet = new Set(currentState.coveredDays);
  let nextDay = currentState.currentCurriculumDay;

  // If unique covered days < 4, prioritize an uncovered curriculum day from targetDays
  if (coveredDaysSet.size < 4) {
    const uncovered = currentState.candidateStrategy.targetDays.find((d) => !coveredDaysSet.has(d));
    if (uncovered) {
      nextDay = uncovered;
    } else {
      const anyUncovered = ALL_CURRICULUM.find((c) => !coveredDaysSet.has(c.day));
      if (anyUncovered) nextDay = anyUncovered.day;
    }
  } else {
    // Pick next day sequentially or rotate categories
    const currentIndex = ALL_CURRICULUM.findIndex((c) => c.day === currentState.currentCurriculumDay);
    const nextSpec = ALL_CURRICULUM[(currentIndex + 1) % ALL_CURRICULUM.length];
    nextDay = nextSpec.day;
  }

  const nextSpec = ALL_CURRICULUM.find((c) => c.day === nextDay) || ALL_CURRICULUM[0];
  const nextQText = getQuestionsForSpec(nextSpec, nextDifficulty);

  const nextQNum = qNum + 1;
  const isInterviewComplete =
    (nextQNum > currentState.totalQuestions || currentState.questionsAsked.length >= currentState.totalQuestions) &&
    currentState.questionsAsked.length >= 8 &&
    coveredDaysSet.size >= 4;

  return {
    isRelevantAnswer: true,
    evaluation: evalObj,
    feedback: feedbackText,
    nextQuestionNumber: nextQNum,
    nextCurriculumDay: nextSpec.day,
    nextQuestionText: nextQText,
    nextTopic: getTopicForSpec(nextSpec),
    nextCategory: getCategoryForSpec(nextSpec),
    nextDifficulty,
    learningSignal,
    followUpSuggestions: [
      `Analyze ${nextSpec.tools[0] || 'system'} latency`,
      'Explain production failure modes',
      'Compare alternative architectures',
    ],
    isInterviewComplete,
  };
}
