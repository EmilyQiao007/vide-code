# Project: LifeOS (Challenge 3)

## Context
We are building "LifeOS," a unified SaaS platform that combines a Todo App (Checkmate) and a Link Aggregator (Stash) into a single cohesive application.
The goal is to demonstrate "Integration": protecting multiple apps behind a single Authentication wall.

## Tech Stack
- **Runtime:** Node.js (v20+)
- **Framework:** Express.js (ES Modules with `import`/`export`)
- **Templating:** EJS
- **Styling:** Tailwind CSS (via CDN for simplicity)
- **Database:** Firebase Firestore (NoSQL)
- **Auth:** Firebase Authentication (Google Sign-In, Client-Side SDK)
- **AI:** Google Gemini API 3 Pro via `@google/generative-ai`

## Coding Rules
1.  **ES Modules:** Always use `import` and `export`. Set `"type": "module"` in `package.json`.
2.  **No Build Steps:** Use CDN links for Frontend libraries (Firebase, Tailwind) to keep the setup simple and "Vibe" friendly.
3.  **Client-Side Auth:** Handle all authentication logic (Login, Logout, Auth State) in the browser using the Firebase Web SDK. The server should render pages blindly; the client protects them.
4.  **Error Handling:** Always wrap async server functions in `try/catch` blocks.
5.  **Environment Variables:** Use `dotenv` for server-side secrets (like Gemini API keys), but hardcode the *public* Firebase Config in frontend files for reliability.

## Project Structure
- `server.js` (Main entry point)
- `src/` (Optional: controllers/routes if logic gets complex)
- `views/` (EJS Templates)
    - `landing.ejs` (Public marketing page)
    - `login.ejs` (Auth page)
    - `dashboard.ejs` (The "Hub" to switch apps)
    - `apps/`
        - `todo.ejs` (The Checkmate app)
        - `links.ejs` (The Stash app)
- `public/` (Static assets)

## Persona
You are a Senior Full Stack Google Cloud Developer. You write clean, semantic, and accessible HTML/CSS. You prioritize "working code" over "perfect architecture" for this prototype but ensure it is secure enough for a demo.