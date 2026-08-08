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
import { normalizeScore } from '../utils/scoreUtils';

const ALL_CURRICULUM = (curriculumData as any).days as CurriculumDaySpec[];

function getTopicForSpec(spec: CurriculumDaySpec): string {
  return spec.title || `Day ${spec.day} Curriculum Topic`;
}

function getCategoryForSpec(spec: CurriculumDaySpec): string {
  return spec.type || 'AI Systems Engineering';
}

function getQuestionsForCandidateSpec(
  spec: CurriculumDaySpec,
  difficulty: string,
  candidate?: Candidate,
  questionNumber: number = 1,
  questionsAskedSoFar: InterviewQuestionRecord[] = []
): string {
  const role = candidate?.role || 'AI Engineer';
  const name = candidate?.name || 'Engineer';
  const tools = spec.tools?.length ? spec.tools.join(', ') : 'standard tooling';
  const primaryObj = spec.objectives?.[0] || 'core technical requirements';
  const topic = getTopicForSpec(spec);

  let baseQuestions: string[] = [];

  if (difficulty === 'Expert') {
    baseQuestions = [
      `As a ${role}, how do you architect high-throughput, zero-downtime production pipelines for Day ${spec.day} (${topic}) using ${tools}? Address how your design satisfies "${primaryObj}" under distributed system failure modes.`,
      `For Day ${spec.day} (${topic}), what distributed system failure modes, memory spikes, or concurrency bottlenecks emerge when scaling ${tools}? How do you enforce "${primaryObj}" under strict SLA pressures?`,
      `In high-concurrency production environments, how do you tune ${tools} for Day ${spec.day} (${topic})? Walk through how your architecture guarantees "${primaryObj}" when query throughput scales 10x.`,
    ];
  } else if (difficulty === 'Advanced') {
    baseQuestions = [
      `Looking at Day ${spec.day} (${topic}), what are the primary architectural trade-offs, latency bottlenecks, and edge-case failure modes when building with ${tools}? How do you enforce "${primaryObj}"?`,
      `For Day ${spec.day} (${topic}), how do you configure and monitor ${tools} in a production microservice? What mechanisms ensure "${primaryObj}" isn't compromised by degraded network conditions?`,
      `When implementing Day ${spec.day} (${topic}) for enterprise AI systems, how do you handle error recovery and state synchronization across ${tools}? Specifically address "${primaryObj}".`,
    ];
  } else if (difficulty === 'Intermediate') {
    baseQuestions = [
      `Regarding Day ${spec.day} (${topic}), walk through your practical implementation approach using ${tools}. How do you ensure "${primaryObj}" is properly designed and verified?`,
      `In your work as a ${role}, how would you set up and test ${tools} for Day ${spec.day} (${topic})? Walk us through how you handle "${primaryObj}".`,
      `For Day ${spec.day} (${topic}), how do you structure your data models and API interactions with ${tools} to fulfill "${primaryObj}" efficiently?`,
    ];
  } else {
    baseQuestions = [
      `On Day ${spec.day} (${topic}), explain the core principles and setup steps when using ${tools} to accomplish "${primaryObj}".`,
      `For Day ${spec.day} (${topic}), what are the foundational concepts behind ${tools}, and how do they help achieve "${primaryObj}"?`,
    ];
  }

  // Filter out any question that is already asked in session
  const previousTexts = questionsAskedSoFar.map((q) => q.questionText.toLowerCase());
  for (const qText of baseQuestions) {
    if (!previousTexts.some((prev) => prev.includes(qText.toLowerCase().substring(0, 30)))) {
      return qText;
    }
  }

  return baseQuestions[questionNumber % baseQuestions.length];
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

  const q1Text = getQuestionsForCandidateSpec(q1Spec, initialDifficulty, candidate, 1, []);
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

  // Track attempt count for current primary question
  const previousAnswersForThisQ = (currentState.answers || []).filter((a) => a.questionNumber === qNum).length;
  const currentQuestionAttempts = previousAnswersForThisQ + 1;

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
        currentQuestionAttempts,
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
    apiResult = evaluateAnswerLocally(currentState, candidate, answerText, settings, currentQuestionAttempts);
  }

  let {
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

  // Canonicalize evaluation scores to 0-100 scale
  if (evaluation) {
    evaluation = {
      ...evaluation,
      score: normalizeScore(evaluation.score),
      technicalAccuracy: normalizeScore(evaluation.technicalAccuracy ?? evaluation.score),
      depth: normalizeScore(evaluation.depth ?? evaluation.score),
      reasoning: normalizeScore(evaluation.reasoning ?? evaluation.score),
      completeness: normalizeScore(evaluation.completeness ?? evaluation.score),
    };
  }

  // SAFETY ENFORCER:
  // If currentQuestionAttempts >= 2, or if nextQuestionNumber <= qNum when advancing is required, force advance!
  if (currentQuestionAttempts >= 2 && (!isRelevantAnswer || nextQuestionNumber <= qNum)) {
    isRelevantAnswer = true;
    nextQuestionNumber = qNum + 1;

    const uncoveredSpec = ALL_CURRICULUM.find((c) => !currentState.coveredDays.includes(c.day)) ||
      ALL_CURRICULUM[(qNum) % ALL_CURRICULUM.length];

    nextCurriculumDay = uncoveredSpec.day;
    nextTopic = getTopicForSpec(uncoveredSpec);
    nextCategory = getCategoryForSpec(uncoveredSpec);
    nextQuestionText = getQuestionsForCandidateSpec(
      uncoveredSpec,
      currentState.difficulty,
      candidate,
      nextQuestionNumber,
      currentState.questionsAsked
    );
  }

  console.log(`[INTERVIEW ENGINE] Session=${currentState.sessionId} | Candidate=${candidate.name} | Q=${qNum} | Attempt=${currentQuestionAttempts} | Advance=${isRelevantAnswer} -> NextQ=${nextQuestionNumber}`);

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

  // Completion Check Rules: Enforce strict configured question limit (e.g. 8, 10, or 12 questions)
  const isLastQuestion =
    qNum >= currentState.totalQuestions ||
    currentState.questionsAsked.length >= currentState.totalQuestions ||
    nextQuestionNumber > currentState.totalQuestions ||
    apiResult?.isInterviewComplete === true;

  let fullAiText = '';
  if (!isRelevantAnswer) {
    fullAiText = `${feedback}\n\n${nextQuestionText && nextQuestionText !== currentState.currentQuestion ? nextQuestionText : ''}`.trim();
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
    if (!newQuestionsAsked.some((q) => q.questionNumber === nextQuestionNumber)) {
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
    currentQuestion: isLastQuestion ? 'Interview Completed' : (isRelevantAnswer ? nextQuestionText : (nextQuestionText || currentState.currentQuestion)),
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
  settings?: InterviewSettings,
  currentQuestionAttempts: number = 1
) {
  const rawText = (answerText || '').toString().trim();
  const lowerAnswer = rawText.toLowerCase();
  const words = lowerAnswer.split(/\s+/).filter(Boolean);
  const qNum = currentState.currentQuestionNumber;

  const nonRespEval: AnswerEvaluation = {
    score: 0.0,
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

  const getNextQuestionData = () => {
    const nextQNum = qNum + 1;
    const uncoveredSpec = ALL_CURRICULUM.find((c) => !currentState.coveredDays.includes(c.day)) ||
      ALL_CURRICULUM[(qNum) % ALL_CURRICULUM.length];
    const day = uncoveredSpec.day;
    const topic = getTopicForSpec(uncoveredSpec);
    const category = getCategoryForSpec(uncoveredSpec);
    const qText = getQuestionsForCandidateSpec(uncoveredSpec, currentState.difficulty, candidate, nextQNum, currentState.questionsAsked);
    return { nextQNum, day, topic, category, qText };
  };

  const questionWords = ['what is', 'what are', 'how does', 'how do', 'why is', 'why do', 'can you', 'could you', 'is it', 'where is', 'how would you'];
  const startsWithQuestionWord = questionWords.some((qw) => lowerAnswer.startsWith(qw));
  const endsWithQuestionMark = rawText.endsWith('?');
  const isQuestionInsteadOfAnswer = (startsWithQuestionWord || endsWithQuestionMark) && words.length <= 16 && !lowerAnswer.includes('i recommend') && !lowerAnswer.includes('i would');

  const isSnippet = words.length <= 4 && (
    currentState.currentQuestion.toLowerCase().includes(lowerAnswer) ||
    lowerAnswer.startsWith('explain') ||
    lowerAnswer.startsWith('how would') ||
    lowerAnswer.startsWith('what is the')
  );

  const gibberishPatterns = ['asdf', 'qwerty', 'zxcv', '1234', 'test', 'hello', 'hi', 'hey', 'yo', 'sup'];
  const isGibberish = gibberishPatterns.some((p) => lowerAnswer === p || (words.length <= 2 && lowerAnswer.includes(p)));

  const isExplicitIdk = lowerAnswer === 'idk' || lowerAnswer === 'i dont know' || lowerAnswer === "i don't know" || lowerAnswer === 'not sure' || lowerAnswer === 'no idea';

  const isNonResponsive = isQuestionInsteadOfAnswer || isSnippet || isGibberish || isExplicitIdk;

  if (isNonResponsive && currentQuestionAttempts === 1) {
    let feedback = '';
    if (isQuestionInsteadOfAnswer) {
      feedback = `You're asking a question ("${rawText}") rather than addressing Question ${qNum}. Let's stay with the prompt: "${currentState.currentQuestion}". How would you approach this in your system design?`;
    } else if (isSnippet) {
      feedback = `That response looks like an incomplete prompt fragment. Please provide a full technical answer to Question ${qNum}: "${currentState.currentQuestion}".`;
    } else if (isGibberish) {
      feedback = `That response does not address the question asked. To evaluate your AI engineering depth for Question ${qNum}, please focus on: "${currentState.currentQuestion}".`;
    } else {
      feedback = `Understood, ${candidate.name}. If you haven't implemented Day ${currentState.currentCurriculumDay} (${currentState.currentFocusTopic}) directly, consider the core principle: how would you balance latency versus recall here?`;
    }

    return {
      isRelevantAnswer: false,
      evaluation: isExplicitIdk ? { ...nonRespEval, score: 0.1, answerQuality: 'weak' } : nonRespEval,
      feedback,
      nextQuestionNumber: qNum,
      nextCurriculumDay: currentState.currentCurriculumDay,
      nextQuestionText: currentState.currentQuestion,
      nextTopic: currentState.currentFocusTopic,
      nextCategory: currentState.currentCategory,
      nextDifficulty: currentState.difficulty,
      learningSignal: `Question ${qNum}: Clarification requested on Attempt 1`,
      followUpSuggestions: ['Answer technical question', 'Request clarification'],
      isInterviewComplete: false,
    };
  }

  const nextData = getNextQuestionData();

  let score = 0.65;
  let conceptsDemonstrated: string[] = ['general system reasoning'];
  let conceptsMissing: string[] = ['quantitative SLAs', 'edge-case failure modes'];
  let feedbackText = '';
  let learningSignal = '';

  if (isNonResponsive) {
    score = 0.1;
    conceptsDemonstrated = [];
    conceptsMissing = ['Technical context', 'System architecture terms'];
    feedbackText = `Note on Question ${qNum}: Moving forward to the next core AI engineering domain.`;
  } else if (lowerAnswer.includes('top-k') || lowerAnswer.includes('top k') || lowerAnswer.includes('increase top')) {
    score = 0.75;
    conceptsDemonstrated = ['top-k retrieval', 'recall expansion'];
    conceptsMissing = ['re-ranking stage', 'context window dilution'];
    feedbackText = `You highlighted expanding top-k parameters. Increasing top-k improves raw recall and ensures critical candidate chunks aren't cut off prematurely. However, higher top-k values increase vector DB query latency and introduce context noise. Pairing top-k expansion with a downstream cross-encoder or MMR re-ranker optimizes both recall and precision.`;
  } else if (lowerAnswer.includes('rerank') || lowerAnswer.includes('mmr') || lowerAnswer.includes('cohere') || lowerAnswer.includes('re-rank')) {
    score = 0.90;
    conceptsDemonstrated = ['MMR re-ranking', 'diversity scoring', 'cross-encoders'];
    conceptsMissing = ['latency budgeting'];
    feedbackText = `Strong architectural reasoning on re-ranking and diversity scoring. Using Maximal Marginal Relevance (MMR) or Cohere ReRank effectively eliminates duplicate vector clusters while preserving contextual precision before injecting chunks into the prompt context window.`;
  } else if (lowerAnswer.includes('hnsw') || lowerAnswer.includes('m') || lowerAnswer.includes('ef_construct') || lowerAnswer.includes('index')) {
    score = 0.85;
    conceptsDemonstrated = ['HNSW index parameters', 'indexing throughput vs recall'];
    conceptsMissing = ['quantization trade-offs'];
    feedbackText = `Solid understanding of HNSW graph index parameters. Tuning max edges per node (m) and construction search depth (ef_construct) is key to balancing build time vs recall at scale. Decoupling index construction into background workers prevents query API latency spikes.`;
  } else if (lowerAnswer.includes('mcp') || lowerAnswer.includes('schema') || lowerAnswer.includes('zod') || lowerAnswer.includes('tool')) {
    score = 0.88;
    conceptsDemonstrated = ['MCP tool protocols', 'Zod schema validation', 'circuit breakers'];
    conceptsMissing = ['multi-agent context passing'];
    feedbackText = `Accurate observation regarding Model Context Protocol (MCP) tool execution and schema guards. Enforcing JSON schema constraints and implementing retry handlers prevents downstream agent pipeline failures when external API integrations behave unpredictably.`;
  } else if (lowerAnswer.includes('cache') || lowerAnswer.includes('circuit') || lowerAnswer.includes('redis') || lowerAnswer.includes('fallback')) {
    score = 0.82;
    conceptsDemonstrated = ['circuit breakers', 'LRU cache fallbacks', 'SLA protection'];
    conceptsMissing = ['cache invalidation strategies'];
    feedbackText = `Excellent resilience pattern design. Implementing an in-memory LRU cache or secondary keyword fallback when primary vector DB query latency exceeds SLAs keeps agentic execution loops responsive under heavy load.`;
  } else {
    score = 0.65;
    conceptsDemonstrated = ['general system reasoning'];
    conceptsMissing = ['quantitative SLAs', 'edge-case failure modes'];
    const snippet = rawText.length > 80 ? rawText.substring(0, 80) + '...' : rawText;
    feedbackText = `Regarding your approach ("${snippet}"): you outlined practical trade-offs for ${currentState.currentFocusTopic}. To elevate this for enterprise systems, consider quantifying exact SLAs, error recovery bounds, and edge-case failure modes.`;
    learningSignal = `Question ${qNum}: Provided architectural explanation for Day ${currentState.currentCurriculumDay}`;
  }

  const evalObj: AnswerEvaluation = {
    score: normalizeScore(score),
    technicalAccuracy: normalizeScore(score),
    depth: normalizeScore(score > 0.7 ? 0.8 : 0.5),
    reasoning: normalizeScore(score > 0.7 ? 0.85 : 0.6),
    completeness: normalizeScore(score > 0.7 ? 0.8 : 0.5),
    conceptsDemonstrated,
    conceptsMissing,
    misconceptions: [],
    answerQuality: isNonResponsive ? 'non_responsive' : score >= 0.85 ? 'excellent' : score >= 0.7 ? 'strong' : 'developing',
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

  const isInterviewComplete =
    qNum >= currentState.totalQuestions ||
    nextData.nextQNum > currentState.totalQuestions ||
    currentState.questionsAsked.length >= currentState.totalQuestions;

  return {
    isRelevantAnswer: true,
    evaluation: evalObj,
    feedback: feedbackText,
    nextQuestionNumber: nextData.nextQNum,
    nextCurriculumDay: nextData.day,
    nextQuestionText: nextData.qText,
    nextTopic: nextData.topic,
    nextCategory: nextData.category,
    nextDifficulty,
    learningSignal: `Question ${qNum}: Evaluated answer (attempt ${currentQuestionAttempts})`,
    followUpSuggestions: [
      `Analyze ${nextData.topic} latency`,
      'Explain production failure modes',
      'Compare alternative architectures',
    ],
    isInterviewComplete,
  };
}
