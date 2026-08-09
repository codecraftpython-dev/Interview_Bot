import React from 'react';
import { User, CheckCircle2, AlertCircle, Sparkles, BookOpen } from 'lucide-react';
import { Candidate } from '../../types';
import { Badge } from '../common/Badge';

interface CandidateCardProps {
  candidate: Candidate;
  onStartInterview?: () => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({ candidate }) => {
  const completed = candidate.completedMissions ?? 0;
  const total = candidate.totalMissions || 31;
  const progressPercent = Math.round((completed / total) * 1000) / 10;
  const remaining = Math.max(0, total - completed);

  return (
    <div className="bg-[#151518] rounded-2xl border border-[#27272A] p-5 sm:p-6 shadow-xl relative overflow-hidden card-hover-border">
      {/* Top subtle highlight line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#8B5CF6]/40 to-transparent" />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-[#27272A]">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8B5CF6]/30 to-[#6366F1]/20 border border-[#8B5CF6]/40 flex items-center justify-center text-[#C4B5FD] font-semibold text-lg shrink-0 shadow-inner">
            {candidate.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base sm:text-lg font-semibold text-[#F4F4F5] tracking-tight">
                {candidate.name}
              </h3>
              <Badge variant="purple" size="sm">
                Candidate Profile
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-[#A1A1AA] font-medium mt-0.5">
              {candidate.role} · <span className="text-[#D4D4D8]">{candidate.experience}</span>
            </p>
            <p className="text-[11px] text-[#71717A] mt-1 flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-[#8B5CF6]" />
              31-Day AI Engineering Curriculum
            </p>
          </div>
        </div>

        <div className="sm:text-right shrink-0 bg-[#1A1A1F] p-3 rounded-xl border border-[#27272A] sm:bg-transparent sm:p-0 sm:border-0">
          <span 
            className="text-[11px] uppercase tracking-wider text-[#71717A] font-semibold block"
            style={{ paddingRight: '6px', paddingLeft: '4px' }}
          >
            Readiness Index
          </span>
          <div className="flex items-baseline sm:justify-end gap-1.5 mt-0.5">
            <span 
              className="text-2xl font-bold text-[#F4F4F5]"
              style={{ fontSize: '22px', textAlign: 'left', paddingLeft: '5px', paddingBottom: '4px' }}
            >
              {candidate.readinessScore}%
            </span>
            <span 
              className="text-xs text-[#22C55E] font-medium"
              style={{ paddingBottom: '2px', paddingRight: '4px' }}
            >
              High Confidence
            </span>
          </div>
        </div>
      </div>

      {/* Cohort Progress Indicator */}
      <div className="py-4 border-b border-[#27272A]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs mb-2 gap-1">
          <span className="text-[#A1A1AA] font-medium">Mission Progress</span>
          <span className="text-[#F4F4F5] font-semibold">
            {completed} of {total} missions completed ({progressPercent}% · {remaining} remaining)
          </span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-[#09090B] border border-[#27272A] overflow-hidden p-0.5">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Grid: Strong Areas & Areas to Probe */}
      <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strong Areas */}
        <div className="bg-[#1A1A1F]/60 rounded-xl p-3.5 border border-[#27272A]">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#86EFAC] mb-2.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
            <span>Strong Areas</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {candidate.strongAreas.map((area, idx) => (
              <Badge key={idx} variant="purple" size="sm">
                {area}
              </Badge>
            ))}
          </div>
        </div>

        {/* Areas to Probe */}
        <div className="bg-[#1A1A1F]/60 rounded-xl p-3.5 border border-[#27272A]">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#FDE68A] mb-2.5">
            <AlertCircle className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Areas to Probe</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {candidate.areasToProbe.map((area, idx) => (
              <Badge key={idx} variant="warning" size="sm">
                {area}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Skipped topics note */}
      {candidate.skippedTopics && candidate.skippedTopics.length > 0 && (
        <div className="mt-3 text-[11px] text-[#71717A] flex items-center gap-1.5 pt-2 border-t border-[#27272A]/50">
          <Sparkles className="w-3 h-3 text-[#8B5CF6]" />
          <span>Skipped topics tagged for adaptive depth test: {candidate.skippedTopics.join(', ')}</span>
        </div>
      )}
    </div>
  );
};
