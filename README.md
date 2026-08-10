# Echo v0.1

Echo is a small, local listening-first language-learning prototype. Each session presents 10 shuffled phrases from a 1,350-phrase French, Spanish, and German library and follows a simple loop: listen, type what you heard, translate, check, listen again, and continue. Each language includes 150 beginner, 150 intermediate, and 150 advanced phrases.

Session selection is variety-aware: it avoids placing phrases from the same sentence family or topic next to one another when possible, and Mixed sessions also alternate levels when possible.

Dictation and translation are scored separately. Translation match is an approximate wording comparison, not semantic grading, so alternate valid translations can score lower than the expected phrasing.

## Run locally

Requires a current Node.js LTS release.

```bash
npm install
npm run dev
```

Open the URL Vite prints (normally <http://localhost:5173>).

For a production build check:

```bash
npm run build
npm run preview
```

## Deploy to Render

Echo includes a `render.yaml` Blueprint for a free Render Static Site. Connect the repository in Render and create a Blueprint, or configure a Static Site manually with:

```text
Build command: npm ci && npm run build
Publish directory: dist
```

## Audio

Place lesson recordings under `public/audio/fr/<level>/`, matching each lesson's `audio` field. Echo prefers those recordings. If a file is absent, it tries the browser SpeechSynthesis API with an `fr-FR` voice. Available voices and pronunciation vary by browser and operating system; voices may load asynchronously, and some browsers may not expose a French voice at all.

## Project structure

- `src/data/content/fr/*.json` — local lesson packs, currently beginner, intermediate, and advanced
- `src/data/expandedLessons.ts` — maintainable phrase families used to expand each level to 150
- `src/data/spanishLessons.ts` — 150 phrases per Spanish level
- `src/data/germanLessons.ts` — 150 phrases per German level
- `src/data/lessons.ts` — automatic content loading and validation
- `src/lib/audio.ts` — MP3 playback and speech fallback
- `src/lib/scoring.ts` — normalization, edit-distance scoring, and word differences
- `src/App.tsx` — session and exercise UI

No answers are rendered before submission. The sentence must still exist in client-side JavaScript so audio and scoring can work; this prototype is not designed to resist someone inspecting source or browser developer tools.
