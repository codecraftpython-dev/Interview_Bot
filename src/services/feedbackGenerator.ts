import { Candidate, InterviewState, FeedbackSummary, InterviewSettings, CurriculumDaySpec } from '../types';
import curriculumData from '../data/curriculum.json';

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
      totalAcc += evalData.technicalAccuracy ?? (evalData.score * 100);
      totalDepth += evalData.depth ?? (evalData.score * 100);
      totalClarity += evalData.completeness ?? (evalData.score * 100);

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

  return {
    candidateId: candidate.id,
    candidateName: candidate.name,
    sessionId: session.sessionId,
    completedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    overallScore,
    technicalAccuracy,
    systemDesignDepth,
    communicationClarity,
    strengths: strengthsList,
    growthAreas: growthList,
    transcriptHighlights,
    curriculumDaysCovered: session.coveredDays.length,
    totalQuestionsAnswered: answers.length,
    recommendedStudyPlan,
  };
}
