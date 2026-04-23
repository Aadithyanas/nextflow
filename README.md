# AI Workflow Builder

Full-stack workflow editor built with Next.js, Express, MongoDB, JWT auth, React Flow, and Google Gemini integration.

## Apps

- `frontend`: Next.js + TypeScript + Tailwind CSS canvas UI
- `backend`: Express + TypeScript API, auth, workflow persistence, and execution engine

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create environment files from the examples:

- `frontend/.env.local`
- `backend/.env`

3. Start the backend:

```bash
npm run dev:backend
```

4. Start the frontend:

```bash
npm run dev:frontend
```

## Required Environment Variables

### Frontend

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### Backend

```bash
PORT=4000
CLIENT_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/ai-workflow-builder
JWT_SECRET=replace-this-with-a-long-secret
GEMINI_API_KEY=your-google-gemini-api-key
GEMINI_MAX_RETRIES=5
```
