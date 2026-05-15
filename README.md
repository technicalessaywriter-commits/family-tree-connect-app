# Familia Connect

A full-stack family tree application with authentication, multiple trees, profile photos, relationship management, drag-and-drop tree layout, timeline, import/export, real-time collaboration hooks, role permissions, Docker support, and CI.

## Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, Framer Motion, React Flow
- Mobile: Expo, React Native, TypeScript
- Backend: Node.js, Express, TypeScript, JWT, Socket.IO
- Database: MongoDB
- Storage: Cloudinary when configured, local base64 data URLs in development fallback
- Testing: Vitest, Testing Library, Supertest

## Folder Structure

```text
.
├── apps
│   ├── api
│   │   ├── src
│   │   │   ├── middleware
│   │   │   ├── models
│   │   │   ├── routes
│   │   │   ├── services
│   │   │   ├── app.ts
│   │   │   ├── server.ts
│   │   │   └── seed.ts
│   │   └── Dockerfile
│   ├── mobile
│   │   ├── src
│   │   │   ├── components
│   │   │   ├── lib
│   │   │   ├── screens
│   │   │   └── state
│   │   ├── app.json
│   │   └── eas.json
│   └── web
│       ├── src
│       │   ├── components
│       │   ├── hooks
│       │   ├── lib
│       │   ├── App.tsx
│       │   └── main.tsx
│       └── Dockerfile
├── docs
├── docker-compose.yml
└── .github/workflows/ci.yml
```

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Start MongoDB and the app with Docker:

```bash
docker compose up --build
```

4. Or run services locally:

```bash
npm run dev
```

The API runs on `http://localhost:4000` and the web app runs on `http://localhost:5173`.

## Mobile Setup

The Android and iOS app lives in `apps/mobile`.

```bash
npm run dev:mobile
```

Use `EXPO_PUBLIC_API_URL` to point the phone or simulator at the API. Android emulator normally needs `http://10.0.2.2:4000/api`; iOS simulator can use `http://localhost:4000/api`; physical phones need your computer's LAN IP. See `docs/mobile.md`.

## Seed Data

With MongoDB running:

```bash
npm run seed
```

Login with:

```text
avery@example.com
password123
```

## Features

- Signup, login, logout with JWT
- Create and manage multiple family trees
- Add, edit, delete, search, and filter members
- Profile photo upload through Cloudinary
- Parent, child, sibling, spouse, and grandparent relationships
- Plausibility validation for impossible age relationships
- Automatic generation updates for directional relationships
- Drag-and-drop visual tree canvas with zoom and pan
- Timeline view for births and deaths
- JSON import/export, PNG export, and PDF export
- Dark mode and light mode
- Real-time collaboration transport with Socket.IO
- Email invite endpoint with Admin, Editor, and Viewer roles
- Family event calendar data model and API
- Statistics dashboard
- Responsive UI for mobile, tablet, and desktop

## API Overview

```text
POST   /api/auth/signup
POST   /api/auth/login
GET    /api/trees
POST   /api/trees
GET    /api/trees/:id
PATCH  /api/trees/:id
DELETE /api/trees/:id
POST   /api/trees/:id/invites
POST   /api/trees/:id/events
GET    /api/trees/:treeId/members
POST   /api/trees/:treeId/members
PATCH  /api/trees/:treeId/members/:memberId
DELETE /api/trees/:treeId/members/:memberId
POST   /api/trees/:treeId/members/:memberId/relationships
GET    /api/export/:id/json
POST   /api/export/:id/import
```

## Tests

```bash
npm test
npm run lint
npm run build
```

## Environment

See `.env.example` for all required variables. Cloudinary and SMTP are optional for local development, but should be configured in production.
