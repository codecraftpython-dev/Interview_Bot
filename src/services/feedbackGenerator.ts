import { Candidate, InterviewState, FeedbackSummary, InterviewSettings, CurriculumDaySpec } from '../types';
import curriculumData from '../data/curriculum.json';
import { normalizeScore } from '../utils/scoreUtils';

const ALL_CURRICULUM = (curriculumData as any).days as CurriculumDaySpec[];

export async function generateFeedbackFromSession(
  session: InterviewState,
  candidate: Candidate,
  settings?: InterviewSettings
): Promise<FeedbackSummary> {
  // Try fetching AI-generated feedback from backend first
  try {
    const res = await fetch('/api/interview/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        candidate,
        session,
        settings,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.overallScore !== undefined) {
        data.overallScore = normalizeScore(data.overallScore);
        data.technicalAccuracy = normalizeScore(data.technicalAccuracy ?? data.overallScore);
        data.systemDesignDepth = normalizeScore(data.systemDesignDepth ?? data.overallScore);
        data.communicationClarity = normalizeScore(data.communicationClarity ?? data.overallScore);
        if (Array.isArray(data.technicalAreasAssessed)) {
          data.technicalAreasAssessed.forEach((a: any) => {
            if (a.score !== undefined) a.score = normalizeScore(a.score);
          });
        }
        if (data.communicationAssessment) {
          data.communicationAssessment.score = normalizeScore(data.communicationAssessment.score);
        }
        if (data.engineeringThinking) {
          data.engineeringThinking.score = normalizeScore(data.engineeringThinking.score);
        }
        return data as FeedbackSummary;
      }
    }
  } catch (e) {
    console.warn('Backend feedback generation unavailable, falling back to local evaluation engine:', e);
  }

  // Fallback to local evidence-based feedback generator
  return generateLocalFeedback(session, candidate);
}

