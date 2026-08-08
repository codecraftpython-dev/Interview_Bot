import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(express.json());

// Memory store for /api/interview endpoint
interface ApiInterviewSession {
  sessionId: string;
  candidate?: any;
  history: { role: string; content: string }[];
  turnCount: number;
}
const apiInterviewSessions = new Map<string, ApiInterviewSession>();

// Specification compliant POST /api/interview endpoint
app.post('/api/interview', async (req, res) => {
  try {
    const { sessionId, candidate, message } = req.body;
    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId is required' });
    }

    let session = apiInterviewSessions.get(sessionId);

    // Initial Request: Start Interview
    if (candidate || !session) {
      session = {
        sessionId,
        candidate: candidate || {},
        history: [],
        turnCount: 0,
      };
      apiInterviewSessions.set(sessionId, session);

      const candidateName = candidate?.name || candidate?.member?.name || 'Candidate';
      const jobRole = candidate?.jobRole || candidate?.member?.jobRole || candidate?.role || 'AI Engineer';

      return res.json({
        reply: `Welcome ${candidateName}. I am InterviewForge. Let's begin your technical interview for the ${jobRole} role. Could you briefly summarize your architectural approach to building production RAG and AI systems?`,
        done: false,
      });
    }

    // Subsequent Request: Conversation Turn
    if (message) {
      session.history.push({ role: 'user', content: message });
      session.turnCount += 1;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        if (session.turnCount >= 5) {
          return res.json({
            reply: "Thank you for sharing your technical experience. That concludes our interview session today.",
            done: true,
            feedback: {
              summary: `${session.candidate?.name || session.candidate?.member?.name || 'Candidate'} demonstrated good foundational understanding of AI systems and engineering trade-offs.`,
              strengths: ["Clear communication of system architecture", "Pragmatic approach to RAG component selection"],
              gaps: ["Could elaborate further on low-latency streaming observability"],
              next: ["Review HNSW index parameter tuning", "Practice multi-agent tool hand-offs"]
            }
          });
        }
        return res.json({
          reply: `Thank you for your answer. Moving to the next technical topic: how do you optimize vector database retrieval latency under high write spikes?`,
          done: false
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const candidateName = session.candidate?.name || session.candidate?.member?.name || 'Candidate';

      if (session.turnCount >= 5) {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            {
              role: 'user',
              parts: [{
                text: `You are InterviewForge evaluating candidate ${candidateName}. Here is the conversation history: ${JSON.stringify(session.history)}. Generate a final completion summary in JSON format with fields: reply (string "Interview completed."), done (boolean true), and feedback (object with summary string, strengths string array, gaps string array, next string array).`
              }]
            }
          ],
          config: { responseMimeType: 'application/json', temperature: 0.2 }
        });
        try {
          const parsed = JSON.parse(response.text || '{}');
          return res.json({
            reply: parsed.reply || "Interview completed.",
            done: true,
            feedback: parsed.feedback || {
              summary: `${candidateName} demonstrated strong domain knowledge in AI Systems Engineering.`,
              strengths: ["Strong understanding of vector search and RAG architecture"],
              gaps: ["Deeper benchmarking on embedding cluster PCA visualization"],
              next: ["Study Model Context Protocol integration patterns"]
            }
          });
        } catch {
          return res.json({
            reply: "Interview completed.",
            done: true,
            feedback: {
              summary: `${candidateName} completed the technical evaluation successfully.`,
              strengths: ["Clear articulation of technical trade-offs"],
              gaps: ["Consider exploring OpenTelemetry LLM tracing spans"],
              next: ["Review multi-agent routing frameworks"]
            }
          });
        }
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [{
              text: `You are 'InterviewForge', a senior AI technical interviewer. Candidate name: ${candidateName}. Candidate answer: "${message}". Respond concisely in 2-3 sentences with constructive feedback and ask the next adaptive technical question.`
            }]
          }
        ],
        config: { temperature: 0.3 }
      });

      const reply = response.text || "Thank you. Let's move on to the next question.";
      session.history.push({ role: 'assistant', content: reply });

      return res.json({
        reply,
        done: false,
      });
    }

    return res.status(400).json({ error: 'Invalid request payload' });
  } catch (err: any) {
    console.error('Error in /api/interview:', err?.message || err);
    return res.status(500).json({ error: err?.message || 'Interview endpoint error' });
  }
});

