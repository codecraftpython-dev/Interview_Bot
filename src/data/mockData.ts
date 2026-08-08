import { Candidate, CurriculumTopic, InterviewSpec, InterviewState, FeedbackSummary } from '../types';
import { ALL_CANDIDATES } from '../services/candidateRepository';

export const sampleCandidatesList: Candidate[] = ALL_CANDIDATES;
export const sampleCandidate: Candidate = ALL_CANDIDATES[0];

export const sampleCurriculum: CurriculumTopic[] = [
  { id: 't1', title: 'Dense vs Sparse Embeddings', category: 'RAG Systems', status: 'completed', masteryScore: 92 },
  { id: 't2', title: 'Hierarchical & Parent Document Retrieval', category: 'RAG Systems', status: 'completed', masteryScore: 88 },
  { id: 't3', title: 'Model Context Protocol (MCP) Servers', category: 'Agent Architecture', status: 'completed', masteryScore: 95 },
  { id: 't4', title: 'Multi-Agent Routing & Hand-offs', category: 'Agent Architecture', status: 'completed', masteryScore: 90 },
  { id: 't5', title: 'Structured Output & Schema Enforcement', category: 'Prompt Engineering', status: 'probe_needed', masteryScore: 72 },
  { id: 't6', title: 'LLM Observability & OpenTelemetry Tracing', category: 'Evaluation & Monitoring', status: 'probe_needed', masteryScore: 68 },
  { id: 't7', title: 'vLLM Tensor Parallelism & Docker Deploy', category: 'Deployment & Infra', status: 'probe_needed', masteryScore: 65 },
  { id: 't8', title: 'Fine-Tuning LLaMA-3 via LoRA', category: 'Deployment & Infra', status: 'skipped' },
];

export const sampleInterviewSpec: InterviewSpec = {
  id: 'spec-01',
  title: 'Technical Systems Interview',
  durationMinutes: '15–20 minutes',
  questionCount: 10,
  coveredAreasCount: 4,
  difficulty: 'Adaptive',
  targetRole: 'Senior Data Engineer / AI Systems Architect',
};

import { createNewInterviewSession } from '../services/interviewEngine';

export const initialInterviewState: InterviewState = createNewInterviewSession(sampleCandidate);

export const sampleFeedback: FeedbackSummary = {
  candidateId: 'cand-001',
  candidateName: 'Sarah Johnson',
  overallScore: 92,
  technicalAccuracy: 95,
  systemDesignDepth: 90,
  communicationClarity: 91,
  strengths: [
    'Articulates trade-offs between HNSW index parameters (m, ef_construct) clearly',
    'Understands real-world operational challenges of decoupled embedding generation pipelines',
    'Exhibits pragmatic engineering mind-set when balancing precision vs query throughput',
  ],
  growthAreas: [
    'Could elaborate more on OpenTelemetry tracing spans for LLM tool call chains',
    'Consider testing Reciprocal Rank Fusion (RRF) when combining dense and sparse search results',
  ],
  transcriptHighlights: [
    {
      question: 'How do you prevent top-k semantic duplicate clustering in RAG?',
      candidateAnswer: 'Recommended Maximal Marginal Relevance (MMR) with lambda parameter tuning (lambda=0.7) and Cohere ReRank model as a secondary stage.',
      evalNote: 'Optimal solution. Demonstrated deep understanding of diversity-based re-ranking.',
    },
    {
      question: 'How do you handle metadata filtering sequence in Qdrant?',
      candidateAnswer: 'Pre-filtering via payload index before HNSW graph traversal to avoid traversing ineligible nodes.',
      evalNote: 'Accurate and performance-conscious.',
    },
  ],
};
