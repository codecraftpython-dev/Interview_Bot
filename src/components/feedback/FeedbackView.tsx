import React from 'react';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  BookOpen,
  ShieldCheck,
  HelpCircle,
  TrendingUp,
  MessageSquare,
  Cpu,
  BarChart3,
  UserCheck,
  FileText,
  Brain,
} from 'lucide-react';
import { FeedbackSummary, CompletedSessionRecord } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { normalizeScore, formatScore } from '../../utils/scoreUtils';

interface FeedbackViewProps {
  feedback?: FeedbackSummary | null;
  completedSessions?: CompletedSessionRecord[];
  selectedSessionId?: string;
  onSelectSession?: (sessionId: string) => void;
  onReInterview: () => void;
}

export const FeedbackView: React.FC<FeedbackViewProps> = ({
  feedback,
  completedSessions = [],
  selectedSessionId,
  onSelectSession,
  onReInterview,
}) => {
  if (!feedback) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 flex items-center justify-center mx-auto text-[#8B5CF6]">
          <Award className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-[#F4F4F5]">No Completed Interview Reports Yet</h1>
          <p className="text-sm text-[#A1A1AA] max-w-md mx-auto">
            Complete a practice interview session with the AI Interviewer to receive your personalized, evidence-based technical evaluation.
          </p>
        </div>
        <Button
          variant="primary"
          size="lg"
          onClick={onReInterview}
          icon={<Sparkles className="w-5 h-5" />}
          className="shadow-lg shadow-purple-500/20"
        >
          Start Practice Interview
        </Button>
      </div>
    );
  }

  const overallCanonical = normalizeScore(feedback.overallScore);
  const formattedOverall = formatScore(overallCanonical, 'slash100');
  const percentageOverall = `${overallCanonical}%`;

  const getTierBadge = (score: number) => {
    const norm = normalizeScore(score);
    if (norm >= 82) return { label: 'Strong Assessment', color: 'text-[#22C55E]', bg: 'bg-[#22C55E]/10 border-[#22C55E]/30' };
    if (norm >= 70) return { label: 'Satisfactory', color: 'text-[#6366F1]', bg: 'bg-[#6366F1]/10 border-[#6366F1]/30' };
    if (norm >= 55) return { label: 'Developing', color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10 border-[#F59E0B]/30' };
    return { label: 'Needs Review', color: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10 border-[#EF4444]/30' };
  };

  const tier = getTierBadge(feedback.overallScore);
  const confidence = feedback.assessmentConfidence || 'High';
  const questionsAnswered = feedback.totalQuestionsAnswered ?? 8;
  const questionLimit = feedback.questionLimit ?? 8;

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 text-left">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#27272A]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="purple" size="sm">Structured Interview Feedback</Badge>
            <span className="text-xs text-[#71717A] font-mono">
              Session #{feedback.sessionId || 'INT-CURRENT'}
            </span>
            {feedback.completedAt && (
              <span className="text-xs text-[#71717A]">
                • {feedback.completedAt}
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F4F4F5] tracking-tight mt-1">
            Technical Interview Assessment: {feedback.candidateName}
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A1AA] mt-0.5">
            Role: <span className="text-[#F4F4F5] font-medium">{feedback.candidateRole || 'Senior AI Systems Engineer'}</span> • Questions Completed: <span className="text-[#8B5CF6] font-semibold">{questionsAnswered} / {questionLimit}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {completedSessions.length > 1 && onSelectSession && (
            <select
              value={selectedSessionId || feedback.sessionId}
              onChange={(e) => onSelectSession(e.target.value)}
              className="bg-[#151518] border border-[#27272A] text-xs text-[#F4F4F5] rounded-xl px-3 py-2 focus:outline-none focus:border-[#8B5CF6]"
            >
              {completedSessions.map((s, idx) => (
                <option key={s.sessionId} value={s.sessionId}>
                  Session #{idx + 1} ({s.completedAt}) — {formatScore(s.feedback.overallScore)}
                </option>
              ))}
            </select>
          )}

          <Button variant="primary" size="sm" onClick={onReInterview} icon={<Sparkles className="w-4 h-4" />}>
            New Practice Session
          </Button>
        </div>
      </div>

      {/* Top Level Score Card Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Score */}
        <div className="bg-[#151518] p-5 rounded-2xl border border-[#27272A] flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#71717A] uppercase tracking-wider">
              Overall Assessment
            </span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${tier.bg} ${tier.color}`}>
              {feedback.overallAssessment || tier.label}
            </span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#F4F4F5]">{overallCanonical}</span>
              <span className="text-sm font-semibold text-[#71717A]">/ 100</span>
              <span className="text-xs font-medium text-[#8B5CF6] ml-1">({percentageOverall})</span>
            </div>
            <p className="text-[11px] text-[#A1A1AA] mt-1">
              Weighted across accuracy, design depth, and clarity
            </p>
          </div>
        </div>

        {/* Question Limit & Progress */}
        <div className="bg-[#151518] p-5 rounded-2xl border border-[#27272A] flex flex-col justify-between shadow-sm">
          <span className="text-xs font-semibold text-[#71717A] uppercase tracking-wider">
            Questions Completed
          </span>
          <div className="mt-2">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#8B5CF6]">{questionsAnswered}</span>
              <span className="text-sm font-semibold text-[#71717A]">/ {questionLimit}</span>
            </div>
            <p className="text-[11px] text-[#22C55E] mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Interview Stopped at Question Limit</span>
            </p>
          </div>
        </div>

        {/* Assessment Confidence */}
        <div className="bg-[#151518] p-5 rounded-2xl border border-[#27272A] flex flex-col justify-between shadow-sm">
          <span className="text-xs font-semibold text-[#71717A] uppercase tracking-wider">
            Assessment Confidence
          </span>
          <div className="mt-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-[#F4F4F5]">{confidence}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/30">
                Evidence-Based
              </span>
            </div>
            <p className="text-[11px] text-[#A1A1AA] mt-1 truncate" title={feedback.confidenceReason}>
              {feedback.confidenceReason || `Evaluated over ${questionsAnswered} responses.`}
            </p>
          </div>
        </div>

        {/* Technical Accuracy Score */}
        <div className="bg-[#151518] p-5 rounded-2xl border border-[#27272A] flex flex-col justify-between shadow-sm">
          <span className="text-xs font-semibold text-[#71717A] uppercase tracking-wider">
            Technical Accuracy
          </span>
          <div className="mt-2">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#86EFAC]">{normalizeScore(feedback.technicalAccuracy)}</span>
              <span className="text-sm font-semibold text-[#71717A]">/ 100</span>
            </div>
            <p className="text-[11px] text-[#A1A1AA] mt-1">
              Accuracy in vector retrieval & system formulas
            </p>
          </div>
        </div>
      </div>

      {/* EXECUTIVE SUMMARY */}
      <div className="bg-[#151518] p-6 rounded-2xl border border-[#27272A] space-y-3">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-[#8B5CF6]" />
          <h2 className="text-base font-semibold text-[#F4F4F5]">Executive Summary</h2>
        </div>
        <p className="text-xs sm:text-sm text-[#D4D4D8] leading-relaxed bg-[#1A1A1F] p-4 rounded-xl border border-[#27272A]">
          {feedback.executiveSummary ||
            `${feedback.candidateName} completed a ${questionLimit}-question technical interview. Based on direct analysis of responses provided during Q&A, the candidate demonstrated solid technical reasoning across ${feedback.curriculumDaysCovered || 4} curriculum days.`}
        </p>
      </div>

      {/* CANDIDATE PROFILE VS INTERVIEW EVIDENCE */}
      <div className="bg-[#151518] p-6 rounded-2xl border border-[#27272A] space-y-4">
        <div className="flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-[#6366F1]" />
          <h2 className="text-base font-semibold text-[#F4F4F5]">Profile Context vs. Interview Evidence</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#1A1A1F] p-4 rounded-xl border border-[#27272A] space-y-2">
            <div className="text-xs font-bold text-[#A1A1AA] uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#71717A]" />
              <span>Known From Profile Record</span>
            </div>
            <p className="text-xs text-[#D4D4D8] leading-relaxed">
              {feedback.profileVsEvidence?.profileContext ||
                `${feedback.candidateName} is recorded as ${feedback.candidateRole || 'AI Engineer'} with prior curriculum mission history.`}
            </p>
          </div>

          <div className="bg-[#1A1A1F] p-4 rounded-xl border border-[#8B5CF6]/30 space-y-2">
            <div className="text-xs font-bold text-[#8B5CF6] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#8B5CF6]" />
              <span>Demonstrated In Actual Interview Q&A</span>
            </div>
            <p className="text-xs text-[#D4D4D8] leading-relaxed">
              {feedback.profileVsEvidence?.interviewEvidence ||
                `In this live session (${questionsAnswered} questions answered), demonstrated ${formatScore(feedback.technicalAccuracy)} technical accuracy and ${formatScore(feedback.systemDesignDepth)} system design depth based on direct answer evidence.`}
            </p>
          </div>
        </div>
      </div>

      {/* TECHNICAL UNDERSTANDING (AREAS ASSESSED) */}
      {feedback.technicalAreasAssessed && feedback.technicalAreasAssessed.length > 0 && (
        <div className="bg-[#151518] p-6 rounded-2xl border border-[#27272A] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#8B5CF6]" />
              <h2 className="text-base font-semibold text-[#F4F4F5]">Technical Areas Assessed</h2>
            </div>
            <span className="text-xs text-[#71717A]">Only topics discussed during session</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {feedback.technicalAreasAssessed.map((area, idx) => (
              <div key={idx} className="bg-[#1A1A1F] p-4 rounded-xl border border-[#27272A] space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#F4F4F5]">{area.topic}</span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#8B5CF6]/15 text-[#C4B5FD]">
                      {formatScore(area.score)}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#A1A1AA] mt-1 font-medium">Level: {area.level}</div>
                </div>
                <div className="text-[11px] text-[#D4D4D8] italic bg-[#111113] p-2.5 rounded border border-[#27272A]">
                  {area.evidence}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CURRICULUM-ALIGNED ASSESSMENT */}
      {feedback.curriculumAssessments && feedback.curriculumAssessments.length > 0 && (
        <div className="bg-[#151518] p-6 rounded-2xl border border-[#27272A] space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#6366F1]" />
            <h2 className="text-base font-semibold text-[#F4F4F5]">Curriculum-Aligned Assessment</h2>
          </div>

          <div className="space-y-3">
            {feedback.curriculumAssessments.map((curr, idx) => {
              const statusColor =
                curr.assessment === 'Strong'
                  ? 'text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/30'
                  : curr.assessment === 'Developing'
                  ? 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30'
                  : 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/30';

              return (
                <div key={idx} className="bg-[#1A1A1F] p-4 rounded-xl border border-[#27272A] space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#8B5CF6]">Day {curr.day}</span>
                      <span className="text-xs font-semibold text-[#F4F4F5]">• {curr.topic}</span>
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${statusColor}`}>
                      {curr.assessment}
                    </span>
                  </div>
                  <p className="text-xs text-[#A1A1AA] leading-relaxed">
                    <strong className="text-[#D4D4D8]">Evidence:</strong> {curr.evidence}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STRENGTHS & AREAS FOR IMPROVEMENT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-[#151518] p-6 rounded-2xl border border-[#27272A] space-y-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#86EFAC]">
            <CheckCircle2 className="w-5 h-5 text-[#22C55E] shrink-0" />
            <h3 className="text-sm font-semibold text-[#F4F4F5]">Key Demonstrated Strengths</h3>
          </div>
          {feedback.strengths && feedback.strengths.length > 0 ? (
            <ul className="space-y-2.5 my-auto">
              {feedback.strengths.map((str, idx) => (
                <li key={idx} className="text-xs sm:text-sm text-[#D4D4D8] bg-[#1A1A1F] p-3.5 rounded-xl border border-[#27272A] leading-relaxed flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] mt-2 shrink-0" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="bg-[#1A1A1F] p-6 rounded-xl border border-[#27272A] text-center my-auto space-y-1">
              <p className="text-xs text-[#A1A1AA]">No specific strengths recorded.</p>
            </div>
          )}
        </div>

        {/* Growth Areas (Need Review) */}
        <div className="bg-[#151518] p-6 rounded-2xl border border-[#27272A] space-y-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#FDE68A]">
            <AlertTriangle className="w-5 h-5 text-[#F59E0B] shrink-0" />
            <h3 className="text-sm font-semibold text-[#F4F4F5]">Actionable Growth Areas (Need Review)</h3>
          </div>
          {feedback.growthAreas && feedback.growthAreas.length > 0 ? (
            <ul className="space-y-2.5 my-auto">
              {feedback.growthAreas.map((area, idx) => (
                <li key={idx} className="text-xs sm:text-sm text-[#D4D4D8] bg-[#1A1A1F] p-3.5 rounded-xl border border-[#27272A] leading-relaxed flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] mt-2 shrink-0" />
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="bg-[#1A1A1F] p-6 rounded-xl border border-[#27272A] text-center my-auto space-y-1">
              <CheckCircle2 className="w-6 h-6 text-[#22C55E] mx-auto opacity-80" />
              <p className="text-xs sm:text-sm text-[#F4F4F5] font-medium">No major review areas identified</p>
              <p className="text-[11px] text-[#A1A1AA]">Candidate demonstrated solid comprehension across all assessed curriculum topics.</p>
            </div>
          )}
        </div>
      </div>

      {/* AREAS OF UNCERTAINTY (QUESTIONS WHERE CANDIDATE STRUGGLED) */}
      {feedback.areasOfUncertainty && feedback.areasOfUncertainty.length > 0 && (
        <div className="bg-[#151518] p-6 rounded-2xl border border-[#27272A] space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#F59E0B]" />
            <h2 className="text-base font-semibold text-[#F4F4F5]">Areas of Uncertainty (Questions Needing Depth)</h2>
          </div>

          <div className="space-y-3">
            {feedback.areasOfUncertainty.map((item, idx) => (
              <div key={idx} className="bg-[#1A1A1F] p-4 rounded-xl border border-[#27272A] space-y-2">
                <div className="text-xs font-semibold text-[#FDE68A]">
                  Question: {item.question}
                </div>
                <div className="text-xs text-[#A1A1AA] italic">
                  Candidate Response Summary: "{item.responseSummary}"
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-[11px]">
                  <div className="bg-[#111113] p-2.5 rounded border border-[#27272A] text-[#F87171]">
                    <strong className="block font-semibold mb-0.5">Missing Concept:</strong>
                    {item.missingConcept}
                  </div>
                  <div className="bg-[#111113] p-2.5 rounded border border-[#27272A] text-[#86EFAC]">
                    <strong className="block font-semibold mb-0.5">Stronger Answer Approach:</strong>
                    {item.strongerAnswerApproach}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STRONGEST RESPONSES */}
      {feedback.strongestResponses && feedback.strongestResponses.length > 0 && (
        <div className="bg-[#151518] p-6 rounded-2xl border border-[#27272A] space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#8B5CF6]" />
            <h2 className="text-base font-semibold text-[#F4F4F5]">Strongest Technical Responses</h2>
          </div>

          <div className="space-y-3">
            {feedback.strongestResponses.map((item, idx) => (
              <div key={idx} className="bg-[#1A1A1F] p-4 rounded-xl border border-[#27272A] space-y-2">
                <div className="text-xs font-semibold text-[#8B5CF6]">Question: {item.question}</div>
                <div className="text-xs text-[#D4D4D8] italic bg-[#111113] p-3 rounded-lg border border-[#27272A]">
                  "{item.candidateAnswer}"
                </div>
                <div className="text-[11px] text-[#22C55E] flex items-center gap-1.5 font-medium pt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E] shrink-0" />
                  <span>Why Strong: {item.whyStrong}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* COMMUNICATION & ENGINEERING THINKING */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#151518] p-6 rounded-2xl border border-[#27272A] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#6366F1]" />
              <h3 className="text-sm font-semibold text-[#F4F4F5]">Communication Assessment</h3>
            </div>
            <span className="text-xs font-bold text-[#6366F1]">
              {formatScore(feedback.communicationAssessment?.score ?? feedback.communicationClarity)}
            </span>
          </div>
          <p className="text-xs text-[#D4D4D8] bg-[#1A1A1F] p-3.5 rounded-xl border border-[#27272A] leading-relaxed">
            {feedback.communicationAssessment?.analysis ||
              'Candidate responses were generally structured, clear, and used appropriate AI engineering vocabulary.'}
          </p>
        </div>

        <div className="bg-[#151518] p-6 rounded-2xl border border-[#27272A] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#8B5CF6]" />
              <h3 className="text-sm font-semibold text-[#F4F4F5]">Engineering Reasoning</h3>
            </div>
            <span className="text-xs font-bold text-[#8B5CF6]">
              {formatScore(feedback.engineeringThinking?.score ?? feedback.systemDesignDepth)}
            </span>
          </div>
          <p className="text-xs text-[#D4D4D8] bg-[#1A1A1F] p-3.5 rounded-xl border border-[#27272A] leading-relaxed">
            {feedback.engineeringThinking?.analysis ||
              'Demonstrated practical problem decomposition and architecture trade-off analysis during technical probing.'}
          </p>
        </div>
      </div>

      {/* RECOMMENDED NEXT STEPS */}
      <div className="bg-[#151518] p-6 rounded-2xl border border-[#27272A] space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#8B5CF6]" />
          <h2 className="text-base font-semibold text-[#F4F4F5]">Recommended Next Steps</h2>
        </div>

        <div className="space-y-2">
          {(feedback.nextSteps || [
            'Practice quantifying retrieval precision and latency SLAs.',
            'Review error recovery and failover mechanisms in RAG pipelines.',
            'Work through recommended curriculum days to fill identified gaps.',
          ]).map((step, idx) => (
            <div key={idx} className="flex items-start gap-3 bg-[#1A1A1F] p-3.5 rounded-xl border border-[#27272A]">
              <span className="w-6 h-6 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#C4B5FD] flex items-center justify-center text-xs font-bold shrink-0">
                {idx + 1}
              </span>
              <p className="text-xs sm:text-sm text-[#D4D4D8] leading-relaxed pt-0.5">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CURRICULUM DAYS TO REVIEW */}
      {feedback.recommendedStudyPlan && feedback.recommendedStudyPlan.length > 0 && (
        <div className="bg-[#151518] p-6 rounded-2xl border border-[#27272A] space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#8B5CF6]" />
            <h2 className="text-base font-semibold text-[#F4F4F5]">Curriculum Topics to Review</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {feedback.recommendedStudyPlan.map((plan, idx) => (
              <div key={idx} className="bg-[#1A1A1F] p-4 rounded-xl border border-[#27272A] space-y-2">
                <div className="text-xs font-bold text-[#8B5CF6] uppercase tracking-wider">
                  Day {plan.day} Curriculum Focus
                </div>
                <div className="text-xs font-semibold text-[#F4F4F5]">{plan.topic}</div>
                <div className="text-[11px] text-[#A1A1AA] leading-relaxed">{plan.action}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
