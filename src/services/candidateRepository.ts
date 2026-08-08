import rawCandidatesData from '../data/candidates.json';
import rawCurriculumData from '../data/curriculum.json';
import {
  CandidateRecord,
  Candidate,
  CurriculumDataSpec,
  CurriculumDaySpec,
  CurriculumModuleSpec,
} from '../types';

export const CURRICULUM_SPEC = rawCurriculumData as unknown as CurriculumDataSpec;
export const CANDIDATE_RECORDS = (rawCandidatesData as unknown as { candidates: CandidateRecord[] }).candidates;

// Lookup map for fast curriculum day access
const curriculumDayMap = new Map<number, CurriculumDaySpec>();
CURRICULUM_SPEC.days.forEach((daySpec) => {
  curriculumDayMap.set(daySpec.day, daySpec);
});

export function getCurriculumDay(dayNumber: number): CurriculumDaySpec | undefined {
  return curriculumDayMap.get(dayNumber);
}

export function getCurriculumModuleForDay(dayNumber: number): CurriculumModuleSpec | undefined {
  return CURRICULUM_SPEC.modules.find(
    (m) => dayNumber >= m.days[0] && dayNumber <= m.days[1]
  );
}

// Convert CandidateRecord into Candidate domain model for interview engine & shell integration
export function transformRecordToCandidate(record: CandidateRecord): Candidate {
  const { member, missions, signals } = record;

  const passedMissions = missions.filter((m) => m.passed);
  const failedMissions = missions.filter((m) => m.passed === false);
  const skippedMissions = missions.filter((m) => m.skipped);

  const strongAreas = passedMissions.map((m) => m.title);
  const areasToProbe = failedMissions.map((m) => m.title);
  const skippedTopics = skippedMissions.map((m) => m.title);

  // CRITICAL RULE: Use signals.missionsCompleted as the authoritative completion count
  const completedMissions = signals.missionsCompleted;
  const totalMissions = 31;
  const readinessScore = Math.round((completedMissions / totalMissions) * 100);

  return {
    id: member.id,
    name: member.name,
    role: member.jobRole,
    experience: `${member.yearsExperience} ${member.yearsExperience === 1 ? 'year' : 'years'}`,
    cohortName: CURRICULUM_SPEC.cohort,
    completedMissions,
    totalMissions,
    readinessScore,
    strongAreas,
    areasToProbe,
    skippedTopics,
    lastActive: 'Active in Cohort',
    status: 'Ready for Interview',
    rawRecord: record,
  };
}

export const ALL_CANDIDATES: Candidate[] = CANDIDATE_RECORDS.map(transformRecordToCandidate);

export function getCandidateRecordById(id?: string): CandidateRecord | undefined {
  if (!id) return undefined;
  const targetId = id.toString().toLowerCase();
  return CANDIDATE_RECORDS.find(
    (r) => r.member?.id && r.member.id.toString().toLowerCase() === targetId
  );
}

export function getCandidateById(id?: string): Candidate | undefined {
  if (!id) return undefined;
  const targetId = id.toString().toLowerCase();
  return ALL_CANDIDATES.find(
    (c) => c?.id && c.id.toString().toLowerCase() === targetId
  );
}
