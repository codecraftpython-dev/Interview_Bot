# Interview_Bot

An AI-powered interview agent that conducts personalized technical interviews based on a candidate's learning journey through **The AI Cohort** — a 31-day enterprise AI engineering program.

Instead of generic interview questions, Interview_Bot grounds each session in what the candidate actually built: their projects, tech choices, and confidence levels across topics like RAG, vector databases, agentic AI, and MCP. It asks adaptive follow-up questions, evaluates answer quality, and generates a feedback report highlighting strengths and gaps.

See [CHALLENGE.md](./CHALLENGE.md) for the full problem statement, requirements, and evaluation criteria.

## Features

- **Personalized questions** — grounded in the candidate's own cohort projects via RAG
- **Adaptive follow-ups** — digs deeper on weak answers, moves on from strong ones
- **Multi-topic coverage** — RAG, vector databases, prompt engineering, agentic AI, MCP, deployment
- **Feedback reports** — technical accuracy, depth of reasoning, and communication scoring with study recommendations

## Tech Stack

- **LLM**: [e.g. Claude / OpenAI API]
- **Vector DB**: [e.g. Chroma / Pinecone / Qdrant]
- **Orchestration**: [e.g. LangChain / custom agent loop]
- **Backend**: [e.g. Python + FastAPI]
- **Frontend**: [e.g. React / CLI]

## Getting Started

### Prerequisites
- Python 3.10+ / Node.js 18+ (update based on your stack)
- API key for your chosen LLM provider
- Vector database instance (local or cloud)

### Installation

```bash
git clone https://github.com/parkhhi15/Interview_Bot.git
cd Interview_Bot
pip install -r requirements.txt   # or npm install
```

### Configuration

Copy the example env file and fill in your keys:

```bash
cp .env.example .env
```

### Run

```bash
python main.py   # or npm start
```

## Project Structure

```
Interview_Bot/
├── backend/           # Agent logic, evaluation, API
├── frontend/           # Chat UI (or CLI)
├── data/               # Candidate profiles, curriculum content
├── CHALLENGE.md         # Full challenge brief
└── README.md
```

## Roadmap

- [ ] Candidate profile schema
- [ ] Curriculum + project ingestion pipeline (RAG)
- [ ] Core interview agent loop
- [ ] Evaluation & report generation
- [ ] MCP integration
- [ ] Deployment

## License

[Add your license here]
