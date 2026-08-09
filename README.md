# ⚡ InterViewForge

### Where every interview is forged around you.

> **Build the interviewer, not the interview.**

InterViewForge is an AI-powered technical interview platform designed to conduct realistic, personalized, multi-turn technical interviews based on a candidate's learning journey.

Instead of presenting candidates with a fixed questionnaire, InterViewForge analyzes their learning progress, asks technical questions, understands their responses, generates contextual follow-up questions, maintains conversation context, and produces structured feedback after the interview.

---

## 🎯 Problem Statement

The AI Cohort is a **31-day enterprise AI engineering program** covering modern AI engineering topics such as:

- Retrieval-Augmented Generation (RAG)
- Vector Databases
- Prompt Engineering
- Agentic AI
- Model Context Protocol (MCP)
- AI Deployment
- Production AI Systems

After completing the program, learners should be able to confidently explain:

- What they built
- How their systems work
- Why they selected particular technologies
- What engineering decisions they made
- What trade-offs they considered
- How their systems could be improved

However, preparing for technical interviews and communicating this knowledge effectively remains a major challenge.

InterViewForge addresses this problem by creating an **adaptive AI interviewer** that conducts a technical interview around the candidate's actual learning journey.

---

# 🧠 Our Solution

InterViewForge transforms candidate learning data and curriculum information into a personalized interview experience.

Instead of:

    Question → Answer → Next Question → Next Question

InterViewForge follows:

    Candidate Profile
          ↓
    Learning Journey
          ↓
    Curriculum Context
          ↓
    Technical Question
          ↓
    Candidate Response
          ↓
    Response Analysis
          ↓
    Contextual Follow-up
          ↓
    Deeper Technical Discussion
          ↓
    Next Topic
          ↓
    Interview Completion
          ↓
    Structured Feedback

The objective is not simply to ask questions.

The objective is to **behave like an interviewer who understands the candidate's journey.**

---

# ✨ Key Features

## 🤖 Adaptive AI Interviewer

The interviewer dynamically adapts to the candidate's responses.

It can:

- Ask technical questions
- Evaluate candidate responses
- Ask follow-up questions
- Explore weak areas
- Explore strong areas in greater depth
- Change the direction of the conversation
- Maintain context throughout the interview
- Move between different curriculum topics
- Avoid behaving like a static questionnaire

---

## 🧩 Personalized Candidate Interviews

Every interview is based on candidate-specific learning information.

Candidate profiles can contain information such as:

- Candidate name
- Candidate ID
- Role
- Experience
- Education
- Completed missions
- Mission attempts
- Skipped topics
- Learning signals
- Curriculum progress

This allows the interviewer to understand what the candidate has actually learned before selecting questions.

---

## 📚 Curriculum-Aware Questioning

The interviewer uses the provided 31-day curriculum as the technical foundation for the interview.

The curriculum covers areas including:

- Environment & Tooling
- Data Foundations
- Embeddings & Vector Search
- LLM Core
- Prompt Engineering
- Fine-Tuning
- Chatbot Application Development
- Agentic AI
- MCP
- Evaluation
- Security
- Deployment
- Production AI Systems
- Capstone Engineering

The interview is therefore connected to the candidate's actual learning journey instead of using unrelated generic interview questions.

---

# 🔄 Multi-Turn Conversation

InterViewForge maintains conversation context throughout the interview.

For example:

    Interviewer:
    Explain how you implemented semantic search.

    Candidate:
    I generated embeddings for the documents and stored
    them in a vector database.

    Interviewer:
    Why did you choose that embedding strategy?

    Candidate:
    Because I wanted semantically similar documents
    to be retrieved even when exact keywords differed.

    Interviewer:
    How would you handle the situation where the
    embedding dimensions of two models are different?

The third question is influenced by the previous responses.

This makes the experience closer to a real technical interview.

---

# 🎯 Interview Requirements

The system is designed to satisfy the core challenge requirements.

### Minimum requirements

- ✅ Conversational technical interview
- ✅ Minimum of 8 questions
- ✅ Questions covering at least 4 different curriculum days
- ✅ Context-aware follow-up questions
- ✅ Multi-turn conversation context
- ✅ Structured final feedback
- ✅ Required HTTP interview endpoint

