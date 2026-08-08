/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { AppShell } from './components/layout/AppShell';
import { Dashboard } from './components/dashboard/Dashboard';
import { InterviewScreen } from './components/interview/InterviewScreen';
import { CandidatesView } from './components/candidates/CandidatesView';
import { FeedbackView } from './components/feedback/FeedbackView';
import { SettingsView } from './components/settings/SettingsView';
import { 
  sampleCandidate, 
  sampleCandidatesList, 
  sampleInterviewSpec
} from './data/mockData';
import { createNewInterviewSession } from './services/interviewEngine';
import { generateFeedbackFromSession } from './services/feedbackGenerator';
import { 
  NavTab, 
  Candidate, 
  InterviewSettings, 
  DEFAULT_INTERVIEW_SETTINGS, 
  InterviewState, 
  CompletedSessionRecord 
} from './types';

export default function App() {
  const [settings, setSettings] = useState<InterviewSettings>(() => {
    try {
      const saved = localStorage.getItem('interview_agent_settings');
      return saved ? { ...DEFAULT_INTERVIEW_SETTINGS, ...JSON.parse(saved) } : DEFAULT_INTERVIEW_SETTINGS;
    } catch {
      return DEFAULT_INTERVIEW_SETTINGS;
    }
  });

  const [completedSessions, setCompletedSessions] = useState<CompletedSessionRecord[]>(() => {
    try {
      const saved = localStorage.getItem('interview_agent_completed_sessions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedSessionId, setSelectedSessionId] = useState<string | undefined>(() => {
    return completedSessions[0]?.sessionId;
  });

  const [currentTab, setCurrentTab] = useState<NavTab>(() => {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    if (['dashboard', 'interviews', 'candidates', 'feedback', 'settings'].includes(hash)) {
      return hash as NavTab;
    }
    return 'dashboard';
  });

  const [activeCandidate, setActiveCandidate] = useState<Candidate>(sampleCandidate);
  const [interviewState, setInterviewState] = useState<InterviewState>(() => createNewInterviewSession(sampleCandidate, settings));

  // Sync interview state whenever active candidate changes to prevent state leakage
  useEffect(() => {
    if (interviewState.candidateId !== activeCandidate.id) {
      setInterviewState(createNewInterviewSession(activeCandidate, settings));
    }
  }, [activeCandidate.id, settings]);

  // Keep window hash synced for tab routing
  useEffect(() => {
    window.history.replaceState(null, '', `#${currentTab}`);
  }, [currentTab]);

  const handleUpdateSettings = (newSettings: InterviewSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem('interview_agent_settings', JSON.stringify(newSettings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  };

  const handleStartInterview = () => {
    const freshSession = createNewInterviewSession(activeCandidate, settings);
    setInterviewState(freshSession);
    setCurrentTab('interviews');
  };

  const handleStartInterviewForCandidate = (cand: Candidate) => {
    setActiveCandidate(cand);
    const freshSession = createNewInterviewSession(cand, settings);
    setInterviewState(freshSession);
    setCurrentTab('interviews');
  };

  const handleExitInterview = () => {
    setCurrentTab('dashboard');
  };

  const handleInterviewCompleted = async (completedState: InterviewState) => {
    const fb = await generateFeedbackFromSession(completedState, activeCandidate, settings);
    const newRecord: CompletedSessionRecord = {
      sessionId: completedState.sessionId,
      candidateId: activeCandidate.id,
      candidateName: activeCandidate.name,
      candidateRole: activeCandidate.role,
      completedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      sessionState: completedState,
      feedback: fb,
      settings,
    };

    setCompletedSessions((prev) => {
      const updated = [newRecord, ...prev.filter((s) => s.sessionId !== completedState.sessionId)];
      try {
        localStorage.setItem('interview_agent_completed_sessions', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to persist completed sessions:', e);
      }
      return updated;
    });

    setSelectedSessionId(completedState.sessionId);
    setActiveCandidate((prev) => ({
      ...prev,
      status: 'Interview Completed',
      readinessScore: fb.overallScore,
    }));

    setCurrentTab('feedback');
  };

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleDeleteSession = async (sessionIdToDelete: string): Promise<boolean> => {
    try {
      // 1. Send DELETE request to backend endpoint if running
      try {
        await fetch(`/api/interview/${encodeURIComponent(sessionIdToDelete)}`, {
          method: 'DELETE',
        });
      } catch (err) {
        console.warn('Backend DELETE API call failed, proceeding with local state cleanup:', err);
      }

      // 2. Filter out deleted session from local state & localStorage
      let remainingSessions: CompletedSessionRecord[] = [];
      setCompletedSessions((prev) => {
        remainingSessions = prev.filter((s) => s.sessionId !== sessionIdToDelete);
        try {
          localStorage.setItem('interview_agent_completed_sessions', JSON.stringify(remainingSessions));
        } catch (e) {
          console.error('Failed to update localStorage after deletion:', e);
        }
        return remainingSessions;
      });

      // 3. Update selectedSessionId
      setSelectedSessionId((prevSelected) => {
        if (prevSelected === sessionIdToDelete) {
          return remainingSessions.length > 0 ? remainingSessions[0].sessionId : undefined;
        }
        return prevSelected;
      });

      // 4. Show success toast notification
      setToastMessage('Interview session deleted successfully.');

      // 5. Navigate to candidates view
      setCurrentTab('candidates');

      return true;
    } catch (err) {
      console.error('Error deleting interview session:', err);
      return false;
    }
  };

  const handleViewProgress = (sessionId?: string) => {
    if (sessionId) {
      setSelectedSessionId(sessionId);
    } else if (completedSessions.length > 0) {
      setSelectedSessionId(completedSessions[0].sessionId);
    }
    setCurrentTab('feedback');
  };

  const activeFeedbackRecord =
    completedSessions.find((s) => s.sessionId === selectedSessionId) ||
    completedSessions[0] ||
    null;

  return (
    <>
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#151518] border border-[#22C55E]/40 text-[#F4F4F5] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top duration-200">
          <div className="w-8 h-8 rounded-lg bg-[#22C55E]/15 border border-[#22C55E]/30 flex items-center justify-center text-[#22C55E]">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-xs font-semibold">{toastMessage}</div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-[#71717A] hover:text-[#F4F4F5] ml-2 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <AppShell
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        isInterviewActive={currentTab === 'interviews'}
      >
        {currentTab === 'dashboard' && (
          <Dashboard
            candidate={activeCandidate}
            interviewSpec={sampleInterviewSpec}
            completedSessions={completedSessions}
            onStartInterview={handleStartInterview}
            onViewProgress={handleViewProgress}
          />
        )}

        {currentTab === 'interviews' && (
          <InterviewScreen
            initialState={interviewState}
            candidate={activeCandidate}
            settings={settings}
            onExit={handleExitInterview}
            onRestartSession={handleStartInterview}
            onInterviewCompleted={handleInterviewCompleted}
          />
        )}

        {currentTab === 'candidates' && (
          <CandidatesView
            candidates={sampleCandidatesList}
            onSelectCandidate={setActiveCandidate}
            onStartInterviewForCandidate={handleStartInterviewForCandidate}
          />
        )}

        {currentTab === 'feedback' && (
          <FeedbackView
            feedback={activeFeedbackRecord ? activeFeedbackRecord.feedback : null}
            completedSessions={completedSessions}
            selectedSessionId={selectedSessionId || activeFeedbackRecord?.sessionId}
            onSelectSession={setSelectedSessionId}
            onReInterview={handleStartInterview}
            onDeleteSession={handleDeleteSession}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsView
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
          />
        )}
      </AppShell>
    </>
  );
}
