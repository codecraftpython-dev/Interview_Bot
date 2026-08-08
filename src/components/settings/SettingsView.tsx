import React, { useState } from 'react';
import { Sliders, Shield, Cpu, BookOpen, Save, Check, Target, Compass, MessageSquare, Layers } from 'lucide-react';
import { Button } from '../common/Button';
import { InterviewSettings } from '../../types';

interface SettingsViewProps {
  settings: InterviewSettings;
  onUpdateSettings: (newSettings: InterviewSettings) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState<InterviewSettings>(settings);

  const handleSave = () => {
    onUpdateSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateField = <K extends keyof InterviewSettings>(field: K, value: InterviewSettings[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#27272A]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F4F4F5] tracking-tight">
            Interviewer Settings
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">
            Configure AI Interviewer persona, question depth, follow-up intensity, and adaptive rules
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleSave}
          icon={saved ? <Check className="w-4 h-4 text-[#22C55E]" /> : <Save className="w-4 h-4" />}
        >
          {saved ? 'Saved Preferences' : 'Save Changes'}
        </Button>
      </div>

      <div className="space-y-6">
        {/* Persona Options */}
        <div className="bg-[#151518] p-5 sm:p-6 rounded-2xl border border-[#27272A] space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#8B5CF6]" />
            <h2 className="text-sm font-semibold text-[#F4F4F5]">Interviewer AI Persona & Tone</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: 'Senior AI Systems Architect' as const,
                title: 'Senior AI Systems Architect',
                desc: 'Socratic, probes edge cases, checks vector math & systems scaling',
              },
              {
                id: 'Principal Staff Engineer' as const,
                title: 'Principal Staff Engineer',
                desc: 'Direct, focuses on production failure modes & latency SLAs',
              },
              {
                id: 'Cohort Mentor & Guide' as const,
                title: 'Engineering Mentor & Guide',
                desc: 'Supportive, provides scaffolding when candidates get stuck',
              },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => updateField('persona', p.id)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  formData.persona === p.id
                    ? 'bg-[#8B5CF6]/15 border-[#8B5CF6] text-[#8B5CF6] dark:text-white font-semibold shadow-sm'
                    : 'bg-[#1A1A1F] border-[#27272A] text-[#A1A1AA] hover:text-[#F4F4F5]'
                }`}
              >
                <div className="text-xs font-semibold mb-1">{p.title}</div>
                <div className="text-[11px] leading-relaxed opacity-80">{p.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Interview Controls & Mode */}
        <div className="bg-[#151518] p-5 sm:p-6 rounded-2xl border border-[#27272A] space-y-4">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-[#6366F1]" />
            <h2 className="text-sm font-semibold text-[#F4F4F5]">Interview Execution Mode</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: 'adaptive' as const,
                title: 'Adaptive Probing',
                desc: 'Adjusts question depth dynamically based on candidate performance',
              },
              {
                id: 'balanced' as const,
                title: 'Balanced Assessment',
                desc: 'Maintains even balance across breadth and depth',
              },
              {
                id: 'deep_technical' as const,
                title: 'Deep Technical Probing',
                desc: 'Pushes into architecture trade-offs, scalability, and failure scenarios',
              },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => updateField('interviewMode', m.id)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  formData.interviewMode === m.id
                    ? 'bg-[#6366F1]/15 border-[#6366F1] text-[#6366F1] dark:text-white font-semibold shadow-sm'
                    : 'bg-[#1A1A1F] border-[#27272A] text-[#A1A1AA] hover:text-[#F4F4F5]'
                }`}
              >
                <div className="text-xs font-semibold mb-1">{m.title}</div>
                <div className="text-[11px] leading-relaxed opacity-80">{m.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Adaptive Parameters */}
        <div className="bg-[#151518] p-5 sm:p-6 rounded-2xl border border-[#27272A] space-y-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#8B5CF6]" />
            <h2 className="text-sm font-semibold text-[#F4F4F5]">Adaptive Engine Parameters</h2>
          </div>

          <div className="space-y-4 text-xs">
            {/* Question Count */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-[#1A1A1F] rounded-xl border border-[#27272A]">
              <div>
                <p className="font-semibold text-[#F4F4F5]">Question Count Limit</p>
                <p className="text-[11px] text-[#A1A1AA] mt-0.5">
                  Minimum 8 questions required to ensure thorough curriculum coverage
                </p>
              </div>
              <select
                value={formData.questionCount}
                onChange={(e) => updateField('questionCount', Number(e.target.value))}
                className="bg-[#111113] border border-[#27272A] text-xs text-[#F4F4F5] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#8B5CF6]"
              >
                <option value={8}>8 Questions (Express)</option>
                <option value={10}>10 Questions (Standard)</option>
                <option value={12}>12 Questions (Deep Dive)</option>
              </select>
            </div>

            {/* Difficulty Calibration */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-[#1A1A1F] rounded-xl border border-[#27272A]">
              <div>
                <p className="font-semibold text-[#F4F4F5]">Difficulty Calibration</p>
                <p className="text-[11px] text-[#A1A1AA] mt-0.5">
                  Choose dynamic adaptation or fixed initial baseline
                </p>
              </div>
              <select
                value={formData.difficultyBehavior}
                onChange={(e) => updateField('difficultyBehavior', e.target.value as any)}
                className="bg-[#111113] border border-[#27272A] text-xs text-[#F4F4F5] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#8B5CF6]"
              >
                <option value="adaptive">Adaptive Dynamic Calibration</option>
                <option value="fixed_intermediate">Fixed Intermediate Baseline</option>
                <option value="fixed_advanced">Fixed Advanced Baseline</option>
                <option value="fixed_expert">Fixed Expert Baseline</option>
              </select>
            </div>

            {/* Follow-up Intensity */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-[#1A1A1F] rounded-xl border border-[#27272A]">
              <div>
                <p className="font-semibold text-[#F4F4F5]">Follow-up Probing Intensity</p>
                <p className="text-[11px] text-[#A1A1AA] mt-0.5">
                  Controls how deeply the interviewer probes on trade-offs before changing topics
                </p>
              </div>
              <select
                value={formData.followUpIntensity}
                onChange={(e) => updateField('followUpIntensity', e.target.value as any)}
                className="bg-[#111113] border border-[#27272A] text-xs text-[#F4F4F5] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#8B5CF6]"
              >
                <option value="low">Low (Rapid Breadth across topics)</option>
                <option value="balanced">Balanced (Contextual follow-ups)</option>
                <option value="high">High (Deep trade-offs & failure scenarios)</option>
              </select>
            </div>

            {/* Coverage Strategy */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-[#1A1A1F] rounded-xl border border-[#27272A]">
              <div>
                <p className="font-semibold text-[#F4F4F5]">Curriculum Coverage Strategy</p>
                <p className="text-[11px] text-[#A1A1AA] mt-0.5">
                  Prioritize weak/probe topics or distribute evenly (min 4 curriculum days enforced)
                </p>
              </div>
              <select
                value={formData.coverageStrategy}
                onChange={(e) => updateField('coverageStrategy', e.target.value as any)}
                className="bg-[#111113] border border-[#27272A] text-xs text-[#F4F4F5] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#8B5CF6]"
              >
                <option value="balanced">Balanced Coverage</option>
                <option value="weak_areas_first">Weak Areas First (Prioritize Probe/Skipped)</option>
                <option value="broadest_coverage">Broadest Possible Coverage</option>
              </select>
            </div>

            {/* Auto-probe Checkbox */}
            <div className="flex items-center justify-between p-3.5 bg-[#1A1A1F] rounded-xl border border-[#27272A]">
              <div>
                <p className="font-semibold text-[#F4F4F5]">Auto-probe Skipped Curriculum Topics</p>
                <p className="text-[11px] text-[#A1A1AA] mt-0.5">
                  Actively generate scenario questions for candidate's skipped curriculum missions
                </p>
              </div>
              <input
                type="checkbox"
                checked={formData.autoProbeSkipped}
                onChange={(e) => updateField('autoProbeSkipped', e.target.checked)}
                className="w-4 h-4 accent-[#8B5CF6] rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

