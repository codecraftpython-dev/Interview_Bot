import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  RotateCcw,
  ChevronRight,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  BookOpen,
  Award,
  Calendar,
  Layers,
  ArrowLeft,
  User,
  GraduationCap,
  Briefcase,
  AlertTriangle,
  Play
} from 'lucide-react';
import { Candidate, CandidateRecord, CandidateMission } from '../../types';
import {
  CANDIDATE_RECORDS,
  CURRICULUM_SPEC,
  getCurriculumDay,
  getCurriculumModuleForDay,
  getCandidateRecordById,
} from '../../services/candidateRepository';

interface CandidatesViewProps {
  candidates: Candidate[];
  onSelectCandidate: (candidate: Candidate) => void;
  onStartInterviewForCandidate?: (candidate: Candidate) => void;
}

type SortOption =
  | 'name_asc'
  | 'name_desc'
  | 'exp_desc'
  | 'exp_asc'
  | 'missions_desc'
  | 'missions_asc'
  | 'first_try_desc'
  | 'commits_desc';

export const CandidatesView: React.FC<CandidatesViewProps> = ({
  candidates,
  onSelectCandidate,
  onStartInterviewForCandidate,
}) => {
  // State for selected candidate ID for detailed profile view
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(() => {
    // Check window hash for deep linking (e.g. #candidates/CAND-001)
    const hash = window.location.hash;
    if (hash.startsWith('#candidates/')) {
      const id = hash.replace('#candidates/', '').toUpperCase();
      const match = CANDIDATE_RECORDS.find((r) => r.member.id === id);
      if (match) return match.member.id;
    }
    return null;
  });

  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [expFilter, setExpFilter] = useState<string>('all');
  const [progressFilter, setProgressFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('missions_desc');

  // Expanded missions state in profile view
  const [expandedMissionDays, setExpandedMissionDays] = useState<Set<number>>(new Set());

  // Listen to hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#candidates/')) {
        const id = hash.replace('#candidates/', '').toUpperCase();
        const match = CANDIDATE_RECORDS.find((r) => r.member.id === id);
        if (match) {
          setSelectedCandidateId(match.member.id);
          return;
        }
      }
      if (hash === '#candidates' || hash === '') {
        setSelectedCandidateId(null);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleOpenProfile = (candidateId: string) => {
    setSelectedCandidateId(candidateId);
    window.history.pushState(null, '', `#candidates/${candidateId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setSelectedCandidateId(null);
    window.history.pushState(null, '', '#candidates');
    setExpandedMissionDays(new Set());
  };

  const toggleMissionExpanded = (day: number) => {
    setExpandedMissionDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) {
        next.delete(day);
      } else {
        next.add(day);
      }
      return next;
    });
  };

  // Derive unique job roles from raw candidate dataset
  const uniqueRoles = useMemo(() => {
    const rolesSet = new Set<string>();
    CANDIDATE_RECORDS.forEach((c) => rolesSet.add(c.member.jobRole));
    return Array.from(rolesSet).sort();
  }, []);

  // Filter & Sort Candidate Records
  const filteredCandidateRecords = useMemo(() => {
    return CANDIDATE_RECORDS.filter((rec) => {
      const { member, signals } = rec;
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = member?.name ? member.name.toLowerCase().includes(q) : false;
        const matchId = member?.id ? member.id.toLowerCase().includes(q) : false;
        const matchRole = member?.jobRole ? member.jobRole.toLowerCase().includes(q) : false;
        const matchEdu = member?.education ? member.education.toLowerCase().includes(q) : false;
        if (!matchName && !matchId && !matchRole && !matchEdu) return false;
      }

      // Role filter
      if (roleFilter !== 'all' && member.jobRole !== roleFilter) {
        return false;
      }

      // Experience filter
      if (expFilter !== 'all') {
        if (expFilter === 'junior' && member.yearsExperience >= 3) return false;
        if (expFilter === 'mid' && (member.yearsExperience < 3 || member.yearsExperience > 7)) return false;
        if (expFilter === 'senior' && member.yearsExperience < 8) return false;
      }

      // Progress filter (based on AUTHORITATIVE signals.missionsCompleted / 31)
      if (progressFilter !== 'all') {
        const pct = (signals.missionsCompleted / 31) * 100;
        if (progressFilter === 'high' && pct < 90) return false; // 28+
        if (progressFilter === 'mid' && (pct < 74 || pct >= 90)) return false; // 23-27
        if (progressFilter === 'low' && pct >= 74) return false; // < 23
      }

      // Status filter
      if (statusFilter !== 'all' && member.status !== statusFilter) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'name_asc') return a.member.name.localeCompare(b.member.name);
      if (sortBy === 'name_desc') return b.member.name.localeCompare(a.member.name);
      if (sortBy === 'exp_desc') return b.member.yearsExperience - a.member.yearsExperience;
      if (sortBy === 'exp_asc') return a.member.yearsExperience - b.member.yearsExperience;
      if (sortBy === 'missions_desc') return b.signals.missionsCompleted - a.signals.missionsCompleted;
      if (sortBy === 'missions_asc') return a.signals.missionsCompleted - b.signals.missionsCompleted;
      if (sortBy === 'first_try_desc') return b.signals.missionsFirstTry - a.signals.missionsFirstTry;
      if (sortBy === 'commits_desc') return b.signals.commitDays - a.signals.commitDays;
      return 0;
    });
  }, [searchQuery, roleFilter, expFilter, progressFilter, statusFilter, sortBy]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    roleFilter !== 'all' ||
    expFilter !== 'all' ||
    progressFilter !== 'all' ||
    statusFilter !== 'all';

  const handleResetFilters = () => {
    setSearchQuery('');
    setRoleFilter('all');
    setExpFilter('all');
    setProgressFilter('all');
    setStatusFilter('all');
    setSortBy('missions_desc');
  };

  // Currently selected candidate record for detail view
  const selectedRecord = useMemo(() => {
    if (!selectedCandidateId) return null;
    return getCandidateRecordById(selectedCandidateId);
  }, [selectedCandidateId]);

  const selectedDomainCandidate = useMemo(() => {
    if (!selectedCandidateId) return null;
    return candidates.find((c) => c?.id && c.id.toLowerCase() === selectedCandidateId.toLowerCase()) || candidates[0];
  }, [selectedCandidateId, candidates]);

  // Helper function to get initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // =========================================================================
  // RENDER DETAILED CANDIDATE PROFILE VIEW
  // =========================================================================
  if (selectedRecord && selectedDomainCandidate) {
    const { member, missions, signals } = selectedRecord;
    const completionPct = ((signals.missionsCompleted / 31) * 100).toFixed(1);
    const firstTryRate = signals.missionsCompleted > 0
      ? ((signals.missionsFirstTry / signals.missionsCompleted) * 100).toFixed(1)
      : '0.0';

    const skippedMissions = missions.filter((m) => m.skipped);
    const failedMissions = missions.filter((m) => m.passed === false);
    const passedMissions = missions.filter((m) => m.passed === true);

    // Curriculum coverage per module
    const moduleActivityMap = CURRICULUM_SPEC.modules.map((mod) => {
      const activeCount = missions.filter(
        (m) => m.day >= mod.days[0] && m.day <= mod.days[1]
      ).length;
      return {
        module: mod,
        activityCount: activeCount,
      };
    });

    return (
      <div className="space-y-6 pb-12 animate-fadeIn max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        {/* Navigation & Header Controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBackToList}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#18181B] border border-[#27272A] text-xs font-semibold text-[#A1A1AA] hover:text-white hover:bg-[#27272A] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Candidates</span>
          </button>

          {onStartInterviewForCandidate && (
            <button
              onClick={() => onStartInterviewForCandidate(selectedDomainCandidate)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold shadow-lg shadow-[#8B5CF6]/20 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start Interview for {member.name.split(' ')[0]}</span>
            </button>
          )}
        </div>

        {/* Profile Banner */}
        <div className="bg-[#111113] border border-[#27272A] rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#8B5CF6]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] text-white flex items-center justify-center text-xl sm:text-2xl font-black tracking-wider shadow-inner shrink-0">
                {getInitials(member.name)}
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-3xl font-extrabold text-[#F4F4F5] tracking-tight">
                    {member.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#8B5CF6]/15 text-[#C4B5FD] border border-[#8B5CF6]/30">
                    {member.id}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#22C55E]/15 text-[#86EFAC] border border-[#22C55E]/30 uppercase tracking-wide">
                    {member.status}
                  </span>
                </div>
                <p className="text-sm font-semibold text-[#A1A1AA] flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#8B5CF6]" />
                  <span>{member.jobRole}</span>
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#71717A] pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#A1A1AA]" />
                    {member.yearsExperience} {member.yearsExperience === 1 ? 'year' : 'years'} experience
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-[#A1A1AA]" />
                    {member.education}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-[#18181B] p-4 rounded-xl border border-[#27272A] shrink-0">
              <div className="text-left sm:text-right pr-4 sm:border-r sm:border-[#27272A]">
                <div className="text-[10px] font-mono uppercase text-[#71717A] font-semibold">Authoritative Progress</div>
                <div className="text-2xl font-black text-[#F4F4F5]">
                  {signals.missionsCompleted} <span className="text-sm font-normal text-[#A1A1AA]">/ 31</span>
                </div>
                <div className="text-xs font-semibold text-[#22C55E]">{completionPct}% Completed</div>
              </div>
              <div className="pt-2 sm:pt-0">
                {onStartInterviewForCandidate && (
                  <button
                    onClick={() => onStartInterviewForCandidate(selectedDomainCandidate)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Launch Interview</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Top Metric Cards / Learning Signals */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#111113] border border-[#27272A] rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#A1A1AA]">
              <span className="font-semibold">Missions Completed</span>
              <Award className="w-4 h-4 text-[#8B5CF6]" />
            </div>
            <div className="text-2xl font-extrabold text-[#F4F4F5]">
              {signals.missionsCompleted} <span className="text-xs font-normal text-[#71717A]">of 31</span>
            </div>
            <div className="w-full bg-[#18181B] rounded-full h-1.5 overflow-hidden border border-[#27272A]">
              <div
                className="bg-[#8B5CF6] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (signals.missionsCompleted / 31) * 100)}%` }}
              />
            </div>
            <div className="text-[10px] text-[#71717A] font-mono flex justify-between">
              <span>Authoritative Signal</span>
              <span>{completionPct}%</span>
            </div>
          </div>

          <div className="bg-[#111113] border border-[#27272A] rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#A1A1AA]">
              <span className="font-semibold">Commit Days</span>
              <Calendar className="w-4 h-4 text-[#3B82F6]" />
            </div>
            <div className="text-2xl font-extrabold text-[#F4F4F5]">
              {signals.commitDays} <span className="text-xs font-normal text-[#71717A]">days</span>
            </div>
            <p className="text-[11px] text-[#A1A1AA] leading-tight">
              Active learning days logged in the 31-day curriculum cohort.
            </p>
          </div>

          <div className="bg-[#111113] border border-[#27272A] rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#A1A1AA]">
              <span className="font-semibold">First-Try Completions</span>
              <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
            </div>
            <div className="text-2xl font-extrabold text-[#F4F4F5]">
              {signals.missionsFirstTry} <span className="text-xs font-normal text-[#71717A]">missions</span>
            </div>
            <p className="text-[11px] text-[#A1A1AA] leading-tight">
              Missions passed on the very first attempt without re-submitting.
            </p>
          </div>

          <div className="bg-[#111113] border border-[#27272A] rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#A1A1AA]">
              <span className="font-semibold">First-Try Rate</span>
              <Sparkles className="w-4 h-4 text-[#F59E0B]" />
            </div>
            <div className="text-2xl font-extrabold text-[#F4F4F5]">
              {firstTryRate}%
            </div>
            <div className="text-[10px] text-[#71717A] font-mono">
              [Derived Metric: First Try / Completed]
            </div>
          </div>
        </div>

        {/* Main Grid Layout: Profile Details & Curriculum Coverage vs Mission Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Professional Profile & Curriculum Coverage */}
          <div className="space-y-6 lg:col-span-1">
            {/* Professional Profile */}
            <div className="bg-[#111113] border border-[#27272A] rounded-2xl p-5 space-y-4">
              <h2 className="text-sm font-bold text-[#F4F4F5] uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-[#8B5CF6]" />
                <span>Professional Profile</span>
              </h2>

              <div className="divide-y divide-[#27272A]/50 text-xs">
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#A1A1AA]">Full Name</span>
                  <span className="font-semibold text-[#F4F4F5]">{member.name}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#A1A1AA]">Candidate ID</span>
                  <span className="font-mono text-[#C4B5FD]">{member.id}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#A1A1AA]">Job Role</span>
                  <span className="font-semibold text-[#F4F4F5]">{member.jobRole}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#A1A1AA]">Years Experience</span>
                  <span className="font-semibold text-[#F4F4F5]">{member.yearsExperience} yrs</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#A1A1AA]">Education</span>
                  <span className="font-semibold text-[#F4F4F5] text-right max-w-[180px] truncate">{member.education}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#A1A1AA]">Cohort Status</span>
                  <span className="font-bold text-[#22C55E]">{member.status}</span>
                </div>
              </div>
            </div>

            {/* Curriculum Coverage (Mapped across 8 modules) */}
            <div className="bg-[#111113] border border-[#27272A] rounded-2xl p-5 space-y-4">
              <h2 className="text-sm font-bold text-[#F4F4F5] uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#3B82F6]" />
                <span>Curriculum Coverage</span>
              </h2>

              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                Distribution of candidate's recorded mission activities across the 8 cohort modules:
              </p>

              <div className="space-y-3 pt-1">
                {moduleActivityMap.map(({ module: mod, activityCount }) => (
                  <div key={mod.n} className="bg-[#18181B] p-3 rounded-xl border border-[#27272A]/80 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#F4F4F5] truncate max-w-[190px]">
                        {mod.n}. {mod.title}
                      </span>
                      <span className="text-[10px] font-mono text-[#A1A1AA]">
                        Days {mod.days[0]}–{mod.days[1]}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#71717A]">
                        {activityCount} recorded {activityCount === 1 ? 'activity' : 'activities'}
                      </span>
                      <span className={`font-semibold ${activityCount > 0 ? 'text-[#86EFAC]' : 'text-[#71717A]'}`}>
                        {activityCount > 0 ? 'Active' : 'No Activity Logged'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skipped Topics Section */}
            {skippedMissions.length > 0 && (
              <div className="bg-[#111113] border border-[#F59E0B]/30 rounded-2xl p-5 space-y-3">
                <h2 className="text-sm font-bold text-[#F59E0B] uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
                  <span>Skipped Topics ({skippedMissions.length})</span>
                </h2>
                <p className="text-xs text-[#A1A1AA]">
                  These topics were skipped in the candidate dataset. The AI interviewer may probe these during the session.
                </p>
                <div className="space-y-2 pt-1">
                  {skippedMissions.map((sm) => {
                    const daySpec = getCurriculumDay(sm.day);
                    return (
                      <div key={sm.day} className="bg-[#18181B] p-3 rounded-xl border border-[#F59E0B]/20 text-xs space-y-1">
                        <div className="flex items-center justify-between font-semibold text-[#F4F4F5]">
                          <span>Day {sm.day}: {sm.title}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#F59E0B]/15 text-[#FBBF24]">
                            SKIPPED
                          </span>
                        </div>
                        {daySpec && (
                          <div className="text-[11px] text-[#A1A1AA]">
                            Module: {daySpec.type} • Tools: {daySpec.tools.slice(0, 2).join(', ')}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Unpassed / Needs Attention Section */}
            {failedMissions.length > 0 && (
              <div className="bg-[#111113] border border-[#EF4444]/30 rounded-2xl p-5 space-y-3">
                <h2 className="text-sm font-bold text-[#EF4444] uppercase tracking-wider flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-[#EF4444]" />
                  <span>Needs Attention ({failedMissions.length})</span>
                </h2>
                <p className="text-xs text-[#A1A1AA]">
                  Missions marked unpassed in the candidate signal history.
                </p>
                <div className="space-y-2 pt-1">
                  {failedMissions.map((fm) => (
                    <div key={fm.day} className="bg-[#18181B] p-3 rounded-xl border border-[#EF4444]/20 text-xs space-y-1">
                      <div className="flex items-center justify-between font-semibold text-[#F4F4F5]">
                        <span>Day {fm.day}: {fm.title}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#EF4444]/15 text-[#FCA5A5]">
                          NOT PASSED
                        </span>
                      </div>
                      <div className="text-[11px] text-[#A1A1AA]">
                        Attempts recorded: {fm.attempts || 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Mission Activity Detail List */}
          <div className="space-y-6 lg:col-span-2">
            <div className="bg-[#111113] border border-[#27272A] rounded-2xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#27272A] pb-4">
                <div>
                  <h2 className="text-base font-bold text-[#F4F4F5] tracking-tight flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#8B5CF6]" />
                    <span>Mission Activity History</span>
                  </h2>
                  <p className="text-xs text-[#A1A1AA]">
                    {missions.length} recorded mission activities for candidate {member.name}. Click any mission to expand curriculum details.
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (expandedMissionDays.size === missions.length) {
                      setExpandedMissionDays(new Set());
                    } else {
                      setExpandedMissionDays(new Set(missions.map((m) => m.day)));
                    }
                  }}
                  className="text-xs font-semibold text-[#8B5CF6] hover:text-[#A78BFA] transition-colors self-start sm:self-auto"
                >
                  {expandedMissionDays.size === missions.length ? 'Collapse All' : 'Expand All'}
                </button>
              </div>

              {/* Mission Items List */}
              <div className="space-y-3">
                {missions.map((m) => {
                  const isExpanded = expandedMissionDays.has(m.day);
                  const daySpec = getCurriculumDay(m.day);
                  const moduleSpec = getCurriculumModuleForDay(m.day);

                  return (
                    <div
                      key={m.day}
                      className={`bg-[#18181B] border rounded-xl transition-all overflow-hidden ${
                        isExpanded ? 'border-[#8B5CF6]/50 bg-[#18181B]' : 'border-[#27272A] hover:border-[#3F3F46]'
                      }`}
                    >
                      {/* Collapsed Mission Header Bar */}
                      <button
                        onClick={() => toggleMissionExpanded(m.day)}
                        className="w-full text-left p-4 flex items-center justify-between gap-3 focus:outline-none"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-10 h-10 rounded-lg bg-[#27272A] text-[#C4B5FD] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                            Day {m.day}
                          </span>
                          <div className="min-w-0">
                            <h3 className="text-sm font-semibold text-[#F4F4F5] truncate">
                              {m.title}
                            </h3>
                            <p className="text-[11px] text-[#A1A1AA] truncate">
                              {moduleSpec ? moduleSpec.title : `Day ${m.day}`}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          {/* Status Badge */}
                          {m.skipped ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#F59E0B]/15 text-[#FBBF24] border border-[#F59E0B]/30">
                              SKIPPED
                            </span>
                          ) : m.passed ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#22C55E]/15 text-[#86EFAC] border border-[#22C55E]/30 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-[#22C55E]" />
                              <span>PASSED</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#EF4444]/15 text-[#FCA5A5] border border-[#EF4444]/30 flex items-center gap-1">
                              <XCircle className="w-3 h-3 text-[#EF4444]" />
                              <span>FAILED</span>
                            </span>
                          )}

                          {/* Attempts count */}
                          {!m.skipped && m.attempts !== undefined && (
                            <span className="text-xs text-[#A1A1AA] font-mono hidden sm:inline">
                              {m.attempts} {m.attempts === 1 ? 'attempt' : 'attempts'}
                            </span>
                          )}

                          <div className="text-[#A1A1AA]">
                            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          </div>
                        </div>
                      </button>

                      {/* Expanded Mission Content */}
                      {isExpanded && (
                        <div className="px-4 pb-4 pt-2 border-t border-[#27272A] bg-[#111113]/60 space-y-4 text-xs animate-fadeIn">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                            <div>
                              <span className="text-[10px] font-mono uppercase text-[#71717A] block">Curriculum Module</span>
                              <span className="font-semibold text-[#F4F4F5]">
                                {moduleSpec ? `${moduleSpec.n}. ${moduleSpec.title}` : 'General Cohort'}
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] font-mono uppercase text-[#71717A] block">Activity Type</span>
                              <span className="font-semibold text-[#C4B5FD]">
                                {daySpec?.type || 'BUILD'}
                              </span>
                            </div>
                          </div>

                          {/* Tools Associated */}
                          {daySpec?.tools && daySpec.tools.length > 0 && (
                            <div className="space-y-1.5">
                              <span className="text-[10px] font-mono uppercase text-[#71717A] block">Tools & Technologies</span>
                              <div className="flex flex-wrap gap-1.5">
                                {daySpec.tools.map((tool, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-0.5 rounded bg-[#27272A] text-[#F4F4F5] text-[11px] font-mono border border-[#3F3F46]"
                                  >
                                    {tool}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Learning Objectives */}
                          {daySpec?.objectives && daySpec.objectives.length > 0 && (
                            <div className="space-y-1.5">
                              <span className="text-[10px] font-mono uppercase text-[#71717A] block">Curriculum Learning Objectives</span>
                              <ul className="space-y-1 text-[#A1A1AA] pl-1">
                                {daySpec.objectives.map((obj, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <span className="text-[#8B5CF6] mt-0.5">•</span>
                                    <span>{obj}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Start Interview Banner */}
            {onStartInterviewForCandidate && (
              <div className="bg-gradient-to-r from-[#8B5CF6]/15 via-[#111113] to-[#111113] border border-[#8B5CF6]/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h3 className="text-base font-bold text-[#F4F4F5]">Ready to Evaluate {member.name}?</h3>
                  <p className="text-xs text-[#A1A1AA]">
                    Launch the adaptive AI technical interview with full context on candidate {member.id}'s 31-day curriculum journey.
                  </p>
                </div>
                <button
                  onClick={() => onStartInterviewForCandidate(selectedDomainCandidate)}
                  className="px-6 py-3 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-extrabold shadow-xl shadow-[#8B5CF6]/25 transition-all shrink-0 cursor-pointer flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start Interview Now</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER CANDIDATE LIST PAGE
  // =========================================================================
  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#27272A] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#F4F4F5] tracking-tight">
              Candidates
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#8B5CF6]/15 text-[#C4B5FD] border border-[#8B5CF6]/30">
              {filteredCandidateRecords.length} of {CANDIDATE_RECORDS.length} Candidates
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#A1A1AA]">
            Review candidate learning journeys, curriculum progress, and technical readiness before starting an interview.
          </p>
        </div>
      </div>

      {/* Search, Filter & Sort Controls Bar */}
      <div className="bg-[#111113] border border-[#27272A] rounded-2xl p-4 space-y-4 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Field */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, ID (e.g. CAND-001), role, education..."
              className="w-full bg-[#18181B] border border-[#27272A] focus:border-[#8B5CF6] text-xs text-[#F4F4F5] placeholder-[#71717A] rounded-xl pl-9 pr-3 py-2.5 outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#71717A] hover:text-white"
              >
                ×
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="md:col-span-7 flex flex-wrap sm:flex-nowrap items-center gap-2">
            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-[#18181B] border border-[#27272A] focus:border-[#8B5CF6] text-xs text-[#F4F4F5] rounded-xl px-3 py-2.5 outline-none flex-1 min-w-[130px]"
            >
              <option value="all">All Roles ({CANDIDATE_RECORDS.length})</option>
              {uniqueRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>

            {/* Experience Filter */}
            <select
              value={expFilter}
              onChange={(e) => setExpFilter(e.target.value)}
              className="bg-[#18181B] border border-[#27272A] focus:border-[#8B5CF6] text-xs text-[#F4F4F5] rounded-xl px-3 py-2.5 outline-none flex-1 min-w-[120px]"
            >
              <option value="all">All Experience</option>
              <option value="junior">&lt; 3 years</option>
              <option value="mid">3 – 7 years</option>
              <option value="senior">8+ years</option>
            </select>

            {/* Mission Progress Filter */}
            <select
              value={progressFilter}
              onChange={(e) => setProgressFilter(e.target.value)}
              className="bg-[#18181B] border border-[#27272A] focus:border-[#8B5CF6] text-xs text-[#F4F4F5] rounded-xl px-3 py-2.5 outline-none flex-1 min-w-[130px]"
            >
              <option value="all">All Progress</option>
              <option value="high">90%+ (28+ Missions)</option>
              <option value="mid">75% – 89% (23-27)</option>
              <option value="low">&lt; 75% (&lt; 23)</option>
            </select>

            {/* Sort By Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-[#18181B] border border-[#8B5CF6]/40 focus:border-[#8B5CF6] text-xs text-[#C4B5FD] font-semibold rounded-xl px-3 py-2.5 outline-none flex-1 min-w-[140px]"
            >
              <option value="missions_desc">Sort: Completed (High to Low)</option>
              <option value="missions_asc">Sort: Completed (Low to High)</option>
              <option value="first_try_desc">Sort: First Try (High to Low)</option>
              <option value="commits_desc">Sort: Commit Days (High to Low)</option>
              <option value="exp_desc">Sort: Experience (High to Low)</option>
              <option value="exp_asc">Sort: Experience (Low to High)</option>
              <option value="name_asc">Sort: Name (A to Z)</option>
              <option value="name_desc">Sort: Name (Z to A)</option>
            </select>
          </div>
        </div>

        {/* Active Filters Summary & Reset Button */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-[#27272A]/60 text-xs">
            <span className="text-[#A1A1AA]">
              Showing <span className="text-[#F4F4F5] font-bold">{filteredCandidateRecords.length}</span> candidates matching search/filter criteria.
            </span>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 text-xs text-[#8B5CF6] hover:text-[#A78BFA] font-semibold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Candidate Cards Grid (Responsive 1 col mobile, 2 cols tablet, 3 cols desktop) */}
      {filteredCandidateRecords.length === 0 ? (
        <div className="bg-[#111113] border border-[#27272A] rounded-2xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#18181B] border border-[#27272A] text-[#71717A] flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#F4F4F5]">No candidates found</h3>
            <p className="text-xs text-[#A1A1AA] max-w-sm mx-auto">
              No candidates match your current search and filter settings. Try adjusting your query or resetting filters.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-lg bg-[#8B5CF6] text-white text-xs font-bold hover:bg-[#7C3AED] transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCandidateRecords.map((rec) => {
            const { member, signals } = rec;
            const completionPct = ((signals.missionsCompleted / 31) * 100).toFixed(1);

            // Find matching Candidate domain object to pass to interview launcher
            const domainCand =
              candidates.find((c) => c?.id && member?.id && c.id.toLowerCase() === member.id.toLowerCase()) || candidates[0];

            return (
              <div
                key={member.id}
                className="bg-[#111113] border border-[#27272A] hover:border-[#8B5CF6]/50 rounded-2xl p-5 space-y-4 transition-all hover:shadow-xl hover:shadow-[#8B5CF6]/5 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Top Candidate Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] text-white flex items-center justify-center font-black text-sm tracking-wider shrink-0 shadow-inner">
                        {getInitials(member.name)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base font-bold text-[#F4F4F5] group-hover:text-[#C4B5FD] transition-colors truncate">
                          {member.name}
                        </h3>
                        <p className="text-xs text-[#A1A1AA] font-medium truncate">
                          {member.jobRole}
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-[#8B5CF6]/15 text-[#C4B5FD] border border-[#8B5CF6]/30 shrink-0">
                      {member.id}
                    </span>
                  </div>

                  {/* Candidate Bio Sub-text */}
                  <div className="text-xs text-[#71717A] flex items-center gap-2">
                    <span>{member.yearsExperience} {member.yearsExperience === 1 ? 'yr' : 'yrs'} exp</span>
                    <span>•</span>
                    <span className="truncate">{member.education}</span>
                  </div>

                  {/* Mission Progress Section (AUTHORITATIVE signals.missionsCompleted) */}
                  <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#A1A1AA] font-medium">Mission Progress</span>
                      <span className="text-[#F4F4F5] font-extrabold font-mono">
                        {signals.missionsCompleted} <span className="text-[#71717A] font-normal text-[11px]">/ 31</span>
                      </span>
                    </div>

                    <div className="w-full bg-[#27272A] rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#8B5CF6] to-[#22C55E] h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (signals.missionsCompleted / 31) * 100)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-[#71717A] font-mono">
                      <span>{completionPct}% Completed</span>
                      <span className="text-[#86EFAC] font-semibold">{member.status}</span>
                    </div>
                  </div>

                  {/* Learning Signals Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-[#18181B]/60 p-2.5 rounded-lg border border-[#27272A]/60 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#3B82F6] shrink-0" />
                      <div>
                        <span className="text-[10px] text-[#71717A] block leading-none">Commit Days</span>
                        <span className="font-bold text-[#F4F4F5]">{signals.commitDays} days</span>
                      </div>
                    </div>

                    <div className="bg-[#18181B]/60 p-2.5 rounded-lg border border-[#27272A]/60 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E] shrink-0" />
                      <div>
                        <span className="text-[10px] text-[#71717A] block leading-none">First Try</span>
                        <span className="font-bold text-[#F4F4F5]">{signals.missionsFirstTry} missions</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-[#27272A] grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleOpenProfile(member.id)}
                    className="w-full py-2 px-3 rounded-lg bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] text-xs font-semibold text-[#F4F4F5] transition-all text-center cursor-pointer"
                  >
                    View Profile
                  </button>

                  {onStartInterviewForCandidate && (
                    <button
                      onClick={() => onStartInterviewForCandidate(domainCand)}
                      className="w-full py-2 px-3 rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Interview</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
