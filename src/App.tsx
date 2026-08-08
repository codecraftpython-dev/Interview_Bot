/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AppShell } from './components/layout/AppShell';
import { LoginScreen } from './components/auth/LoginScreen';
import { SignUpScreen } from './components/auth/SignUpScreen';
import { LandingPage } from './components/landing/LandingPage';
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

type AuthView = 'landing' | 'login' | 'signup';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('interview_agent_auth') === 'true';
  });

  const [authView, setAuthView] = useState<AuthView>(() => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    if (path === '/login' || hash === '#login') return 'login';
    if (path === '/signup' || hash === '#signup') return 'signup';
    return 'landing';
  });

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

  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [activeCandidate, setActiveCandidate] = useState<Candidate>(sampleCandidate);
  const [interviewState, setInterviewState] = useState<InterviewState>(() => createNewInterviewSession(sampleCandidate, settings));

  // Keep window hash synced for browser URL simulation
  useEffect(() => {
    if (!isAuthenticated) {
      if (authView === 'login') {
        window.history.replaceState(null, '', '#login');
      } else if (authView === 'signup') {
        window.history.replaceState(null, '', '#signup');
      } else {
        window.history.replaceState(null, '', '#');
      }
    }
  }, [authView, isAuthenticated]);

  const handleUpdateSettings = (newSettings: InterviewSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem('interview_agent_settings', JSON.stringify(newSettings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  };

  const handleLoginSuccess = () => {
    localStorage.setItem('interview_agent_auth', 'true');
    setIsAuthenticated(true);
    setCurrentTab('dashboard');
    window.history.replaceState(null, '', '#dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('interview_agent_auth');
    setIsAuthenticated(false);
    setAuthView('landing');
    window.history.replaceState(null, '', '#');
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

  // Render Public Authentication Flow when unauthenticated
  if (!isAuthenticated) {
    if (authView === 'login') {
      return (
        <LoginScreen
          onLoginSuccess={handleLoginSuccess}
          onNavigateToSignUp={() => setAuthView('signup')}
          onNavigateToHome={() => setAuthView('landing')}
        />
      );
    }

    if (authView === 'signup') {
      return (
        <SignUpScreen
          onSignUpSuccess={handleLoginSuccess}
          onNavigateToLogin={() => setAuthView('login')}
          onNavigateToHome={() => setAuthView('landing')}
        />
      );
    }

    return (
      <LandingPage
        onNavigateToLogin={() => setAuthView('login')}
        onNavigateToSignUp={() => setAuthView('signup')}
      />
    );
  }

  // Render Protected Application Shell when authenticated
  return (
    <AppShell
      currentTab={currentTab}
      onTabChange={setCurrentTab}
      isInterviewActive={currentTab === 'interviews'}
      onLogout={handleLogout}
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
        />
      )}

      {currentTab === 'settings' && (
        <SettingsView
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
        />
      )}
    </AppShell>
  );
}
