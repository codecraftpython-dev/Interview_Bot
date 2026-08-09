import React, { useState } from 'react';
import appLogo from '../../assets/images/regenerated_image_1786251258890.png';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Cpu, 
  Layers, 
  Bot, 
  Terminal, 
  BrainCircuit, 
  ShieldCheck, 
  Target, 
  ChevronDown, 
  Menu, 
  X, 
  Zap, 
  Code2, 
  Activity, 
  Award, 
  HelpCircle,
  BarChart3,
  BookOpen,
  Compass,
  FileCheck
} from 'lucide-react';

interface LandingPageProps {
  onNavigateToLogin: () => void;
  onNavigateToSignUp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateToLogin,
  onNavigateToSignUp,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeDemoStep, setActiveDemoStep] = useState<number>(0);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const faqList = [
    {
      q: 'Is this a fixed question bank?',
      a: 'No. InterviewForge uses an adaptive evaluation engine. Questions and follow-up probes dynamically adjust based on your candidate profile, previous answers, and technical trade-offs you mention.',
    },
    {
      q: 'How many questions are asked in a practice session?',
      a: 'Interviews support configurable question counts while strictly enforcing a minimum of 8 questions and 4 curriculum topic days to ensure comprehensive technical assessment.',
    },
    {
      q: 'Does it integrate with my learning curriculum progress?',
      a: 'Yes. The interviewer reads your completed missions, attempted exercises, skipped topics, and learning signals to tailor an interview strategy specific to your background.',
    },
    {
      q: 'Does the AI ask follow-up questions?',
      a: 'Yes! If you mention a specific architectural trade-off or concept (like Cross-Encoders, HNSW indexes, or MCP tools), the interviewer asks deep follow-up probes to test technical depth.',
    },
    {
      q: 'What happens after I complete an interview session?',
      a: 'You receive an instant, evidence-based technical evaluation report detailing overall readiness, technical accuracy, system design depth, strengths, growth areas, and an actionable curriculum study plan.',
    },
    {
      q: 'Do I need Google OAuth or social credentials to practice?',
      a: 'No. You can sign up with any work or personal email address and immediately access the evaluator session workspace.',
    },
  ];

  const demoSteps = [
    {
      label: 'Initial Question',
      question: 'How would you improve retrieval quality and reduce hallucinations in a production RAG system?',
      answer: 'I would use a hybrid search combining dense vector embeddings with sparse BM25 keyword search, followed by a Cross-Encoder reranker to filter the top-k chunks.',
      probe: 'Great approach. Rerankers improve precision, but Cross-Encoders add latency. How do you balance latency constraints when reranking top-k candidates in production?',
    },
    {
      label: 'Follow-Up Probe',
      question: 'How do you balance latency constraints when reranking top-k candidates in production?',
      answer: 'I cap reranking at top-20 candidates, run bi-encoder retrieval first, and cache frequent queries. For streaming latency, we overlap reranking with LLM preamble token generation.',
      probe: 'Solid architectural reasoning. Now, how would you evaluate context relevance and retrieval precision continuously in production without human labels?',
    },
    {
      label: 'Deeper Evaluation',
      question: 'How would you evaluate context relevance and retrieval precision continuously in production without human labels?',
      answer: 'We deploy automated LLM-as-a-judge frameworks like Ragas or TruLens measuring context recall, context precision, and faithfulness on sampled production queries.',
      probe: 'Excellent. You demonstrated strong system design depth and RAG production evaluation knowledge.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#09090B] text-[#F4F4F5] antialiased selection:bg-[#8B5CF6]/30 selection:text-purple-200 overflow-x-hidden">
      {/* Sticky Top Header */}
      <header className="sticky top-0 z-50 bg-[#09090B]/85 backdrop-blur-md border-b border-[#27272A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 group text-left focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <img 
                src={appLogo} 
                alt="IntervViewForge logo" 
                className="w-full h-full object-cover scale-[1.30]" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="text-base font-bold text-[#F4F4F5] tracking-tight group-hover:text-white transition-colors block">
                IntervViewForge
              </span>
              <span className="text-[10px] text-[#A1A1AA] font-mono hidden sm:block">
                Enterprise AI Engineering
              </span>
            </div>
          </button>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-[#A1A1AA]">
            <button 
              onClick={() => scrollToSection('how-it-works')} 
              className="hover:text-[#F4F4F5] transition-colors focus:outline-none"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('features')} 
              className="hover:text-[#F4F4F5] transition-colors focus:outline-none"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('for-candidates')} 
              className="hover:text-[#F4F4F5] transition-colors focus:outline-none"
            >
              For Candidates
            </button>
            <button 
              onClick={() => scrollToSection('why-interview-forge')} 
              className="hover:text-[#F4F4F5] transition-colors focus:outline-none"
            >
              Why InterviewForge
            </button>
            <button 
              onClick={() => scrollToSection('faq')} 
              className="hover:text-[#F4F4F5] transition-colors focus:outline-none"
            >
              FAQ
            </button>
          </nav>

          {/* Right Action Buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onNavigateToLogin}
              className="text-xs font-semibold text-[#D4D4D8] hover:text-white px-3.5 py-2 rounded-xl hover:bg-[#18181B] transition-all"
            >
              Log in
            </button>
            <button
              onClick={onNavigateToSignUp}
              className="text-xs font-semibold text-white bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] px-4 py-2 rounded-xl shadow-lg shadow-purple-500/20 transition-all flex items-center gap-1.5"
            >
              <span>Sign up</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-[#18181B] border border-[#27272A] text-[#A1A1AA] hover:text-white focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#111113] border-b border-[#27272A] px-4 py-5 space-y-4 animate-fadeIn">
            <nav className="flex flex-col gap-3 text-sm text-[#A1A1AA]">
              <button 
                onClick={() => scrollToSection('how-it-works')} 
                className="text-left py-1.5 hover:text-white transition-colors"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('features')} 
                className="text-left py-1.5 hover:text-white transition-colors"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('for-candidates')} 
                className="text-left py-1.5 hover:text-white transition-colors"
              >
                For Candidates
              </button>
              <button 
                onClick={() => scrollToSection('why-interview-forge')} 
                className="text-left py-1.5 hover:text-white transition-colors"
              >
                Why InterviewForge
              </button>
              <button 
                onClick={() => scrollToSection('faq')} 
                className="text-left py-1.5 hover:text-white transition-colors"
              >
                FAQ
              </button>
            </nav>
            <div className="pt-3 border-t border-[#27272A] flex flex-col gap-2.5">
              <button
                onClick={() => { setMobileMenuOpen(false); onNavigateToLogin(); }}
                className="w-full text-center text-sm font-medium text-[#F4F4F5] bg-[#18181B] border border-[#27272A] py-2.5 rounded-xl"
              >
                Log in
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); onNavigateToSignUp(); }}
                className="w-full text-center text-sm font-semibold text-white bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] py-2.5 rounded-xl shadow-lg shadow-purple-500/20"
              >
                Sign up
              </button>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-purple-600/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="relative z-10 space-y-6 max-w-4xl mx-auto">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-[#C4B5FD] text-xs font-semibold tracking-wider uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span>AI Technical Interviewing Platform</span>
          </div>

          {/* Main Headline & Tagline */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#F4F4F5] tracking-tight leading-none">
              InterviewForge
            </h1>
            <p className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-[#C4B5FD] via-[#A78BFA] to-[#8B5CF6] bg-clip-text text-transparent tracking-tight">
              Where every interview is forged around you.
            </p>
          </div>

          {/* Subtitle / Description */}
          <p className="text-base sm:text-lg text-[#A1A1AA] leading-relaxed max-w-2xl mx-auto">
            An adaptive AI technical interviewer that understands your learning journey, challenges your technical thinking, and gives you actionable feedback.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onNavigateToSignUp}
              className="w-full sm:w-auto min-w-[200px] text-sm font-semibold text-white bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] px-6 py-3.5 rounded-xl shadow-xl shadow-purple-500/25 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Start Your Interview</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="w-full sm:w-auto min-w-[170px] text-sm font-medium text-[#D4D4D8] hover:text-white bg-[#151518] hover:bg-[#1A1A1F] border border-[#27272A] px-5 py-3.5 rounded-xl transition-all"
            >
              See How It Works
            </button>
          </div>
        </div>

        {/* Product Visual Interface Preview */}
        <div className="mt-12 md:mt-16 relative max-w-5xl mx-auto">
          <div className="rounded-2xl bg-[#111113] border border-[#27272A] shadow-2xl p-4 sm:p-6 text-left space-y-4 backdrop-blur-xl relative z-10">
            {/* Mock Window Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#EF4444]/80" />
                <span className="w-3 h-3 rounded-full bg-[#F59E0B]/80" />
                <span className="w-3 h-3 rounded-full bg-[#22C55E]/80" />
                <span className="text-xs text-[#71717A] font-mono ml-2 hidden sm:inline">interviewforge-engine // session-live</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-[#8B5CF6] bg-[#8B5CF6]/15 px-2.5 py-0.5 rounded-full border border-[#8B5CF6]/30">
                  Question 4 of 10
                </span>
                <span className="text-[11px] text-[#A1A1AA] bg-[#18181B] px-2.5 py-0.5 rounded-full border border-[#27272A] hidden sm:inline">
                  Coverage: 3 Curriculum Days
                </span>
              </div>
            </div>

            {/* Simulated Question Card */}
            <div className="bg-[#18181B] p-4 sm:p-5 rounded-xl border border-[#27272A] space-y-3">
              <div className="flex items-center gap-2">
                <BadgeIcon icon={<BrainCircuit className="w-3.5 h-3.5 text-[#8B5CF6]" />} text="Retrieval-Augmented Generation (RAG)" />
                <span className="text-[10px] text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded font-mono">
                  Difficulty: Advanced
                </span>
              </div>
              <p className="text-sm sm:text-base font-semibold text-[#F4F4F5] leading-snug">
                "How would you improve retrieval quality and reduce hallucinations in a production RAG system?"
              </p>
            </div>

            {/* Simulated Candidate Answer Snippet */}
            <div className="bg-[#151518] p-4 rounded-xl border border-[#27272A] space-y-1.5">
              <div className="text-[11px] font-semibold text-[#A1A1AA] flex items-center justify-between">
                <span>Candidate Response</span>
                <span className="text-[#8B5CF6]">Live Evaluation Active</span>
              </div>
              <p className="text-xs sm:text-sm text-[#D4D4D8] font-mono leading-relaxed">
                "I would implement a hybrid search combining dense vector embeddings with sparse BM25 keyword search, followed by a Cross-Encoder reranker to filter the top-k chunks before LLM generation..."
              </p>
            </div>

            {/* Simulated AI Probing Feedback */}
            <div className="bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 p-4 rounded-xl flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#8B5CF6] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="space-y-1 text-xs sm:text-sm">
                <span className="font-bold text-[#C4B5FD] block">
                  AI Interviewer Follow-Up Probe:
                </span>
                <p className="text-[#E4E4E7] leading-relaxed">
                  "Great point on reranking with Cross-Encoders. However, Cross-Encoders add latency. How do you balance latency constraints when reranking top-k candidates under a 200ms budget?"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST / VALUE STRIP */}
      <section className="border-y border-[#27272A] bg-[#111113]/60 py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-[#D4D4D8]">
            <Zap className="w-4 h-4 text-[#8B5CF6]" />
            <span>31-Day Curriculum Aware</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-[#D4D4D8]">
            <Bot className="w-4 h-4 text-[#6366F1]" />
            <span>Adaptive Follow-Up Probes</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-[#D4D4D8]">
            <Target className="w-4 h-4 text-[#22C55E]" />
            <span>Personalized Candidate Profiles</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-[#D4D4D8]">
            <FileCheck className="w-4 h-4 text-[#F59E0B]" />
            <span>Actionable Technical Reports</span>
          </div>
        </div>
      </section>

      {/* WHAT IS INTERVIEWFORGE? */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left space-y-12">
        <div className="max-w-3xl space-y-4">
          <h2 className="text-xs font-bold text-[#8B5CF6] uppercase tracking-wider">
            Reinventing Technical Preparation
          </h2>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-[#F4F4F5] tracking-tight">
            Technical interviews should test understanding, not memorization.
          </h3>
          <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed">
            Traditional interview preparation presents candidates with fixed lists of questions and static answer keys. InterviewForge simulates a real senior technical interviewer by understanding your background and continuously probing your reasoning.
          </p>
        </div>

        {/* Comparison Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#151518] p-6 rounded-2xl border border-[#27272A] space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-[#EF4444]">
              <X className="w-5 h-5" />
              <span>Traditional Question Banks</span>
            </div>
            <div className="space-y-3 text-xs sm:text-sm text-[#A1A1AA]">
              <div className="bg-[#1A1A1F] p-3 rounded-xl border border-[#27272A]">Fixed list of static questions regardless of candidate background</div>
              <div className="bg-[#1A1A1F] p-3 rounded-xl border border-[#27272A]">No follow-up probes when you mention specific architecture trade-offs</div>
              <div className="bg-[#1A1A1F] p-3 rounded-xl border border-[#27272A]">Pass/fail feedback without actionable study plan references</div>
            </div>
          </div>

          <div className="bg-[#151518] p-6 rounded-2xl border border-[#8B5CF6]/40 shadow-lg shadow-purple-500/10 space-y-4 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-[#86EFAC]">
                <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
                <span>The InterviewForge Engine</span>
              </div>
              <span className="text-[10px] text-[#C4B5FD] bg-[#8B5CF6]/20 px-2 py-0.5 rounded font-mono">
                Adaptive AI
              </span>
            </div>
            <div className="space-y-3 text-xs sm:text-sm text-[#D4D4D8]">
              <div className="bg-[#1A1A1F] p-3 rounded-xl border border-[#27272A] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#8B5CF6] shrink-0" />
                <span>Dynamically adapts difficulty and topic focus based on your answers</span>
              </div>
              <div className="bg-[#1A1A1F] p-3 rounded-xl border border-[#27272A] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#8B5CF6] shrink-0" />
                <span>Probes system design trade-offs, vector search, RAG, and MCP concepts</span>
              </div>
              <div className="bg-[#1A1A1F] p-3 rounded-xl border border-[#27272A] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#8B5CF6] shrink-0" />
                <span>Generates structured evaluation reports with curriculum study recommendations</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left space-y-12 border-t border-[#27272A]">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-xs font-bold text-[#8B5CF6] uppercase tracking-wider">
            Four-Step Execution Lifecycle
          </h2>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-[#F4F4F5] tracking-tight">
            How InterviewForge Works
          </h3>
          <p className="text-sm sm:text-base text-[#A1A1AA]">
            From candidate journey analysis to evidence-based feedback reports.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StepCard
            stepNumber="01"
            title="Understand Your Journey"
            desc="Reads your completed missions, attempted exercises, skipped topics, and learning signals from the 31-day AI engineering curriculum."
            icon={<Compass className="w-5 h-5 text-[#8B5CF6]" />}
          />
          <StepCard
            stepNumber="02"
            title="Build Your Interview"
            desc="Constructs a tailored interview strategy balancing vector math, RAG systems, tool calling, and production deployment."
            icon={<Layers className="w-5 h-5 text-[#6366F1]" />}
          />
          <StepCard
            stepNumber="03"
            title="Adapt in Real Time"
            desc="Evaluates each answer live — escalating difficulty for strong reasoning or probing foundational gaps when answers lack depth."
            icon={<BrainCircuit className="w-5 h-5 text-[#22C55E]" />}
          />
          <StepCard
            stepNumber="04"
            title="Actionable Feedback"
            desc="Delivers a comprehensive report detailing technical accuracy, system design depth, strengths, growth areas, and next study steps."
            icon={<Award className="w-5 h-5 text-[#F59E0B]" />}
          />
        </div>
      </section>

      {/* ADAPTIVE INTERVIEW DEMONSTRATION */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left bg-[#111113] rounded-3xl border border-[#27272A] my-8 space-y-8">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-bold text-[#8B5CF6] uppercase tracking-wider">
            Live Adaptation Showcase
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold text-[#F4F4F5]">
            Every answer changes the next question.
          </h3>
          <p className="text-xs sm:text-sm text-[#A1A1AA]">
            Select a conversation step to see how the AI Interviewer pivots based on candidate explanations:
          </p>
        </div>

        {/* Step Selector Tabs */}
        <div className="flex flex-wrap gap-2">
          {demoSteps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => setActiveDemoStep(idx)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeDemoStep === idx
                  ? 'bg-[#8B5CF6] text-white shadow-md shadow-purple-500/20'
                  : 'bg-[#18181B] border border-[#27272A] text-[#A1A1AA] hover:text-white'
              }`}
            >
              Step {idx + 1}: {step.label}
            </button>
          ))}
        </div>

        {/* Active Demo Conversation Card */}
        <div className="bg-[#151518] p-5 sm:p-6 rounded-2xl border border-[#27272A] space-y-4">
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-[#8B5CF6] uppercase">Interviewer Prompt</span>
            <p className="text-sm sm:text-base font-semibold text-[#F4F4F5]">
              "{demoSteps[activeDemoStep].question}"
            </p>
          </div>

          <div className="bg-[#1A1A1F] p-4 rounded-xl border border-[#27272A] space-y-1">
            <span className="text-[10px] font-mono text-[#A1A1AA]">Candidate Explanation</span>
            <p className="text-xs sm:text-sm text-[#D4D4D8] italic">
              "{demoSteps[activeDemoStep].answer}"
            </p>
          </div>

          <div className="bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 p-4 rounded-xl space-y-1">
            <span className="text-[11px] font-bold text-[#C4B5FD] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
              AI Evaluator Real-Time Reaction
            </span>
            <p className="text-xs sm:text-sm text-[#F4F4F5]">
              {demoSteps[activeDemoStep].probe}
            </p>
          </div>
        </div>
      </section>

      {/* WHAT IT CAN ASSESS (FEATURES) */}
      <section id="features" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-xs font-bold text-[#8B5CF6] uppercase tracking-wider">
            Evaluation Competencies
          </h2>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-[#F4F4F5] tracking-tight">
            Six Core Technical Dimensions
          </h3>
          <p className="text-sm sm:text-base text-[#A1A1AA]">
            Comprehensive assessment tailored for AI Engineering & Systems roles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            title="Technical Knowledge"
            desc="Evaluates core vector math, embeddings, chunking algorithms, HNSW indexing, and transformer context limitations."
            icon={<Cpu className="w-5 h-5 text-[#8B5CF6]" />}
          />
          <FeatureCard
            title="Problem Solving"
            desc="Tests how candidates navigate unexpected retrieval edge cases, out-of-vocabulary terms, and sparse query fallback."
            icon={<BrainCircuit className="w-5 h-5 text-[#6366F1]" />}
          />
          <FeatureCard
            title="System Thinking"
            desc="Assesses multi-region RAG architecture, vector database sharding, caching tiers, and async tool execution pipelines."
            icon={<Layers className="w-5 h-5 text-[#22C55E]" />}
          />
          <FeatureCard
            title="Engineering Decisions"
            desc="Probes the explicit rationale behind framework selections, token budget trade-offs, and fine-tuning vs prompt grounding."
            icon={<Target className="w-5 h-5 text-[#F59E0B]" />}
          />
          <FeatureCard
            title="Communication Clarity"
            desc="Measures technical precision, answer structure, and clarity when explaining complex AI system concepts."
            icon={<Code2 className="w-5 h-5 text-[#EC4899]" />}
          />
          <FeatureCard
            title="Production Thinking"
            desc="Evaluates latency budgets, SLA limits, continuous evaluation (Ragas/TruLens), and deployment observability."
            icon={<ShieldCheck className="w-5 h-5 text-[#10B981]" />}
          />
        </div>
      </section>

      {/* WHO IS IT FOR / USE CASES */}
      <section id="for-candidates" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left space-y-12 border-t border-[#27272A]">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-xs font-bold text-[#8B5CF6] uppercase tracking-wider">
            Tailored For Growth
          </h2>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-[#F4F4F5] tracking-tight">
            Who Is InterviewForge For?
          </h3>
          <p className="text-sm sm:text-base text-[#A1A1AA]">
            Designed for engineers who want to practice articulating real technical choices.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <UseCaseCard
            title="AI Engineering Students"
            desc="Turn your 31-day AI engineering course progress into realistic technical interview practice before job applications."
          />
          <UseCaseCard
            title="AI/ML Engineers"
            desc="Practice explaining RAG trade-offs, vector search indexing, tool calling, and model evaluation under pressure."
          />
          <UseCaseCard
            title="Full-Stack Developers"
            desc="Strengthen system design reasoning when integrating LLMs, vector stores, and agentic workflows into apps."
          />
          <UseCaseCard
            title="Technical Candidates"
            desc="Uncover subtle knowledge gaps in your architecture reasoning before facing live senior engineering interviewers."
          />
        </div>
      </section>

      {/* WHY INTERVIEWFORGE SECTION */}
      <section id="why-interview-forge" className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left bg-[#111113] rounded-3xl border border-[#27272A] my-8 space-y-8">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-bold text-[#8B5CF6] uppercase tracking-wider">
            Core Principles
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold text-[#F4F4F5]">
            Four Reasons to Practice with InterviewForge
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <span className="text-2xl font-black text-[#8B5CF6]">01</span>
            <h4 className="text-sm font-bold text-[#F4F4F5]">Personalized</h4>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Interviews are constructed specifically around your curriculum journey and learning signals.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-2xl font-black text-[#6366F1]">02</span>
            <h4 className="text-sm font-bold text-[#F4F4F5]">Adaptive</h4>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Question depth dynamically adapts based on your previous answer quality and concepts mentioned.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-2xl font-black text-[#22C55E]">03</span>
            <h4 className="text-sm font-bold text-[#F4F4F5]">Technical</h4>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Focused on actual engineering trade-offs, vector math, RAG systems, and production SLAs.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-2xl font-black text-[#F59E0B]">04</span>
            <h4 className="text-sm font-bold text-[#F4F4F5]">Actionable</h4>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Receive structured reports detailing strengths, weaknesses, and concrete curriculum study steps.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-left space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-xs font-bold text-[#8B5CF6] uppercase tracking-wider">
            Got Questions?
          </h2>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-[#F4F4F5] tracking-tight">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="space-y-3">
          {faqList.map((faq, idx) => (
            <div
              key={idx}
              className="bg-[#151518] rounded-2xl border border-[#27272A] overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
              >
                <span className="text-sm sm:text-base font-semibold text-[#F4F4F5]">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#8B5CF6] transition-transform ${
                    openFaqIndex === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openFaqIndex === idx && (
                <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-[#A1A1AA] leading-relaxed border-t border-[#27272A]/50 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center relative overflow-hidden">
        <div className="bg-gradient-to-br from-[#1A1A1F] to-[#151518] p-8 sm:p-12 lg:p-16 rounded-3xl border border-[#27272A] relative z-10 space-y-6 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6]/20 text-[#8B5CF6] flex items-center justify-center mx-auto border border-[#8B5CF6]/30">
            <Sparkles className="w-6 h-6" />
          </div>

          <div className="space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F4F4F5] tracking-tight leading-tight">
              Stop rehearsing answers.<br />
              <span className="text-[#C4B5FD]">Start practicing the conversation.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#A1A1AA]">
              Build the confidence to explain what you built, why you built it, and how you would improve it.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onNavigateToSignUp}
              className="w-full sm:w-auto min-w-[200px] text-sm font-semibold text-white bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] px-6 py-3.5 rounded-xl shadow-xl shadow-purple-500/25 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Start Your Interview</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onNavigateToLogin}
              className="w-full sm:w-auto text-sm font-medium text-[#D4D4D8] hover:text-white px-5 py-3.5"
            >
              Already have an account? Log in
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#27272A] bg-[#09090B] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-[#27272A]/80">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0 shadow-sm shadow-purple-500/20">
                <img 
                  src={appLogo} 
                  alt="IntervViewForge logo" 
                  className="w-full h-full object-cover scale-[1.30]" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-base font-bold text-[#F4F4F5]">IntervViewForge</span>
            </div>
            <p className="text-xs text-[#A1A1AA] max-w-sm leading-relaxed">
              AI-powered technical interviewing platform for Enterprise AI Systems Engineering. Adaptive questioning, personalized candidate journeys, and evidence-based reports.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#F4F4F5] uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-1.5 text-xs text-[#A1A1AA]">
              <li><button onClick={() => scrollToSection('how-it-works')} className="hover:text-white transition-colors">How It Works</button></li>
              <li><button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">Features</button></li>
              <li><button onClick={() => scrollToSection('for-candidates')} className="hover:text-white transition-colors">For Candidates</button></li>
              <li><button onClick={() => scrollToSection('faq')} className="hover:text-white transition-colors">FAQ</button></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#F4F4F5] uppercase tracking-wider">Account Access</h4>
            <ul className="space-y-1.5 text-xs text-[#A1A1AA]">
              <li><button onClick={onNavigateToLogin} className="hover:text-white transition-colors">Sign In</button></li>
              <li><button onClick={onNavigateToSignUp} className="hover:text-white transition-colors">Create Candidate Account</button></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#71717A] gap-4">
          <p>© {new Date().getFullYear()} IntervViewForge. All rights reserved.</p>
          <p>Enterprise AI Systems Engineering</p>
        </div>
      </footer>
    </div>
  );
};

// Sub-components
const BadgeIcon: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#111113] border border-[#27272A] text-xs font-medium text-[#D4D4D8]">
    {icon}
    <span>{text}</span>
  </span>
);

const StepCard: React.FC<{ stepNumber: string; title: string; desc: string; icon: React.ReactNode }> = ({
  stepNumber,
  title,
  desc,
  icon,
}) => (
  <div className="bg-[#151518] p-6 rounded-2xl border border-[#27272A] space-y-3 relative group hover:border-[#3F3F46] transition-colors">
    <div className="flex items-center justify-between">
      <span className="text-2xl font-black text-[#8B5CF6] font-mono">{stepNumber}</span>
      <div className="w-9 h-9 rounded-xl bg-[#1A1A1F] border border-[#27272A] flex items-center justify-center">
        {icon}
      </div>
    </div>
    <h3 className="text-base font-bold text-[#F4F4F5]">{title}</h3>
    <p className="text-xs text-[#A1A1AA] leading-relaxed">{desc}</p>
  </div>
);

const FeatureCard: React.FC<{ title: string; desc: string; icon: React.ReactNode }> = ({
  title,
  desc,
  icon,
}) => (
  <div className="bg-[#151518] p-6 rounded-2xl border border-[#27272A] space-y-3 hover:border-[#3F3F46] transition-colors">
    <div className="w-10 h-10 rounded-xl bg-[#1A1A1F] border border-[#27272A] flex items-center justify-center">
      {icon}
    </div>
    <h3 className="text-base font-bold text-[#F4F4F5]">{title}</h3>
    <p className="text-xs text-[#A1A1AA] leading-relaxed">{desc}</p>
  </div>
);

const UseCaseCard: React.FC<{ title: string; desc: string }> = ({ title, desc }) => (
  <div className="bg-[#151518] p-5 rounded-2xl border border-[#27272A] space-y-2 hover:border-[#3F3F46] transition-colors">
    <h4 className="text-sm font-bold text-[#F4F4F5]">{title}</h4>
    <p className="text-xs text-[#A1A1AA] leading-relaxed">{desc}</p>
  </div>
);
