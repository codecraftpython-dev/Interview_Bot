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

    const systemInstruction = `You are 'InterviewForge', a premier AI technical interviewer for Enterprise AI Systems Engineering.

INTERVIEWER PERSONA & SETTINGS:
- Persona: ${personaName}
- Mode: ${interviewMode}
- Follow-up Probing Intensity: ${followUpIntensity}
- Coverage Strategy: ${coverageStrategy}

CANDIDATE CONTEXT:
Name: ${candidate?.name || 'Candidate'}
Role: ${candidate?.role || 'AI Systems Engineer'}
Strong Areas: ${JSON.stringify(candidate?.strongAreas || [])}
Areas to Probe: ${JSON.stringify(candidate?.areasToProbe || [])}
Skipped Topics: ${JSON.stringify(candidate?.skippedTopics || [])}

CURRENT INTERVIEW STATUS:
Question Number: ${currentQuestionNumber} of ${totalQuestions}
Questions Asked So Far: ${questionsAskedCount}
Curriculum Days Covered So Far: ${JSON.stringify(coveredDays)} (Minimum required before completion: 4 distinct days)
Current Question Asked: "${currentQuestion}"
Current Topic: Day ${currentCurriculumDay} - ${currentTopic} (${currentCategory})
Current Difficulty: ${currentDifficulty}

AVAILABLE CURRICULUM DAYS:
${JSON.stringify(availableCurriculum, null, 2)}

YOUR INSTRUCTIONS:
1. EVALUATE LATEST CANDIDATE ANSWER: "${candidateAnswer}"
   - If greeting ("hi", "hello"), filler, or non-technical ("idk"):
     - "answerQuality": "non_responsive" or "weak"
     - "score": 0.05
     - "isRelevantAnswer": false
     - "recommendedAction": "clarify"
     - "feedback": Politely state that to evaluate technical depth for Question ${currentQuestionNumber}, they need to address the specific question asked. DO NOT praise them.
     - Keep question number at ${currentQuestionNumber}, question text as "${currentQuestion}", same curriculum day.
   - If technical explanation:
     - "isRelevantAnswer": true
     - Calculate "score" (0.0 to 1.0) based on accuracy, depth, reasoning, completeness.
     - Extract "conceptsDemonstrated", "conceptsMissing", "misconceptions".
     - Set "answerQuality": "weak" (0-0.3) | "developing" (0.3-0.55) | "strong" (0.55-0.8) | "excellent" (0.8-1.0).
     - Set "recommendedAction": "clarify" | "probe" | "increase_difficulty" | "change_topic" | "reinforce".
     - In "feedback": Conversational technical critique referencing exact concepts in candidate's answer. If they mentioned top-k, re-ranking, HNSW, MCP, etc., speak directly to those points.

2. ADAPTIVE PROGRESSION & QUESTION SELECTION:
   - Next Question Number: ${Number(currentQuestionNumber) + 1}
   - Target Next Difficulty:
     - weak/non_responsive -> "Foundation" or "Intermediate"
     - developing -> "Intermediate"
     - strong -> "Advanced"
     - excellent -> "Expert"
   - Select Next Curriculum Day & Topic:
     - CRITICAL RULE: If unique curriculum days covered so far < 4, you MUST pick an uncovered curriculum day from AVAILABLE CURRICULUM DAYS (preferably targeting candidate's areasToProbe or skippedTopics).
     - Otherwise, choose a curriculum day that balances depth and breadth across categories (RAG, Agents, Evaluation, Deployment).
   - Formulate Next Question:
     - Generate a contextual question for the next curriculum day that builds on what the candidate demonstrated or missed in their answer.
     - Must be technically specific and natural.

3. COMPLETION CHECK:
   - "isInterviewComplete": Set to true ONLY IF (questionsAskedCount >= 8 OR currentQuestionNumber >= totalQuestions) AND unique curriculum days covered >= 4.
   - If questionsAskedCount < 8 OR unique curriculum days < 4, "isInterviewComplete" MUST BE false.

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
  "followUpSuggestions": ["string", "string", "string"],
  "isInterviewComplete": boolean
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: `Evaluate candidate answer for Question ${currentQuestionNumber}:\nCandidate Answer: "${candidateAnswer}"` }],
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

Analyze the candidate's answers and generate a comprehensive, evidence-based technical evaluation report.

CANDIDATE: ${candidate?.name || 'Candidate'} (${candidate?.role || 'AI Systems Engineer'})
SESSION ID: ${session?.sessionId || 'INT-SESSION'}
CURRICULUM DAYS COVERED: ${JSON.stringify(session?.coveredDays || [])}
QUESTIONS & ANSWERS HISTORY:
${JSON.stringify(
  (session?.answers || []).map((ans: any, i: number) => ({
    questionNumber: ans.questionNumber,
    questionText: session?.questionsAsked?.[i]?.questionText || '',
    candidateAnswer: ans.answerText,
    eval: ans.evaluation,
  })),
  null,
  2
)}

YOUR INSTRUCTIONS:
1. Compute technical scores (0-100) based strictly on candidate's answers:
   - "overallScore": Weighted score combining accuracy, depth, and communication.
   - "technicalAccuracy": Score reflecting accuracy of vector math, RAG, agents, etc.
   - "systemDesignDepth": Score reflecting architecture trade-offs, scaling, failure handling.
   - "communicationClarity": Score reflecting precision and structure of answers.
2. Extract specific "strengths" (at least 3 concrete bullet points highlighting what candidate demonstrated well).
3. Extract specific "growthAreas" (at least 2 concrete bullet points detailing missed concepts or areas needing depth).
4. Select 2-3 "transcriptHighlights" with question text, candidate answer excerpt, and evaluator note.
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