The interview question limit can be configured for the application.

For example:

    Question 1 of 8
    Question 2 of 8
    Question 3 of 8
    ...
    Question 8 of 8

When the configured question limit is reached, the interview ends and the feedback stage begins.

---

# 🧑‍💻 Candidate Profiles

The project uses the synthetic candidate profiles supplied with the hackathon.

These profiles represent participants in the AI Cohort and contain learning-related information.

A candidate can have information such as:

    Candidate
    ├── Identity
    ├── Professional Information
    ├── Education
    ├── Completed Missions
    ├── Attempts
    ├── Skipped Topics
    └── Learning Signals

The candidate data is used to personalize the interview.

### Important

The candidate profiles supplied for the challenge are **synthetic hackathon data**.

They are not intended to represent real individuals.

---

# 📈 Candidate Progress

The platform can display candidate learning progress based on the supplied candidate data.

Mission progress represents the candidate's progress through the provided cohort missions.

For example:

    28 of 31 missions completed

This information is used as candidate context and should remain consistent with the supplied candidate data.

---

# 🎤 Interview Experience

The Interviews section is the central part of InterViewForge.

An interview session includes:

- Candidate context
- Current question
- Question number
- Question limit
- Candidate response
- Previous conversation context
- Follow-up questions
- Interview controls
- Interview completion
- Feedback generation

The interface is designed to make the interaction feel like a real technical interview rather than a form.

---

# 🧠 Adaptive Follow-Up Questions

One of the most important capabilities of InterViewForge is contextual follow-up questioning.

The AI should not simply move to the next predefined question.

Instead, it should interpret the candidate's previous response.

For example:

    Candidate gives a shallow answer
             ↓
    AI identifies missing technical depth
             ↓
    AI asks a deeper follow-up

Or:

    Candidate demonstrates strong understanding
             ↓
    AI identifies opportunity for deeper evaluation
             ↓
    AI asks an architecture/trade-off question

This allows the interview difficulty and direction to evolve naturally.

---

# 📝 Structured Feedback

After the interview reaches its configured question limit, the interviewer generates structured feedback.

The Feedback page presents what the AI interviewer understood from the candidate's performance.

Feedback includes:

### 📌 Summary

A concise explanation of the candidate's overall interview performance.

### 💪 Strengths

Areas where the candidate demonstrated strong understanding.

### ⚠️ Gaps

Technical areas where the candidate showed weaknesses, uncertainty, or insufficient depth.

### 🚀 Next Steps

Actionable recommendations for improving technical knowledge and interview performance.

The feedback should be based on the actual conversation rather than generic statements.

---

# 🗂️ Interview Sessions

Each interview is treated as an individual session.

Conceptually:

    Candidate
       │
       ├── Interview Session 1
       │      ├── Questions
       │      ├── Responses
       │      └── Feedback
       │
       ├── Interview Session 2
       │      ├── Questions
       │      ├── Responses
       │      └── Feedback
       │
       └── Interview Session 3
              ├── Questions
              ├── Responses
              └── Feedback

A session should have its own identifier such as:

    sessionId

The session ID allows the application and backend to maintain the correct conversation state.

---

# 🗑️ Session Deletion

The Feedback experience includes the ability to remove the complete record of a selected interview session.

Deleting a session should affect that selected interview session only.

It should not remove:

- The candidate profile
- The curriculum
- Other interview sessions

Conceptually:

    Candidate Profile
          │
          ├── Session A  ← Delete
          ├── Session B
          └── Session C

Only Session A is removed.

---

# 🖥️ Dashboard

The Dashboard provides an overview of the platform.

It can provide information such as:

- Interview readiness
- Candidate information
- Mission progress
- Interview statistics
- Interview actions
- Reports
- Recent interview activity

The Dashboard acts as the main workspace after entering the application.

---

# 👥 Candidates

The Candidates section provides access to the synthetic candidate profiles supplied for the challenge.

Candidate information can include:

- Name
- Role
- Experience
- Education
- Learning progress
- Completed missions
- Attempts
- Skipped topics
- Learning signals

Selecting a candidate allows the interviewer to use that candidate's learning journey as interview context.

