import React, { useState, useEffect } from 'react';
import { InterviewHeader } from './InterviewHeader';
import { ChatConversation } from './ChatConversation';
import { AnswerInput } from './AnswerInput';
import { ContextPanel } from './ContextPanel';
import { InterviewState, Candidate, InterviewSettings, DEFAULT_INTERVIEW_SETTINGS } from '../../types';
import { processCandidateAnswer } from '../../services/interviewEngine';

interface InterviewScreenProps {
  initialState: InterviewState;
  candidate: Candidate;
  settings?: InterviewSettings;
  onExit: () => void;
  onRestartSession?: () => void;
  onInterviewCompleted?: (completedSession: InterviewState) => void;
}

export const InterviewScreen: React.FC<InterviewScreenProps> = ({
  initialState,
  candidate,
  settings = DEFAULT_INTERVIEW_SETTINGS,
  onExit,
  onRestartSession,
  onInterviewCompleted,
}) => {
  const [interviewState, setInterviewState] = useState<InterviewState>(initialState);
  const [isThinking, setIsThinking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastFailedAnswer, setLastFailedAnswer] = useState<string | null>(null);
  const [showMobileContext, setShowMobileContext] = useState(false);

  // Keep local interview state in sync if parent passes a newly initialized session ID
  useEffect(() => {
    setInterviewState(initialState);
    setErrorMessage(null);
    setLastFailedAnswer(null);
  }, [initialState.sessionId]);

  // Timer interval
  useEffect(() => {
    if (!interviewState.isActive || interviewState.isPaused) return;

    const timer = setInterval(() => {
      setInterviewState((prev) => ({
        ...prev,
        elapsedSeconds: prev.elapsedSeconds + 1,
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [interviewState.isActive, interviewState.isPaused]);

  // Handle candidate sending an answer cleanly via interview engine
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isThinking || interviewState.isPaused) return;

    setIsThinking(true);
    setErrorMessage(null);

    try {
      // Execute conversation pipeline with explicit latest answer text
      const nextState = await processCandidateAnswer(
        interviewState,
        candidate,
        text.trim(),
        settings
      );

      setInterviewState(nextState);
      setLastFailedAnswer(null);

      // Check if session has just completed
      if (nextState.status === 'completed') {
        if (onInterviewCompleted) {
          onInterviewCompleted(nextState);
        }
      }
    } catch (err: any) {
      console.error('Error processing answer:', err);
      setLastFailedAnswer(text);
      setErrorMessage(err?.message || 'Failed to evaluate answer. Click Retry to try again.');
    } finally {
      setIsThinking(false);
    }
  };

  const handleRetry = () => {
    if (lastFailedAnswer) {
      handleSendMessage(lastFailedAnswer);
    }
  };

  const handleTogglePause = () => {
    setInterviewState((prev) => ({
      ...prev,
      isPaused: !prev.isPaused,
    }));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] md:h-screen bg-[#09090B] overflow-hidden">
      {/* Header Bar */}
      <InterviewHeader
        currentQuestion={interviewState.currentQuestionNumber}
        totalQuestions={interviewState.totalQuestions}
        focusTopic={interviewState.currentFocusTopic}
        elapsedSeconds={interviewState.elapsedSeconds}
        isPaused={interviewState.isPaused}
        onTogglePause={handleTogglePause}
        onExit={onExit}
        onToggleContextMobile={() => setShowMobileContext((prev) => !prev)}
        showContextMobileBtn={true}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex min-h-0 relative">
        {/* Chat Conversation & Answer Input Column */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#09090B]">
          {interviewState.isPaused && (
            <div className="bg-[#F59E0B]/10 border-b border-[#F59E0B]/30 px-4 py-2 text-center text-xs font-medium text-[#FDE68A]">
              Interview session is currently paused. Click 'Resume' in the header to continue.
            </div>
          )}

          {errorMessage && (
            <div className="bg-[#EF4444]/10 border-b border-[#EF4444]/30 px-4 py-2 flex items-center justify-between text-xs text-[#F87171]">
              <span>{errorMessage}</span>
              <button
                type="button"
                onClick={handleRetry}
                className="px-2.5 py-1 rounded bg-[#EF4444]/20 border border-[#EF4444]/40 hover:bg-[#EF4444]/30 text-white font-semibold transition-colors"
              >
                Retry Answer
              </button>
            </div>
          )}

          <ChatConversation
            messages={interviewState.messages}
            isThinking={isThinking}
            onSelectSuggestion={handleSendMessage}
            sessionId={interviewState.sessionId}
          />

          <AnswerInput
            onSendMessage={handleSendMessage}
            isThinking={isThinking || interviewState.isPaused}
          />
        </div>

        {/* Context Panel (Desktop Sidebar & Mobile Drawer) */}
        <ContextPanel
          currentFocus={interviewState.currentFocusTopic}
          difficulty={interviewState.difficulty}
          coveredTopics={interviewState.coveredTopics}
          learningSignals={interviewState.learningSignals}
          isOpenMobile={showMobileContext}
          onCloseMobile={() => setShowMobileContext(false)}
        />
      </div>
    </div>
  );
};