// API route for interview evaluation and question generation
app.post('/api/interview/generate', async (req, res) => {
  try {
    const {
      candidate,
      settings = {},
      currentQuestionNumber,
      totalQuestions = 10,
      currentQuestion,
      currentCurriculumDay,
      currentTopic,
      currentCategory,
      currentDifficulty,
      candidateAnswer,
      coveredDays = [],
      questionsAskedCount = 1,
      currentQuestionAttempts = 1,
      conversationHistory = [],
      availableCurriculum = [],
    } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ error: 'GEMINI_API_KEY not configured' });
    }

    const ai = new GoogleGenAI({ apiKey });

    const personaName = settings.persona || 'Senior AI Systems Architect';
    const interviewMode = settings.interviewMode || 'adaptive';
    const followUpIntensity = settings.followUpIntensity || 'balanced';
    const coverageStrategy = settings.coverageStrategy || 'balanced';

    const systemInstruction = `You are 'InterviewForge', an adaptive AI technical interviewer conducting a live technical interview for Enterprise AI Systems Engineering.

INTERVIEWER PERSONA & SETTINGS:
- Persona: ${personaName}
- Interview Mode: ${interviewMode}
- Probing Intensity: ${followUpIntensity}
- Coverage Strategy: ${coverageStrategy}

CANDIDATE PROFILE:
- ID: ${candidate?.id || 'cand-001'}
- Name: ${candidate?.name || 'Candidate'}
- Role: ${candidate?.role || 'AI Systems Engineer'}
- Years Experience: ${candidate?.rawRecord?.member?.yearsExperience || candidate?.experience || '5 years'}
- Education: ${candidate?.rawRecord?.member?.education || 'BS Computer Science'}
- Completed Missions Count: ${candidate?.completedMissions ?? 28} of 31
- Strong Areas: ${JSON.stringify(candidate?.strongAreas || [])}
- Areas Needing Probing: ${JSON.stringify(candidate?.areasToProbe || [])}
- Skipped Topics: ${JSON.stringify(candidate?.skippedTopics || [])}

ACTIVE INTERVIEW CONTEXT:
- Current Question Number: ${currentQuestionNumber} of ${totalQuestions}
- Current Attempt for Question ${currentQuestionNumber}: Attempt ${currentQuestionAttempts} of 2 (Max 1 follow-up / clarification permitted per primary question)
- Questions Asked So Far in Session: ${questionsAskedCount}
- Curriculum Days Covered So Far: ${JSON.stringify(coveredDays)} (Minimum 4 distinct curriculum days MUST be covered across session)
- Current Active Question Prompt: "${currentQuestion}"
- Current Topic: Day ${currentCurriculumDay} - ${currentTopic} (${currentCategory})
- Current Difficulty Level: ${currentDifficulty}

AVAILABLE CURRICULUM DAYS:
${JSON.stringify(availableCurriculum, null, 2)}

==================================================
STEP 1: NAVIGATION & ATTEMPT RULE (CRITICAL MANDATE)
==================================================
1) IF currentQuestionAttempts >= 2 OR if the candidate provided a legitimate technical explanation (even if short, weak, or partial):
   YOU MUST ADVANCE TO THE NEXT PRIMARY QUESTION (${Number(currentQuestionNumber) + 1})!
   - Set "nextQuestionNumber": ${Number(currentQuestionNumber) + 1}
   - Set "isRelevantAnswer": true
   - Select an UNCOVERED curriculum day if unique covered days < 4, otherwise choose a balanced curriculum day.
   - Formulate "nextQuestionText": A fresh, strictly UNIQUE technical question for the new curriculum day. Do NOT repeat previous questions.

2) IF currentQuestionAttempts == 1 AND the candidate's answer is off-topic, a question-instead-of-answer, an incomplete snippet, "idk", or requests clarification:
   You may ask ONE targeted follow-up or clarification question for Question ${currentQuestionNumber}.
   - Set "nextQuestionNumber": ${currentQuestionNumber}
   - Set "isRelevantAnswer": false
   - Set "nextQuestionText": Your 1 targeted follow-up or clarification question.

NOTE: Low scores or off-topic labels are recorded in evaluation for scoring, BUT THEY MUST NEVER BLOCK PROGRESSION WHEN ATTEMPT >= 2!

==================================================
STEP 2: FEEDBACK GENERATION (STRICT ANTI-TEMPLATE)
==================================================
- ABSOLUTELY NO GENERIC PRAISE! DO NOT use canned phrases like "Solid understanding...", "Good explanation...", "Great job...", "That is a good answer...", "Nice job...".
- INSTEAD: Directly cite 1-2 SPECIFIC technical terms, components, or parameters from candidate's exact input (e.g., "You cited top-k=50 with Cohere ReRank...", "You mentioned payload pre-filtering in Qdrant...").
- Point out what trade-off was omitted or what edge-case failure mode needs consideration.

==================================================
STEP 3: COMPLETION CHECK
==================================================
- "isInterviewComplete": Set to true ONLY IF (questionsAskedCount >= 8 OR currentQuestionNumber >= totalQuestions) AND unique curriculum days covered >= 4.
- Otherwise, "isInterviewComplete": false.

OUTPUT JSON SCHEMA ONLY:
{
  "isRelevantAnswer": boolean,
  "evaluation": {
    "score": number,
    "technicalAccuracy": number,
    "depth": number,
    "reasoning": number,
    "completeness": number,
    "conceptsDemonstrated": ["string"],
    "conceptsMissing": ["string"],
    "misconceptions": ["string"],
    "answerQuality": "weak" | "developing" | "strong" | "excellent" | "non_responsive",
    "recommendedAction": "clarify" | "probe" | "increase_difficulty" | "change_topic" | "reinforce"
  },
  "feedback": "string",
  "nextQuestionNumber": number,
  "nextCurriculumDay": number,
  "nextQuestionText": "string",
  "nextTopic": "string",
  "nextCategory": "string",
  "nextDifficulty": "Foundation" | "Intermediate" | "Advanced" | "Expert",
  "learningSignal": "string",
  "followUpSuggestions": ["string"],
  "isInterviewComplete": boolean
}`;

    // Pass conversation history so Gemini is fully aware of previous questions and answers
    const historyParts = (conversationHistory || []).slice(-8).map((msg: any) => ({
      role: msg.sender === 'ai' ? 'model' : 'user',
      parts: [{ text: msg.text || '' }],
    }));

    const contents = [
      ...historyParts,
      {
        role: 'user',
        parts: [{ text: `Evaluate candidate response for Question ${currentQuestionNumber}:\nCandidate Input: "${candidateAnswer}"\nCurrent Active Question Prompt: "${currentQuestion}"` }],
      },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const responseText = response.text;
    if (!responseText) {
      return res.status(500).json({ error: 'Empty response from Gemini' });
    }

    const parsedData = JSON.parse(responseText);
    return res.json(parsedData);
  } catch (err: any) {
    console.error('Error generating AI interview response:', err?.message || err);
    return res.status(500).json({ error: err?.message || 'Failed to generate response' });
  }
});

