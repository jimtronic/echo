# Echo project context

Last updated: August 15, 2026

This is the durable handoff for a new Codex or ChatGPT session. Read this file, `README.md`, the recent Git log, and the relevant source before making changes. Treat the code as the final authority when this document becomes stale.

## Product direction

Echo began as a small listening-first French prototype. Its primary direction is now:

> Listening exercises on any topic and language.

A learner describes a real scenario, optionally chooses a language and level, and Echo creates a focused pack of natural phrases they are likely to hear or say. Examples include “Shopping for records in Buenos Aires” and “Chatting about landscape painting in France.” This practical, user-directed experience is now the main interface; the original curated courses remain in the app as a secondary system.

The learning philosophy remains: hear real language, understand it, repeat it, internalize it. Keep the product calm and tutor-like. Avoid gamification, accounts, payments, analytics, and platform-scale abstractions unless explicitly requested.

## Current user experience

- A custom scenario generates exactly 25 exercises through the OpenAI API.
- Language can be inferred or explicitly selected: French, Spanish (Spain), Spanish (Latin America), German, Italian, or Japanese.
- Levels are beginner, intermediate, and advanced.
- “Generate 25 more” expands the current pack while asking the model not to repeat existing sentences.
- Generated pack previews show the locale, level, exercise count, and target vocabulary.
- Packs are saved in browser `localStorage` and shown under **My packs**. There are no user accounts or cross-device persistence.
- Completed custom-pack sessions are stored locally with their date, mode, exercise count, and average. **My packs** shows each pack's exercise-weighted overall average and completed-session count. Sessions completed before this feature was added cannot be reconstructed.
- Four reviewed, bundled samples open instantly without an API request: French transport, a Spanish café, Latin American Spanish landscape painting, and everyday German travel.
- Packs can be shared using a self-contained URL fragment. The pack JSON is gzip-compressed and base64url-encoded after `#pack=`; fragments are not sent in normal HTTP requests. No database is needed for sharing. See `src/lib/packLinks.ts`.
- A shared link opens the pack preview, from which the recipient can start practicing.
- Each practice session selects 10 varied exercises from the pack.
- Dictation and translation are separate modes, not simultaneous fields.
- Dictation scoring ignores capitalization, surrounding whitespace, apostrophe variants, and punctuation, but retains accent sensitivity. Spanish inverted punctuation is not penalized.
- Translation uses approximate text matching against the expected and accepted translations. It is not semantic or AI grading.
- After checking, the answer form is replaced with inline corrections and a compact score. The correct phrase, English meaning, replay control, and lesson notes appear below.
- Playback supports 0.6×, 0.8×, and 1.0× speeds plus replay and pause/resume.
- Local MP3 audio is preferred. Browser SpeechSynthesis is the fallback, with regional voice selection where the browser exposes voices.

## Architecture

- Stack: React, TypeScript, Vite, and a minimal Node HTTP server. Dependencies are intentionally small.
- `src/App.tsx`: experience switching, course sessions, custom sessions, exercise UI, modes, and progress.
- `src/ScenarioBuilder.tsx`: scenario generation form, pack preview/expansion, vocabulary, sharing actions, and local pack library.
- `src/lib/packLinks.ts`: compressed share-link creation, decoding, clipboard fallback, and URL cleanup.
- `src/lib/packScores.ts`: local completed-session score history and per-pack summaries.
- `src/data/samplePacks.ts`: reviewed instant sample packs.
- `server/index.mjs`: static/Vite server, generation endpoint, in-memory rate limiting, and private scenario event logging.
- `server/generate-pack.mjs`: OpenAI Responses API request, structured output schema, generation prompt, and validation.
- `src/lib/audio.ts`: MP3 detection/playback and SpeechSynthesis fallback.
- `src/lib/scoring.ts`: normalization, string scoring, and word-level differences.
- `src/data/packs/`: structured curated packs.
- `src/data/lessons.ts`, `betterLessons.ts`, `spanishLessons.ts`, and `germanLessons.ts`: original course content.

## OpenAI generation