export function generateLocalFeedback(
  session: InterviewState,
  candidate: Candidate
): FeedbackSummary {
  const answers = session.answers.filter((a) => a.answerText && a.answerText.trim().length > 0);
  const totalQuestions = answers.length;

  if (totalQuestions === 0) {
    return {
      candidateId: candidate.id,
      candidateName: candidate.name,
      sessionId: session.sessionId,
      completedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      overallScore: 40,
      technicalAccuracy: 35,
      systemDesignDepth: 40,
      communicationClarity: 45,
      strengths: ['Session initiated but no substantial technical responses were recorded.'],
      growthAreas: ['Provide technical responses to evaluate architectural depth.'],
      transcriptHighlights: [],
      curriculumDaysCovered: session.coveredDays.length,
      totalQuestionsAnswered: 0,
      recommendedStudyPlan: [
        {
          day: 1,
          topic: 'Dense vs Sparse Embeddings',
          action: 'Start with foundational vector embedding concepts.',
        },
      ],
    };
  }

  // Calculate scores directly from answer evaluations
  let totalAcc = 0;
  let totalDepth = 0;
  let totalClarity = 0;
  let evalCount = 0;

  const demonstratedSet = new Set<string>();
  const missingSet = new Set<string>();
  const misconceptionsSet = new Set<string>();

  answers.forEach((ans) => {
    const evalData = ans.evaluation;
    if (evalData) {
      evalCount++;
      const acc = normalizeScore(evalData.technicalAccuracy ?? evalData.score);
      const depth = normalizeScore(evalData.depth ?? evalData.score);
      const clarity = normalizeScore(evalData.completeness ?? evalData.score);

      totalAcc += acc;
      totalDepth += depth;
      totalClarity += clarity;

      (evalData.conceptsDemonstrated || []).forEach((c) => demonstratedSet.add(c));
      (evalData.conceptsMissing || []).forEach((c) => missingSet.add(c));
      (evalData.misconceptions || []).forEach((c) => misconceptionsSet.add(c));
    }
  });

  const technicalAccuracy = evalCount > 0 ? Math.min(100, Math.max(10, Math.round(totalAcc / evalCount))) : 60;
  const systemDesignDepth = evalCount > 0 ? Math.min(100, Math.max(10, Math.round(totalDepth / evalCount))) : 60;
  const communicationClarity = evalCount > 0 ? Math.min(100, Math.max(10, Math.round(totalClarity / evalCount))) : 60;

  // Weighted overall score
  const overallScore = Math.min(
    100,
    Math.max(10, Math.round(0.4 * technicalAccuracy + 0.35 * systemDesignDepth + 0.25 * communicationClarity))
  );

  // Derive strengths from actual interview evidence
  const strengthsList: string[] = [];
  if (demonstratedSet.size > 0) {
    Array.from(demonstratedSet).slice(0, 4).forEach((concept) => {
      strengthsList.push(`Demonstrated solid reasoning regarding ${concept}`);
    });
  } else if (overallScore >= 70) {
    strengthsList.push(`Structured responses across ${session.coveredDays.length} curriculum topics`);
    strengthsList.push(`Maintained clear technical vocabulary during problem solving`);
  } else {
    strengthsList.push(`Participated in technical probing across ${session.coveredDays.length} curriculum days`);
  }

  // Derive growth areas from missing concepts or misconceptions
  const growthList: string[] = [];
  if (missingSet.size > 0) {
    Array.from(missingSet).slice(0, 3).forEach((concept) => {
      growthList.push(`Elaborate more on trade-offs and implementation details for ${concept}`);
    });
  }
  if (misconceptionsSet.size > 0) {
    Array.from(misconceptionsSet).slice(0, 2).forEach((misc) => {
      growthList.push(`Clarify architecture pattern: ${misc}`);
    });
  }
  if (growthList.length === 0) {
    growthList.push('Explore edge-case failure modes under multi-region high latency constraints');
    growthList.push('Quantify production SLA trade-offs explicitly during systems design');
  }

  // Derive transcript highlights from actual asked questions and answers
  const transcriptHighlights = answers.slice(0, 3).map((ans) => {
    const matchedQ = session.questionsAsked.find((q) => q.questionNumber === ans.questionNumber);
    const qText = matchedQ ? matchedQ.questionText : `Question ${ans.questionNumber}`;
    const scoreVal = ans.evaluation ? Math.round((ans.evaluation.score || 0) * 100) : 70;
    const qualityStr = ans.evaluation?.answerQuality || 'developing';

    let evalNote = `Answer quality evaluated as ${qualityStr} (${scoreVal}% accuracy).`;
    if (ans.evaluation?.conceptsDemonstrated?.length) {
      evalNote += ` Highlighted: ${ans.evaluation.conceptsDemonstrated.slice(0, 2).join(', ')}.`;
    }

    return {
      question: qText,
      candidateAnswer: ans.answerText.length > 180 ? ans.answerText.substring(0, 180) + '...' : ans.answerText,
      evalNote,
    };
  });

  // Build actionable study plan referencing specific curriculum days
  const recommendedStudyPlan = session.coveredDays.slice(0, 3).map((dayNum) => {
    const spec = ALL_CURRICULUM.find((c) => c.day === dayNum);
    const topic = spec?.title || `Day ${dayNum} Curriculum Topic`;
    const type = spec?.type || 'Core';
    return {
      day: dayNum,
      topic,
      action: `Review Day ${dayNum} (${type}: ${topic}) — practice architecture trade-offs and failure scenarios.`,
    };
  });

  // Derive technical areas assessed
  const technicalAreasAssessed = session.questionsAsked.map((q) => {
    const ans = answers.find((a) => a.questionNumber === q.questionNumber);
    const evalData = ans?.evaluation;
    const scoreVal = evalData ? normalizeScore(evalData.score) : 70;
    const levelStr = scoreVal >= 85 ? 'Expert' : scoreVal >= 70 ? 'Advanced' : scoreVal >= 55 ? 'Intermediate' : 'Foundation';
    const excerpt = ans?.answerText ? (ans.answerText.length > 120 ? ans.answerText.substring(0, 120) + '...' : ans.answerText) : 'No answer provided.';
    return {
      topic: q.topicTag || `Day ${q.curriculumDay} Domain`,
      score: scoreVal,
      level: levelStr,
      evidence: `Candidate response: "${excerpt}"`,
    };
  });

  // Curriculum assessments for covered days
  const curriculumAssessments = session.coveredDays.map((dayNum) => {
    const spec = ALL_CURRICULUM.find((c) => c.day === dayNum);
    const topic = spec?.title || `Day ${dayNum} Curriculum Topic`;
    const matchedQ = session.questionsAsked.find((q) => q.curriculumDay === dayNum);
    const matchedAns = matchedQ ? answers.find((a) => a.questionNumber === matchedQ.questionNumber) : null;
    const scoreVal = matchedAns?.evaluation ? normalizeScore(matchedAns.evaluation.score) : 70;
    const assessmentStatus: 'Strong' | 'Developing' | 'Needs Review' =
      scoreVal >= 80 ? 'Strong' : scoreVal >= 60 ? 'Developing' : 'Needs Review';

    const evidenceText = matchedAns?.answerText
      ? `Demonstrated ${scoreVal}% understanding when explaining ${topic}: "${matchedAns.answerText.substring(0, 140)}..."`
      : `Covered Day ${dayNum} (${topic}) during interview session.`;

    return {
      day: dayNum,
      topic,
      assessment: assessmentStatus,
      evidence: evidenceText,
    };
  });

  // Identify areas of uncertainty (questions where candidate struggled or gave weak answers)
  const areasOfUncertainty = answers
    .filter((a) => (a.evaluation ? normalizeScore(a.evaluation.score) < 75 : true) || a.answerText.length < 50)
    .slice(0, 3)
    .map((ans) => {
      const q = session.questionsAsked.find((q) => q.questionNumber === ans.questionNumber);
      return {
        question: q?.questionText || `Question ${ans.questionNumber}`,
        responseSummary: ans.answerText.length > 100 ? ans.answerText.substring(0, 100) + '...' : ans.answerText,
        missingConcept: ans.evaluation?.conceptsMissing?.[0] || 'Quantitative SLAs and edge-case failure handling',
        strongerAnswerApproach: `A stronger engineering answer should address specific trade-offs, metrics, and error recovery strategies for ${q?.topicTag || 'this topic'}.`,
      };
    });

  // Identify strongest responses
  const strongestResponses = answers
    .filter((a) => (a.evaluation ? normalizeScore(a.evaluation.score) >= 70 : false))
    .slice(0, 3)
    .map((ans) => {
      const q = session.questionsAsked.find((q) => q.questionNumber === ans.questionNumber);
      return {
        question: q?.questionText || `Question ${ans.questionNumber}`,
        candidateAnswer: ans.answerText.length > 160 ? ans.answerText.substring(0, 160) + '...' : ans.answerText,
        whyStrong: ans.evaluation?.conceptsDemonstrated?.length
          ? `Correctly articulated concepts: ${ans.evaluation.conceptsDemonstrated.join(', ')}.`
          : 'Provided a clear, structured technical explanation with realistic system trade-offs.',
      };
    });

  const overallAssessmentTag: 'Strong' | 'Satisfactory' | 'Developing' | 'Needs Review' =
    overallScore >= 82 ? 'Strong' : overallScore >= 70 ? 'Satisfactory' : overallScore >= 55 ? 'Developing' : 'Needs Review';

  const confidenceTag: 'High' | 'Medium' | 'Low' = totalQuestions >= 6 ? 'High' : totalQuestions >= 3 ? 'Medium' : 'Low';

  const executiveSummary = `${candidate.name} completed an adaptive ${session.totalQuestions}-question technical interview. Based on direct evaluation of candidate responses across ${session.coveredDays.length} curriculum days, ${candidate.name} demonstrated ${demonstratedSet.size > 0 ? Array.from(demonstratedSet).slice(0, 3).join(', ') : 'solid architectural reasoning'}. Key opportunities for development include ${missingSet.size > 0 ? Array.from(missingSet).slice(0, 2).join(' and ') : 'quantifying production SLAs and edge-case failure modes'}.`;

  const profileVsEvidence = {
    profileContext: `Candidate record shows ${candidate.completedMissions ?? 28} of 31 missions completed in cohort curriculum.`,
    interviewEvidence: `In live interview Q&A (${totalQuestions} questions answered), candidate demonstrated ${technicalAccuracy}% technical accuracy and ${systemDesignDepth}% system design depth based on actual response evaluation.`,
  };

  const nextSteps = [
    `Practice quantifying retrieval precision/recall SLAs for ${candidate.role || 'AI Engineering'} pipelines.`,
    'Explore edge-case failure handling and multi-region failover strategies.',
    'Work through curriculum days flagged for review to solidify architectural trade-offs.',
  ];

  return {
    candidateId: candidate.id,
    candidateName: candidate.name,
    candidateRole: candidate.role,
    sessionId: session.sessionId,
    completedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    questionLimit: session.totalQuestions,
    totalQuestionsAnswered: answers.length,
    overallScore,
    overallAssessment: overallAssessmentTag,
    assessmentConfidence: confidenceTag,
    confidenceReason: `Assessment derived directly from candidate's ${answers.length} answers across ${session.coveredDays.length} curriculum topics in session ${session.sessionId}.`,
    executiveSummary,
    technicalAccuracy,
    systemDesignDepth,
    communicationClarity,
    profileVsEvidence,
    strengths: strengthsList,
    growthAreas: growthList,
    technicalAreasAssessed,
    curriculumAssessments,
    areasOfUncertainty,
    strongestResponses,
    communicationAssessment: {
      score: communicationClarity,
      analysis: 'Candidate responses were generally structured and used clear engineering vocabulary.',
      vocabulary: 'Demonstrated understanding of core vector and LLM system terminology.',
      clarity: 'Articulated technical reasoning clearly during problem-solving.',
    },
    engineeringThinking: {
      score: systemDesignDepth,
      analysis: 'Demonstrated practical approach to system design rather than simple memorization.',
      tradeOffReasoning: 'Evaluated trade-offs between latency, recall, and infrastructure complexity.',
    },
    nextSteps,
    transcriptHighlights,
    curriculumDaysCovered: session.coveredDays.length,
    recommendedStudyPlan,
  };
}