---

# 💬 Gemini Project Assistant

InterViewForge also includes a Gemini-powered assistant designed to help users understand the application.

The assistant is different from the AI Interviewer.

### AI Interviewer

    Conducts the technical interview
    ↓
    Evaluates responses
    ↓
    Generates follow-up questions
    ↓
    Produces interview feedback

### Gemini Assistant

    Explains the platform
    ↓
    Explains UI/UX
    ↓
    Explains features
    ↓
    Helps users understand how the application works

# 📱 Responsive Design

Responsiveness is a first-priority requirement of the platform.

InterViewForge should provide a usable experience across:

- 🖥️ Desktop
- 💻 Laptop
- 📱 Tablet
- 📱 Mobile

Important responsive areas include:

- Sidebar
- Dashboard
- Candidate pages
- Interview interface
- Feedback
- Settings
- Gemini Assistant
- Interview input
- Interview controls

The interface should prevent:

- Horizontal overflow
- Overlapping elements
- Hidden buttons
- Broken layouts
- Unreadable text
- Incorrect sidebar behavior
- Chatbot overlap
- Input obstruction

---

# 💡 Interview Page UX

The interview page is designed around the candidate's response.

The answer input must remain accessible at all times.

Critical controls such as:

- Send
- Pause
- Exit
- Question counter

must not be hidden behind the Gemini Assistant or other floating UI.

The chatbot launcher must therefore be positioned responsively without interfering with the interview experience.

---

# 🎨 Branding

The application uses the **InterViewForge** identity.

The main application logo and the Gemini Assistant icon are separate assets.

### Main Logo

Used for:

    InterViewForge
    Application branding
    Sidebar/header

### Gemini Assistant Icon

Used for:

    Gemini Project Assistant
    Floating chatbot launcher

Changing the chatbot icon must not modify the application's main logo.

---

# 🔌 API

The core interview functionality is exposed through the required HTTP endpoint.

## Endpoint

    POST /api/interview

The endpoint is responsible for handling interview interaction and maintaining the appropriate interview session context.

---

# 📡 Interview Request

A request can contain a session identifier and candidate context.

Example:

    {
      "sessionId": "session-123",
      "candidate": {
        "...": "candidate data"
      }
    }

---

# 💬 Interview Message

During an active interview, the candidate's response can be sent using the session identifier.

Example:

    {
      "sessionId": "session-123",
      "message": "My approach would be to use..."
    }

---

# ✅ Interview Completion

When the interview reaches the configured question limit, the API should indicate that the interview is complete.

Example:

    {
      "reply": "The interview is complete.",
      "done": true,
      "feedback": {
        "summary": "Overall performance summary",
        "strengths": [
          "Strong understanding of RAG architecture"
        ],
        "gaps": [
          "Needs deeper understanding of evaluation strategies"
        ],
        "next": [
          "Practice production-level RAG evaluation"
        ]
      }
    }

The final feedback structure contains:

- `summary`
- `strengths`
- `gaps`
- `next`

---

# 🏗️ High-Level Architecture

The overall system can be represented as:

    ┌──────────────────────────────┐
    │       InterViewForge UI     │
    │                              │
    │ Dashboard                    │
    │ Candidates                   │
    │ Interviews                   │
    │ Feedback                     │
    │ Settings                     │
    └──────────────┬───────────────┘
                   │
                   ▼
    ┌──────────────────────────────┐
    │      Interview Interface     │
    └──────────────┬───────────────┘
                   │
                   ▼
    ┌──────────────────────────────┐
    │      Interview API           │
    │      POST /api/interview     │
    └──────────────┬───────────────┘
                   │
                   ▼
    ┌──────────────────────────────┐
    │       AI Interviewer         │
    │                              │
    │ Candidate Context            │
    │ Curriculum Context           │
    │ Conversation Context         │
    │ Response Analysis            │
    │ Follow-up Generation         │
    └──────────────┬───────────────┘
                   │
                   ▼
    ┌──────────────────────────────┐
    │       Interview Session      │
    │                              │
    │ Questions                    │
    │ Responses                    │
    │ Context                      │
    │ Completion State              │
    └──────────────┬───────────────┘
                   │
                   ▼
    ┌──────────────────────────────┐
    │       Feedback Engine        │
    │                              │
    │ Summary                      │
    │ Strengths                    │
    │ Gaps                         │
    │ Next Steps                   │
    └──────────────────────────────┘


