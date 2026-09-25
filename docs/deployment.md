# Deployment Guide

SidMorph is designed for continuous containerized deployment across multi-cloud environments (Vercel, Render, Railway, Neon, AWS ECS).

## Docker Deployment (Recommended)

Run the full multi-service stack with a single command:

```bash
docker compose up -d --build
```

Services initialized:
- `frontend`: React SPA served via Nginx (Port 3000)
- `backend`: Node.js Express API (Port 5000 / 3000)
- `ai-service`: Python FastAPI AI engine (Port 8000)
- `postgres`: PostgreSQL 16 database (Port 5432)

## Manual Cloud Deployment

### 1. PostgreSQL (Neon / Supabase / Railway)
1. Provision a PostgreSQL instance.
2. Export the connection string to `DATABASE_URL`.
3. Run Prisma migration:
   ```bash
   npx prisma migrate deploy
   ```

### 2. Node.js Backend (Render / Railway)
1. Set environment variables:
   - `DATABASE_URL`
   - `GEMINI_API_KEY` (or `OPENAI_API_KEY`)
   - `AI_SERVICE_URL`
2. Build and start:
   ```bash
   npm run build
   npm start
   ```

### 3. Python AI Service (Render / Railway)
1. In `ai-service/`:
   ```bash
   pip install -r requirements.txt
   uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```

### 4. Frontend (Vercel / Cloudflare Pages)
1. Set `VITE_BACKEND_URL` to backend service origin.
2. Build command: `npm run build`
3. Output directory: `dist`
