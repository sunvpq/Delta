# Delta

Extract expert reasoning from Codeforces editorials into structured traces. Paste an editorial, get back the core observation, proof type, key insight, and why the naive approach fails — so you can learn the pattern, not just the answer.

## Tech Stack

- **Frontend:** React, Vite, TailwindCSS
- **Backend:** FastAPI, SQLAlchemy, SQLite
- **AI:** Anthropic Claude API (`claude-sonnet-4-6`)

## Project Structure

```
delta/
├── frontend/   # React + Vite app
└── backend/    # FastAPI app
```

## Running Locally

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Runs at `http://localhost:8000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs at `http://localhost:5173`.

## Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
ANTHROPIC_API_KEY=your_api_key_here
DATABASE_URL=sqlite+aiosqlite:///./delta.db
```

`ANTHROPIC_API_KEY` is required. Get one at [console.anthropic.com](https://console.anthropic.com).
