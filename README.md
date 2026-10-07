# LoveDoes

Personalized love-page generator: React + Vite frontend, Node.js/Express API, MySQL.

## Stack

- Frontend: React, Vite, React Router
- Backend: Node.js, Express, Multer
- Database: MySQL (`mylove_db`)

## Setup

1. Start MySQL locally.
2. Copy credentials into `backend/.env` (already set for local development).
3. Install and initialize:

```bash
cd backend
npm install
npm run db:init
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

The Vite dev server proxies `/api` and `/uploads` to http://localhost:4000.

## Admin

Open http://localhost:5173/admin/login (or the port Vite prints).

Default local admin (change in `backend/.env`):

- Email: `admin@lovedoes.local`
- Password: `LoveAdmin@123`

## Flow

Landing → Create (names, occasion, photos, memories, message, personal song, theme) → unique URL `/love/:slug` → recipient:

Welcome → Our Story → Memories → Letter → Heart pause → “Are you ready to be my Valentine?” (YES / runaway NO) → celebration + 30s 9:16 love status download.

Free pages expire after 30 days. Photos: JPEG/PNG/WEBP. Personal audio: MP3/WAV/M4A up to 12 MB. If a browser cannot record video, a story-card image is offered instead.


## Production notes

Keep the frontend on Netlify and point it at the hosted API. Production API requests default to `https://lovedoes.onrender.com`; set the frontend build variable `VITE_API_URL` to a different backend origin if needed. In local development, the existing Vite proxy still routes requests to `http://localhost:4000`. The backend's `FRONTEND_ORIGIN` must match the deployed frontend origin for cross-origin requests. Never commit real production secrets. Put `DB_PASSWORD` only in server environment variables.