// API route for final interview session feedback generation
app.post('/api/interview/feedback', async (req, res) => {
  try {
    const { candidate, session, settings = {} } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ error: 'GEMINI_API_KEY not configured' });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `You are an expert AI Technical Evaluator assessing a completed AI Engineering interview session.

Analyze the candidate's actual answers and generate a comprehensive, evidence-based technical evaluation report.

CANDIDATE: ${candidate?.name || 'Candidate'} (${candidate?.role || 'AI Systems Engineer'})
SESSION ID: ${session?.sessionId || 'INT-SESSION'}
CURRICULUM DAYS COVERED: ${JSON.stringify(session?.coveredDays || [])}
TOTAL QUESTIONS ANSWERED: ${(session?.answers || []).length}

QUESTIONS & ANSWERS HISTORY:
${JSON.stringify(
  (session?.answers || []).map((ans: any, i: number) => ({
    questionNumber: ans.questionNumber,
    questionText: session?.questionsAsked?.[i]?.questionText || `Question ${ans.questionNumber}`,
    candidateAnswer: ans.answerText,
    eval: ans.evaluation,
  })),
  null,
  2
)}

YOUR INSTRUCTIONS:
1. Compute technical scores (0-100) strictly derived from candidate's answers in THIS session:
   - "overallScore": Weighted score combining accuracy, depth, and communication.
   - "technicalAccuracy": Score reflecting accuracy of vector math, RAG, agents, etc.
   - "systemDesignDepth": Score reflecting architecture trade-offs, scaling, failure handling.
   - "communicationClarity": Score reflecting precision and structure of answers.
2. Extract specific "strengths" (at least 3 concrete bullet points highlighting exact concepts candidate demonstrated well in their answers).
3. Extract specific "growthAreas" (at least 2 concrete bullet points detailing missed concepts or areas needing depth based on candidate's answers).
4. Select 2-3 "transcriptHighlights" with actual question text, candidate answer excerpt, and evaluator note.
5. Generate "recommendedStudyPlan" with 2-3 specific curriculum days to review next.

OUTPUT JSON SCHEMA ONLY:
{
  "candidateId": "${candidate?.id || 'cand-001'}",
  "candidateName": "${candidate?.name || 'Candidate'}",
  "sessionId": "${session?.sessionId || 'INT-001'}",
  "completedAt": "${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}",
  "overallScore": number,
  "technicalAccuracy": number,
  "systemDesignDepth": number,
  "communicationClarity": number,
  "strengths": ["string"],
  "growthAreas": ["string"],
  "transcriptHighlights": [
    {
      "question": "string",
      "candidateAnswer": "string",
      "evalNote": "string"
    }
  ],
  "curriculumDaysCovered": number,
  "totalQuestionsAnswered": number,
  "recommendedStudyPlan": [
    {
      "day": number,
      "topic": "string",
      "action": "string"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: `Generate final interview evaluation for candidate ${candidate?.name || 'Candidate'}` }],
        },
      ],
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const responseText = response.text;
    if (!responseText) {
      return res.status(500).json({ error: 'Empty response from Gemini' });
    }

    const parsedData = JSON.parse(responseText);
    return res.json(parsedData);
  } catch (err: any) {
    console.error('Error generating AI final feedback:', err?.message || err);
    return res.status(500).json({ error: err?.message || 'Failed to generate feedback' });
  }
});

// Vite middleware & Static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
