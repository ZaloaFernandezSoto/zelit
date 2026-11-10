# ZELIT

Spotify-style music streaming platform (MERN). Stores only YouTube metadata, not audio.
Roles: **user** and **admin**.

## Requirements
Node.js LTS, Git, and a MongoDB (Atlas) database.

## Installation

### Backend
```bash
cd backend
npm install
cp .env.example .env     # fill in MONGO_URI and JWT_SECRET (ask the team for these)
npm run seed:admin       # create the admin user (once only)
npm run dev              # http://localhost:5000
```
Check: http://localhost:5000/api/health

### Frontend
```bash
cd frontend
npm install
npm run dev              # http://localhost:5173
```

## Team Workflow
- Never work on `main`: create a `feature/task-name` branch.
- Make small commits and send Pull Requests to `main`.
- **Never commit `.env`** (it’s already in `.gitignore`).

## Team

