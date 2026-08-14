# Echo v0.1

Echo is a small, local listening-first language-learning prototype. Each session presents 10 shuffled phrases from curated French, Spanish (Spain), Latin American Spanish, and German libraries. French beginner currently has four structured 25-phrase packs, Spanish (Spain) has two, and Latin American Spanish has three—including landscape-painting and record-shopping topic packs. The remaining collections contain 87 intermediate lessons or 71 advanced lessons while the editorial expansion continues.

Session selection is variety-aware: it avoids placing phrases from the same sentence family or topic next to one another when possible, and Mixed sessions also alternate levels when possible.

Dictation and translation are scored separately. Translation match is an approximate wording comparison, not semantic grading, so alternate valid translations can score lower than the expected phrasing.

## Run locally

Requires a current Node.js LTS release.

```bash
npm install
npm run dev
```

Open the URL Vite prints (normally <http://localhost:5173>).

Custom scenario packs require an OpenAI API key in a local `.env` file:

```bash
OPENAI_API_KEY=your_api_key_here
```

The key is used only by Echo's Node server. Never expose it through a `VITE_` environment variable. Each scenario generates 25 lessons and can be expanded in additional groups of 25.

The prototype limits each client to 10 generation requests per hour in server memory. Use persistent rate limiting before substantially widening public access.

For a production build check:

```bash
npm run build
npm run preview
```

## Deploy to Render

Echo includes a `render.yaml` Blueprint for a Render Node Web Service. Add `OPENAI_API_KEY` as a secret environment variable, then use:

```text
Build command: npm ci && VITE_CUSTOM_PACKS=true npm run build
Start command: npm start
```

## Audio

Place lesson recordings under `public/audio/fr/<level>/`, matching each lesson's `audio` field. Echo prefers those recordings. If a file is absent, it tries the browser SpeechSynthesis API with an `fr-FR` voice. Available voices and pronunciation vary by browser and operating system; voices may load asynchronously, and some browsers may not expose a French voice at all.

## Project structure

- `src/data/betterLessons.ts` — curated and templated French lesson collection
- `src/data/spanishLessons.ts` — curated and templated Spanish lessons
- `src/data/germanLessons.ts` — curated and templated German lessons
- `src/data/lessons.ts` — automatic content loading and validation
- `src/lib/audio.ts` — MP3 playback and speech fallback
- `src/lib/scoring.ts` — normalization, edit-distance scoring, and word differences
- `src/App.tsx` — session and exercise UI

No answers are rendered before submission. The sentence must still exist in client-side JavaScript so audio and scoring can work; this prototype is not designed to resist someone inspecting source or browser developer tools.
