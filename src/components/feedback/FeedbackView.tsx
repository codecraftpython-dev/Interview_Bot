import React from 'react';
import { Award, CheckCircle2, AlertTriangle, Download, Sparkles, BookOpen, Layers, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { FeedbackSummary, CompletedSessionRecord } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

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
  // If no feedback or empty completed sessions list
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

  const getTierBadge = (score: number) => {
    if (score >= 85) return { label: 'Strong Hire Tier', color: 'text-[#22C55E]', bg: 'bg-[#22C55E]/10' };
    if (score >= 70) return { label: 'Hire Tier', color: 'text-[#6366F1]', bg: 'bg-[#6366F1]/10' };
    if (score >= 55) return { label: 'Developing Tier', color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10' };
    return { label: 'Needs Practice', color: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10' };
  };

  const tier = getTierBadge(feedback.overallScore);

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 text-left">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#27272A]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="purple" size="sm">Interview Report</Badge>
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
            Technical Evaluation: {feedback.candidateName}
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A1AA] mt-0.5">
            Adaptive AI Systems Interview • Evidence-Based Evaluation
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Session Selector if multiple completed sessions exist */}
          {completedSessions.length > 1 && onSelectSession && (
            <select
              value={selectedSessionId || feedback.sessionId}
              onChange={(e) => onSelectSession(e.target.value)}
              className="bg-[#151518] border border-[#27272A] text-xs text-[#F4F4F5] rounded-xl px-3 py-2 focus:outline-none focus:border-[#8B5CF6]"
            >
              {completedSessions.map((s, idx) => (
                <option key={s.sessionId} value={s.sessionId}>
                  Session #{idx + 1} ({s.completedAt}) — {s.feedback.overallScore}%
                </option>
              ))}
            </select>
          )}

          <Button variant="primary" size="sm" onClick={onReInterview} icon={<Sparkles className="w-4 h-4" />}>
            New Practice Session
          </Button>
        </div>
      </div>

      {/* Interview Session Summary Stats Bar */}
      <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-[#151518] border border-[#27272A] text-xs text-[#A1A1AA]">
        <div className="flex items-center gap-1.5 font-medium text-[#F4F4F5]">
          <Layers className="w-4 h-4 text-[#8B5CF6]" />
          <span>{feedback.curriculumDaysCovered ?? 4} Curriculum Days Assessed</span>
        </div>
        <span className="text-[#3F3F46]">•</span>
        <div className="flex items-center gap-1.5 font-medium text-[#F4F4F5]">
          <BookOpen className="w-4 h-4 text-[#6366F1]" />
          <span>{feedback.totalQuestionsAnswered ?? feedback.transcriptHighlights.length} Questions Evaluated</span>
        </div>
        <span className="text-[#3F3F46]">•</span>
        <div className="flex items-center gap-1.5 font-medium text-[#F4F4F5]">
          <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
          <span>Score Source: Real Session Answer Evidence</span>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#151518] p-5 rounded-2xl border border-[#27272A] flex flex-col justify-between shadow-sm">
          <span className="text-xs font-semibold text-[#71717A] uppercase tracking-wider">
            Overall Readiness Score
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#F4F4F5]">{feedback.overallScore}%</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tier.bg} ${tier.color}`}>
              {tier.label}
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#09090B] rounded-full overflow-hidden mt-3 border border-[#27272A]">
            <div className="h-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]" style={{ width: `${feedback.overallScore}%` }} />
          </div>
        </div>

        <div className="bg-[#151518] p-5 rounded-2xl border border-[#27272A] flex flex-col justify-between shadow-sm">
          <span className="text-xs font-semibold text-[#71717A] uppercase tracking-wider">
            Technical Accuracy
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#86EFAC]">{feedback.technicalAccuracy}%</span>
            <span className="text-xs text-[#71717A]">Vector & AI Math</span>
          </div>
          <div className="w-full h-1.5 bg-[#09090B] rounded-full overflow-hidden mt-3 border border-[#27272A]">
            <div className="h-full bg-[#22C55E]" style={{ width: `${feedback.technicalAccuracy}%` }} />
          </div>
        </div>

        <div className="bg-[#151518] p-5 rounded-2xl border border-[#27272A] flex flex-col justify-between shadow-sm">
          <span className="text-xs font-semibold text-[#71717A] uppercase tracking-wider">
            System Design Depth
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#C4B5FD]">{feedback.systemDesignDepth}%</span>
            <span className="text-xs text-[#71717A]">Architecture Trade-offs</span>
          </div>
          <div className="w-full h-1.5 bg-[#09090B] rounded-full overflow-hidden mt-3 border border-[#27272A]">
            <div className="h-full bg-[#8B5CF6]" style={{ width: `${feedback.systemDesignDepth}%` }} />
          </div>
        </div>

        <div className="bg-[#151518] p-5 rounded-2xl border border-[#27272A] flex flex-col justify-between shadow-sm">
          <span className="text-xs font-semibold text-[#71717A] uppercase tracking-wider">
            Communication Clarity
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#F4F4F5]">{feedback.communicationClarity}%</span>
            <span className="text-xs text-[#71717A]">Structure & Precision</span>
          </div>
          <div className="w-full h-1.5 bg-[#09090B] rounded-full overflow-hidden mt-3 border border-[#27272A]">
            <div className="h-full bg-[#6366F1]" style={{ width: `${feedback.communicationClarity}%` }} />
          </div>
        </div>
      </div>

      {/* Strengths & Growth Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#151518] p-6 rounded-2xl border border-[#27272A] space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#86EFAC]">
            <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
            <h3>Key Technical Strengths Demonstrated</h3>
          </div>
          <ul className="space-y-2.5">
            {feedback.strengths.map((str, idx) => (
              <li key={idx} className="text-xs sm:text-sm text-[#D4D4D8] bg-[#1A1A1F] p-3.5 rounded-xl border border-[#27272A] leading-relaxed flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] mt-2 shrink-0" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-[#151518] p-6 rounded-2xl border border-[#27272A] space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#FDE68A]">
            <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
            <h3>Recommended Growth Areas</h3>
          </div>
          <ul className="space-y-2.5">
            {feedback.growthAreas.map((area, idx) => (
              <li key={idx} className="text-xs sm:text-sm text-[#D4D4D8] bg-[#1A1A1F] p-3.5 rounded-xl border border-[#27272A] leading-relaxed flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] mt-2 shrink-0" />
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Actionable Study Plan / Next Steps */}
      {feedback.recommendedStudyPlan && feedback.recommendedStudyPlan.length > 0 && (
        <div className="bg-[#151518] p-6 rounded-2xl border border-[#27272A] space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#8B5CF6]" />
            <h3 className="text-base font-semibold text-[#F4F4F5]">Actionable Curriculum Study Plan</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {feedback.recommendedStudyPlan.map((plan, idx) => (
              <div key={idx} className="bg-[#1A1A1F] p-4 rounded-xl border border-[#27272A] space-y-2">
                <div className="text-xs font-bold text-[#8B5CF6] uppercase tracking-wider">
                  Day {plan.day} Focus
                </div>
                <div className="text-xs font-semibold text-[#F4F4F5]">{plan.topic}</div>
                <div className="text-[11px] text-[#A1A1AA] leading-relaxed">{plan.action}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transcript Highlights */}
      <div className="bg-[#151518] p-6 rounded-2xl border border-[#27272A] space-y-4">
        <h3 className="text-base font-semibold text-[#F4F4F5]">Session Transcript Highlights</h3>
        <div className="space-y-3">
          {feedback.transcriptHighlights.map((hl, idx) => (
            <div key={idx} className="bg-[#1A1A1F] p-4 rounded-xl border border-[#27272A] space-y-2">
              <div className="text-xs font-semibold text-[#8B5CF6]">Question: {hl.question}</div>
              <div className="text-xs text-[#D4D4D8] italic bg-[#111113] p-3 rounded-lg border border-[#27272A]">
                "{hl.candidateAnswer}"
              </div>
              <div className="text-[11px] text-[#22C55E] flex items-center gap-1.5 font-medium pt-1">
                <Sparkles className="w-3.5 h-3.5 text-[#22C55E] shrink-0" />
                <span>Evaluator Note: {hl.evalNote}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