# 🔄 Complete Interview Flow

    1. Candidate is selected
              ↓
    2. Interview session starts
              ↓
    3. Candidate profile is loaded
              ↓
    4. Learning journey is considered
              ↓
    5. Curriculum context is considered
              ↓
    6. AI asks technical question
              ↓
    7. Candidate responds
              ↓
    8. AI analyzes response
              ↓
    9. AI decides next direction
              ↓
    10. Follow-up question generated
              ↓
    11. Conversation continues
              ↓
    12. Question limit is reached
              ↓
    13. Interview ends
              ↓
    14. Structured feedback generated
              ↓
    15. Feedback displayed


# 📚 Curriculum Structure

The challenge provides a structured 31-day curriculum.

The curriculum is organized into modules covering the AI engineering journey.

At a high level:

    31-Day AI Engineering Curriculum
                │
                ├── Environment & Tooling
                ├── Data Foundations
                ├── Embeddings & Vector Search
                ├── LLM Core
                ├── Prompt Engineering
                ├── Fine-Tuning
                ├── Chatbot Development
                ├── Agentic AI
                ├── MCP
                ├── Evaluation
                ├── Security
                ├── Deployment
                └── Production AI Systems

The exact curriculum data supplied by the challenge remains the source of truth for interview topic selection.

---

# 🧪 Synthetic Data

The challenge explicitly states that the curriculum and candidate data are synthetic.

Therefore:

- Candidate profiles are synthetic.
- Candidate progress is synthetic.
- Learning signals are synthetic.
- Mission completion data is synthetic.

The application uses this data solely for the hackathon experience.

---

# ⚙️ Technology Choices

The challenge allows teams to choose their own:

- AI models
- Frameworks
- Agent orchestration strategy
- Retrieval pipeline
- Vector databases
- Supporting technologies
- System architecture

InterViewForge uses the technologies and architecture defined in the project source code.

---

## 📁 Project Structure

```text
InterViewForge/
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── services/
│   ├── utils/
│   │
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── types.ts
│   └── vite-env.d.ts
│
├── .env.example
├── .gitignore
├── Challenge.md
├── index.html
├── metadata.json
├── package.json
├── README.md
├── server.ts
├── tsconfig.json
└── vite.config.ts
```

The exact structure may vary depending on the final source implementation.

---

# 🚀 Getting Started

## 1. Clone the Repository

    git clone <YOUR_PUBLIC_REPOSITORY_URL>

## 2. Enter the Project

    cd <PROJECT_DIRECTORY>

## 3. Install Dependencies

    yarn install

## 4. Start Development

Use the development command defined in `package.json`.

For a typical Vite-based project:

    yarn dev

---

# 🔑 Environment Variables

If the project requires environment variables, create the appropriate environment file according to the implementation.

Example:

    GEMINI_API_KEY=your_api_key_here

Never commit private API keys or secrets to the repository.

Environment variable names should match those expected by the actual application.

---

# 🏭 Production Build

The project can be built using:

    yarn install; yarn build

The exact start command depends on the project's deployment architecture and package scripts.

---

# ☁️ Deployment

The application can be deployed to a reachable hosting platform such as Render.

A typical deployment flow is:

    GitHub Repository
          ↓
    Connect Repository
          ↓
    Configure Environment Variables
          ↓
    Install Dependencies
          ↓
    Build Application
          ↓
    Deploy
          ↓
    Public Application URL

For the current Render workflow, the build command can be:

    yarn install; yarn build

The deployed application should be publicly reachable for evaluation.

---

# 🧠 What Makes InterViewForge Different?

Traditional interview applications often follow a fixed structure:

    Question 1
       ↓
    Question 2
       ↓
    Question 3
       ↓
    Question 4

InterViewForge is designed around adaptive conversation:

    Candidate Context
          ↓
    Technical Question
          ↓
    Candidate Response
          ↓
    AI Understanding
          ↓
    Follow-up Decision
          ↓
    Deeper Technical Question
          ↓
    New Context
          ↓
    Adaptive Interview

