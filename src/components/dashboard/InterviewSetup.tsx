import React from 'react';
import { Clock, HelpCircle, Layers, Sliders, Shield, ArrowRight, Play } from 'lucide-react';
import { Button } from '../common/Button';
import { InterviewSpec } from '../../types';

interface InterviewSetupProps {
  spec: InterviewSpec;
  onStartInterview: () => void;
}

export const InterviewSetup: React.FC<InterviewSetupProps> = ({ spec, onStartInterview }) => {
  const cards = [
    {
      label: 'Interview Type',
      value: spec.title,
      subtext: spec.targetRole,
      icon: Shield,
      accent: 'text-[#8B5CF6]',
    },
    {
      label: 'Duration',
      value: spec.durationMinutes,
      subtext: 'Paced for deep discussion',
      icon: Clock,
      accent: 'text-[#6366F1]',
    },
    {
      label: 'Questions',
      value: `${spec.questionCount - 2}–${spec.questionCount + 2} adaptive questions`,
      subtext: 'Dynamic follow-ups',
      icon: HelpCircle,
      accent: 'text-[#38BDF8]',
    },
    {
      label: 'Coverage',
      value: `${spec.coveredAreasCount}+ curriculum areas`,
      subtext: 'RAG, Agents, MCP & Infra',
      icon: Layers,
      accent: 'text-[#22C55E]',
    },
    {
      label: 'Difficulty',
      value: spec.difficulty,
      subtext: 'Calibrates to your depth',
      icon: Sliders,
      accent: 'text-[#F59E0B]',
    },
  ];

  return (
    <div className="bg-[#151518] rounded-2xl border border-[#27272A] p-5 sm:p-6 shadow-xl card-hover-border">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#27272A] mb-5">
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-[#F4F4F5] tracking-tight">
            Your Interview
          </h2>
          <p className="text-xs text-[#A1A1AA] mt-0.5">
            Configured specifically for your cohort progress and probe requirements
          </p>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-[#8B5CF6] px-3 py-1 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20">
          ● Session Ready
        </span>
      </div>

      {/* Grid of Spec Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 mb-6">
        {cards.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-[#1A1A1F] p-4 rounded-xl border border-[#27272A] flex flex-col justify-between hover:border-[#3F3F46] transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold text-[#71717A] uppercase tracking-wider">
                  {item.label}
                </span>
                <div className="w-7 h-7 rounded-lg bg-[#111113] border border-[#27272A] flex items-center justify-center">
                  <Icon className={`w-3.5 h-3.5 ${item.accent}`} />
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#F4F4F5] leading-snug">
                  {item.value}
                </p>
                <p className="text-[11px] text-[#A1A1AA] mt-1 font-medium">
                  {item.subtext}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Primary CTA Area */}
      <div className="bg-gradient-to-r from-[#8B5CF6]/10 via-[#1A1A1F] to-[#6366F1]/10 p-4 sm:p-5 rounded-xl border border-[#8B5CF6]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-sm font-semibold text-[#F4F4F5]">
            <Play className="w-4 h-4 text-[#8B5CF6] fill-[#8B5CF6]" />
            <span>Ready to start Sarah's Technical Interview?</span>
          </div>
          <p className="text-xs text-[#A1A1AA] mt-1 max-w-xl">
            The interviewer adapts based on your answers. There are no trick questions — only real engineering scenarios.
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={onStartInterview}
          fullWidth={true}
          className="sm:w-auto shrink-0 shadow-lg shadow-purple-500/25 min-w-[200px]"
          icon={<ArrowRight className="w-5 h-5" />}
        >
          Start Technical Interview
        </Button>
      </div>
    </div>
  );
};