- The API key is server-only in `OPENAI_API_KEY`. Never put it in a `VITE_` variable or client code.
- The model defaults to the value currently declared in `server/generate-pack.mjs` and can be overridden with `OPENAI_PACK_MODEL`.
- The Responses API request uses structured JSON output and `store: false`.
- The prompt asks for natural, contemporary, scenario-specific language with useful repetition and without templated monotony.
- Current request validation: scenarios must be 5–300 characters and request bodies are capped at 30 KB.
- Current rate limit: 10 generation requests per client IP per rolling hour, stored only in server memory. It resets on restart and is not adequate for larger-scale public use.
- Some violent or disallowed scenarios may be refused or softened by model safety behavior. Do not promise generation for every topic.

## Privacy and administration

- Scenario text, chosen language, level, continuation status, generation outcome, generated locale, and title are written to private Render logs for concept validation.
- Learner answers and full generated lesson contents are not intentionally logged.
- The scenario form discloses that submitted scenarios may be reviewed and warns against entering private or identifying information.
- There is no admin dashboard yet. Render logs are the current admin view.
- Generated packs and learning progress are stored locally in the browser. Clearing browser data removes them.
- Share URLs intentionally contain the full pack, including its scenario and lessons. Anyone with the URL can read that content.

## Deployment and repositories

- GitHub: `git@github.com:jimtronic/echo.git`
- Main branch: `main`
- Primary live custom-scenario app: <https://echo-language-app.onrender.com/>
- Render service name: `echo-language-app`
- Render service ID: `srv-d9vkdtfqj5pc73dqsn7g`
- An older static course-oriented deployment also exists at <https://echo-language.onrender.com/>. Do not confuse it with the primary app.
- Render build command: `npm ci && VITE_CUSTOM_PACKS=true npm run build`
- Render start command: `npm start`
- Health endpoint: `/health`
- `render.yaml` documents the service configuration and secret variables.

The user has authorized routine commits and pushes to `main`, followed by Render deployment, until they explicitly ask to pause. Still preserve unrelated work, run appropriate checks, and report what was deployed.

Typical deployment flow:

```bash
npm run build
git diff --check
git add <changed files>
git commit -m "Concise description"
git push origin main
render deploys create srv-d9vkdtfqj5pc73dqsn7g --commit <commit> --wait --confirm
```

Confirm the new deploy is `live` before handing off.

## Local development

```bash
npm install
npm run dev
```

The local `.env` needs `OPENAI_API_KEY` for real custom generation. Never commit `.env` or expose its contents. Use `npm run build` before finishing changes.

## Important decisions and constraints

- Keep all curated packs unlocked for now; do not restore the earlier pack-locking progression without discussion.
- The product’s emerging value is personalized situational listening, not a conventional linear course.
- Preserve the original course experience even though it is secondary.
- Generated packs should remain 25 lessons, with expansion in increments of 25.
- Infer language when useful, but retain explicit regional language selection.
- Prefer natural regional language and helpful notes over literal textbook phrasing.
- Keep answer text hidden before submission, including accessibility labels, tooltips, comments, and console output.
- Browser speech quality and available voices vary considerably, especially on iOS. Installed system voices may not be exposed to web SpeechSynthesis.
- Share links are intentionally database-free but can be several thousand characters. Messaging services that truncate long URLs remain a possible limitation.

## Current follow-up areas

- Verify pack sharing on the user’s actual devices and messaging path. Clipboard timing and same-page hash navigation were fixed in commit `7a26580`, but long-link handling can still vary between apps.
- A durable server-side pack store with short URLs would be the natural replacement if fragment links prove unreliable.
- Improve semantic translation evaluation only if translation remains important to the learning experience.
- Add persistent, privacy-conscious admin reporting if scenario usage outgrows manual Render-log review.
- Replace browser TTS with reviewed MP3 recordings or a higher-quality audio pipeline when voice quality becomes central.
- Continue improving regional naturalness, phrase diversity, and editorial review.

## Starting a new Codex session

Use this prompt:

> Read `PROJECT_CONTEXT.md` and `README.md`, inspect the recent Git history and current worktree, then continue working on Echo. Treat the code as authoritative where documentation differs.