This makes the AI interviewer the core product.

---

# 🎯 Design Philosophy

## Build the interviewer, not the interview.

The goal is not to create a large list of interview questions.

The goal is to create an interviewer that can:

- Understand the candidate
- Understand what the candidate learned
- Understand the candidate's answer
- Identify gaps
- Recognize strengths
- Ask meaningful follow-ups
- Maintain context
- Evaluate technical depth
- Give useful feedback

The quality of the interview depends on the quality of the conversation.

---

# 🛡️ Responsible AI Considerations

InterViewForge should keep its evaluation grounded in the available candidate and interview information.

The system should:

- Avoid inventing candidate achievements
- Avoid inventing completed missions
- Avoid inventing interview responses
- Base feedback on the actual conversation
- Clearly distinguish synthetic challenge data
- Avoid exposing private system instructions
- Avoid presenting unsupported assumptions as facts
- Keep feedback understandable and actionable

---

# 📊 Evaluation-Oriented Design

The project is designed around the core challenge requirements.

### Conversational Quality

The AI should behave naturally rather than repeating predefined responses.

### Personalization

Questions should be influenced by the candidate's learning journey.

### Technical Depth

Follow-ups should test deeper understanding rather than simply asking unrelated questions.

### Context Retention

Previous responses should influence later questions.

### Coverage

The interview should cover at least four curriculum days.

### Completion

The interview should terminate after the configured question limit.

### Feedback

The final feedback should communicate meaningful observations from the interview.

---

# 🗺️ Future Improvements

The following features are potential future extensions and are not required by the current challenge:

- 🔐 User authentication
- 👤 Persistent user accounts
- 📚 Long-term interview history
- 📊 Advanced candidate analytics
- 📈 Interview comparison
- 🧠 More advanced skill scoring
- 🎚️ Difficulty profiles
- 🏗️ Dedicated system-design interview mode
- 🎙️ Voice interviews
- 📱 Dedicated mobile application
- 📡 Advanced observability
- 📋 Interview report export
- 🏆 Candidate benchmarking
- 🔎 Advanced interview search

These features can be added later without changing the fundamental purpose of the platform.

---

# 🏁 Final Architecture

    ┌─────────────────────────────────────────────┐
    │               InterViewForge                │
    │                                             │
    │  Dashboard │ Candidates │ Interviews        │
    │            │ Feedback   │ Settings          │
    └──────────────────────┬──────────────────────┘
                           │
                           ▼
                ┌────────────────────┐
                │ Candidate Context  │
                └─────────┬──────────┘
                          │
                          ▼
                ┌────────────────────┐
                │  Curriculum Data   │
                └─────────┬──────────┘
                          │
                          ▼
                ┌────────────────────┐
                │  AI Interviewer    │
                │                    │
                │ Questioning        │
                │ Response Analysis  │
                │ Follow-ups         │
                │ Context            │
                └─────────┬──────────┘
                          │
                          ▼
                ┌────────────────────┐
                │ Interview Session  │
                └─────────┬──────────┘
                          │
                          ▼
                ┌────────────────────┐
                │ Structured         │
                │ Feedback           │
                │                    │
                │ Summary            │
                │ Strengths          │
                │ Gaps               │
                │ Next Steps         │
                └────────────────────┘


                  ┌──────────────────┐
                  │ Gemini Assistant │
                  │                  │
                  │ Project Help     │
                  │ UI/UX Help       │
                  │ Feature Help     │
                  └──────────────────┘


# 🌟 Final Takeaway

InterViewForge turns a candidate's learning journey into an adaptive technical interview.

It combines:

    📚 Curriculum
          +
    👤 Candidate Learning Data
          +
    🤖 AI Interviewer
          +
    💬 Multi-Turn Conversation
          +
    🧠 Context-Aware Follow-ups
          +
    🎯 Technical Evaluation
          +
    📝 Structured Feedback
          =
    🚀 Personalized Technical Interview Experience


---

# ⚡ InterViewForge

### Where every interview is forged around you.

> **Build the interviewer, not the interview.**

Built for the AI Interview Agent challenge.