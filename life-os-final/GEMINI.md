# Project: LifeOS (Challenge 3)

## Goal
Build a unified SaaS platform that serves as a container for two sub-apps: "Checkmate" (Todo) and "Stash" (Link Aggregator).
The platform requires a Landing Page, Single Sign-On (SSO), and a Dashboard Hub.

## Tech Stack
- **Server:** Node.js + Express
- **Templating:** EJS
- **Database:** Firebase Firestore
- **Auth:** Firebase Auth (Client-Side SDK)
- **AI:** Google Gemini API (Server-side via `@google/generative-ai`)
- **Style:** Tailwind CSS (CDN)

## Architecture
- `server.js`: Handles routing and API endpoints for AI.
- `views/`: Contains all UI.
    - `layouts/`: Shared headers/navbars.
    - `apps/`: Contains `todo.ejs` and `links.ejs`.
- **Data Model:**
    - Collection `todos`: { text, isDone, userId, createdAt }
    - Collection `links`: { url, summary, tags, userId, createdAt }

## Rules
- Always use `import` (ES Modules).
- Use Client-Side Auth for page protection (redirect if user === null).
- Use Server-Side Logic for AI processing (Gemini).