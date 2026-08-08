import React from 'react';
import { Sparkles, ArrowRight, Activity, TrendingUp, Cpu, Award, CheckCircle, Clock } from 'lucide-react';
import { CandidateCard } from './CandidateCard';
import { InterviewSetup } from './InterviewSetup';
import { Button } from '../common/Button';
import { Candidate, InterviewSpec, CompletedSessionRecord } from '../../types';

interface DashboardProps {
  candidate: Candidate;
  interviewSpec: InterviewSpec;
  completedSessions?: CompletedSessionRecord[];
  onStartInterview: () => void;
  onViewProgress: (sessionId?: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  candidate,
  interviewSpec,
  completedSessions = [],
  onStartInterview,
  onViewProgress,
}) => {
  const completedCount = completedSessions.length;
  const avgScore =
    completedCount > 0
      ? Math.round(completedSessions.reduce((acc, s) => acc + (s.feedback?.overallScore || 0), 0) / completedCount)
      : candidate.readinessScore;

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 text-left">
      {/* Hero Section */}
      <div className="relative rounded-2xl bg-gradient-to-b from-[#1A1A1F] to-[#151518] border border-[#27272A] p-6 sm:p-8 lg:p-10 overflow-hidden card-hover-border">
        {/* Subtle background ambient purple light */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#8B5CF6]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            {/* Small Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/25 text-[#C4B5FD] text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
              AI TECHNICAL INTERVIEW
            </div>

            {/* Large Responsive Heading */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[40px] font-bold text-[#F4F4F5] tracking-tight leading-[1.15]">
              Build confidence before the real interview.
            </h1>

            {/* Supporting Text */}
            <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed max-w-2xl">
              Practice against an adaptive AI interviewer that understands what you learned, where you struggled, and how deeply you understand the systems you built.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={onStartInterview}
                fullWidth={true}
                className="sm:w-auto shadow-lg shadow-purple-500/25 min-w-[180px]"
                icon={<ArrowRight className="w-5 h-5" />}
              >
                Start Interview
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => onViewProgress()}
                fullWidth={true}
                className="sm:w-auto min-w-[150px]"
              >
                View Reports
              </Button>
            </div>
          </div>

          {/* Right Cohort Stat Snapshot Widget */}
          <div className="lg:col-span-4 bg-[#111113]/80 p-4 sm:p-5 rounded-xl border border-[#27272A] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#27272A]">
              <span className="text-xs font-semibold text-[#A1A1AA]">Session Metrics</span>
              <span className="text-[10px] text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded-full font-medium">
                Real Session Data
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#151518] rounded-lg border border-[#27272A]">
                <div className="flex items-center gap-1.5 text-[11px] text-[#71717A] mb-1">
                  <Activity className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  <span>Avg Score</span>
                </div>
                <p className="text-xl font-bold text-[#F4F4F5]">{avgScore}%</p>
              </div>

              <div className="p-3 bg-[#151518] rounded-lg border border-[#27272A]">
                <div className="flex items-center gap-1.5 text-[11px] text-[#71717A] mb-1">
                  <Cpu className="w-3.5 h-3.5 text-[#6366F1]" />
                  <span>Missions Tracked</span>
                </div>
                <p className="text-xl font-bold text-[#F4F4F5]">31 Topics</p>
              </div>

              <div className="p-3 bg-[#151518] rounded-lg border border-[#27272A]">
                <div className="flex items-center gap-1.5 text-[11px] text-[#71717A] mb-1">
                  <TrendingUp className="w-3.5 h-3.5 text-[#22C55E]" />
                  <span>Adaptive Depth</span>
                </div>
                <p className="text-xl font-bold text-[#F4F4F5]">Dynamic</p>
              </div>

              <div className="p-3 bg-[#151518] rounded-lg border border-[#27272A]">
                <div className="flex items-center gap-1.5 text-[11px] text-[#71717A] mb-1">
                  <Award className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>Completed</span>
                </div>
                <p className="text-xl font-bold text-[#F4F4F5]">
                  {completedCount} {completedCount === 1 ? 'Session' : 'Sessions'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Practice Interviews History Section */}
      {completedCount > 0 && (
        <div className="bg-[#151518] p-6 rounded-2xl border border-[#27272A] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#F4F4F5] flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#22C55E]" />
              Completed Interview History
            </h2>
            <span className="text-xs text-[#71717A]">{completedCount} record(s)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedSessions.map((rec) => (
              <div
                key={rec.sessionId}
                className="bg-[#1A1A1F] p-4 rounded-xl border border-[#27272A] flex items-center justify-between gap-4 hover:border-[#3F3F46] transition-colors"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#F4F4F5] truncate">{rec.candidateName}</span>
                    <span className="text-[10px] text-[#71717A] font-mono">#{rec.sessionId.substring(0, 12)}</span>
                  </div>
                  <div className="text-xs text-[#A1A1AA] flex items-center gap-2">
                    <Clock className="w-3 h-3 text-[#71717A]" />
                    <span>{rec.completedAt}</span>
                    <span>•</span>
                    <span>{rec.feedback.curriculumDaysCovered || 4} Days Covered</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-[#86EFAC]">{rec.feedback.overallScore}%</span>
                    <div className="text-[10px] text-[#71717A]">Overall Score</div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewProgress(rec.sessionId)}
                    className="text-xs"
                  >
                    Report
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Candidate Overview Section */}
      <CandidateCard candidate={candidate} onStartInterview={onStartInterview} />

      {/* Interview Setup Section */}
      <InterviewSetup spec={interviewSpec} onStartInterview={onStartInterview} />
    </div>
  );
};
