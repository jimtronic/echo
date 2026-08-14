import { FormEvent, useMemo, useState } from 'react'
import { lessons } from './data/lessons'
import { useLessonAudio } from './lib/audio'
import { diffWords, scoreAnswer } from './lib/scoring'
import type { Lesson } from './types'

const SESSION_LENGTH = 10
type LevelChoice = Lesson['level'] | 'mixed'
type LanguageChoice = 'fr' | 'es' | 'es-CO' | 'de'
type ExerciseMode = 'dictation' | 'translation'
interface ExerciseResult { score: number }
interface CourseProgress { seen: string[]; packSessions: Record<number, number>; unlockedPack: number }

function shuffle<T>(items: T[]): T[] {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[swapIndex]] = [result[swapIndex], result[index]]
  }
  return result
}

function phraseFamily(lesson: Lesson): string {
  const generated = lesson.id.match(/^(?:fr|es|de)-(?:beginner|intermediate|advanced)-([a-z]+)-(\d+)$/)
  if (!generated) return lesson.id
  const templateGroup = Math.floor((Number(generated[2]) - 1) / 15)
  return `${lesson.level}-${generated[1]}-${templateGroup}`
}

function variedSession(pool: Lesson[], mixed: boolean): Lesson[] {
  const remaining = shuffle(pool)
  const selected: Lesson[] = []

  while (selected.length < SESSION_LENGTH && remaining.length) {
    const previous = selected.at(-1)
    const idealIndex = remaining.findIndex((candidate) => {
      if (!previous) return true
      const changesFamily = phraseFamily(candidate) !== phraseFamily(previous)
      const changesTopic = candidate.topics[0] !== previous.topics[0]
      const changesLevel = !mixed || candidate.level !== previous.level
      return changesFamily && changesTopic && changesLevel
    })
    const fallbackIndex = remaining.findIndex((candidate) => !previous || phraseFamily(candidate) !== phraseFamily(previous))
    const index = idealIndex >= 0 ? idealIndex : Math.max(fallbackIndex, 0)
    selected.push(remaining.splice(index, 1)[0])
  }

  return selected
}

function Exercise({ lesson, position, mode, onComplete, onEncounter }: { lesson: Lesson; position: number; mode: ExerciseMode; onComplete: (result: ExerciseResult) => void; onEncounter: () => void }) {
  const [dictation, setDictation] = useState('')
  const [translation, setTranslation] = useState('')
  const [checked, setChecked] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [showVoiceHelp, setShowVoiceHelp] = useState(false)
  const [voiceHelpPlatform, setVoiceHelpPlatform] = useState<'mac' | 'iphone'>('mac')
  const dictationScore = checked ? scoreAnswer(dictation, lesson.sentence) : 0
  const translationOptions = [lesson.english, ...(lesson.acceptedTranslations ?? [])]
  const bestTranslation = translationOptions.reduce((best, option) => scoreAnswer(translation, option) > scoreAnswer(translation, best) ? option : best, lesson.english)
  const translationScore = checked ? scoreAnswer(translation, bestTranslation) : 0
  const activeScore = mode === 'dictation' ? dictationScore : translationScore
  const { play, togglePause, state, playbackState, voices, selectedVoice, setSelectedVoice } = useLessonAudio(lesson.audio, lesson.sentence, lesson.language, speed)
  const languageName = lesson.language === 'es-CO' ? 'Latin American Spanish' : lesson.language === 'es' ? 'Spanish' : lesson.language === 'de' ? 'German' : 'French'
  const localeName = lesson.language === 'es-CO' ? 'Spanish (Colombia)' : lesson.language === 'es' ? 'Spanish (Spain)' : lesson.language === 'de' ? 'German (Germany)' : 'French (France)'

  const submit = (event: FormEvent) => { event.preventDefault(); setChecked(true); onEncounter() }

  return <main className="card">
    <header className="exercise-header"><span>Exercise {position + 1} of {SESSION_LENGTH}</span><span className="language">{languageName} · {lesson.level}</span></header>
    <section className="listening" aria-label="Audio controls">
      <div className="play-row">
        <button className="play" type="button" onClick={() => void play()} aria-label="Play exercise audio"><span aria-hidden="true">▶</span> Play</button>
        {checked && <button className="top-next" type="button" onClick={() => onComplete({ score: activeScore })}>Next <span aria-hidden="true">→</span></button>}
      </div>
      <div className="audio-options">
        <button className="quiet-button" type="button" onClick={() => void play()}>↻ Replay</button>
        <button className="quiet-button" type="button" disabled={playbackState === 'idle'} onClick={() => void togglePause()}>{playbackState === 'paused' ? '▶ Resume' : 'Ⅱ Pause'}</button>
        <div className="speed" aria-label="Playback speed">
          {[0.6, 0.8, 1].map((value) => <button type="button" className={speed === value ? 'selected' : ''} onClick={() => setSpeed(value)} key={value}>{value.toFixed(1)}×</button>)}
        </div>
      </div>
      {state === 'speech' && <div className="voice-choice">
        <label>Voice
          <select value={selectedVoice} onChange={(event) => setSelectedVoice(event.target.value)} aria-label={`${languageName} voice`}>
            <option value="">Browser default</option>
            {voices.map((voice) => <option value={voice.voiceURI} key={voice.voiceURI}>{voice.name} · {voice.lang}{voice.localService ? '' : ' · online'}</option>)}
          </select>
        </label>
        <button type="button" onClick={() => { setVoiceHelpPlatform(/iPhone|iPad/i.test(navigator.userAgent) ? 'iphone' : 'mac'); setShowVoiceHelp(true) }}>Get more voices</button>
      </div>}
      {state === 'unavailable' && <p className="audio-status error">Audio not available yet.</p>}
    </section>

    <form onSubmit={submit}>
      {!checked && (mode === 'dictation' ?
        <label>What did you hear?<textarea rows={2} value={dictation} onChange={(event) => setDictation(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit() } }} disabled={checked} autoCapitalize="none" spellCheck={false} placeholder={`Type the ${languageName} you heard…`} /></label> :
        <label>What does it mean?<textarea rows={2} value={translation} onChange={(event) => setTranslation(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit() } }} disabled={checked} placeholder="Type your English translation…" /></label>)}
      {checked && <div className="answer-result" aria-live="polite">
        <div className="corrected-answer">
          <h2>{mode === 'dictation' ? 'What did you hear?' : 'What does it mean?'}</h2>
          <div className="diff" aria-label={mode === 'dictation' ? 'Dictation differences' : 'Translation differences'}>
            {diffWords(mode === 'dictation' ? dictation : translation, mode === 'dictation' ? lesson.sentence : bestTranslation).map((token, index) => <span className={token.kind} key={`${token.text}-${index}`}>{token.text}</span>)}
          </div>
          {mode === 'dictation' ? <div className="legend"><span className="missing">missing</span><span className="incorrect">changed</span><span className="extra">extra</span></div> :
            <p className="match-note">Text comparison only; natural alternative wording may score lower.</p>}
        </div>
        <div className="compact-score"><strong>{activeScore}%</strong><span>{mode === 'dictation' ? 'Dictation' : 'Match'}</span></div>
      </div>}
      {!checked && <button className="primary" type="submit">Check Answer</button>}
    </form>

    {checked && <section className="feedback" aria-live="polite">
      <div className="answer-block">
        <div className="answer-heading"><h2>What was said</h2><button className="inline-replay" type="button" onClick={() => void play()} aria-label="Replay exercise audio">↻ Replay</button></div>
        <p lang={lesson.language}>{lesson.sentence}</p><p className="translation">{lesson.english}</p>
      </div>
      {lesson.notes.length > 0 && <aside className="lesson-notes">
        <h2>Language notes</h2>
        <ul>{lesson.notes.map((note) => <li key={note}>{note}</li>)}</ul>
      </aside>}
      <button className="primary" type="button" onClick={() => onComplete({ score: activeScore })}>Next Sentence <span aria-hidden="true">→</span></button>
    </section>}
    {showVoiceHelp && <div className="modal-backdrop" role="presentation" onMouseDown={() => setShowVoiceHelp(false)}>
      <section className="voice-modal" role="dialog" aria-modal="true" aria-labelledby="voice-help-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="modal-close" type="button" aria-label="Close voice instructions" onClick={() => setShowVoiceHelp(false)}>×</button>
        <div className="platform-tabs" aria-label="Device instructions">
          <button type="button" className={voiceHelpPlatform === 'mac' ? 'selected' : ''} onClick={() => setVoiceHelpPlatform('mac')}>Chrome on Mac</button>
          <button type="button" className={voiceHelpPlatform === 'iphone' ? 'selected' : ''} onClick={() => setVoiceHelpPlatform('iphone')}>iPhone</button>
        </div>
        <h2 id="voice-help-title">Download a better {languageName} voice</h2>
        {voiceHelpPlatform === 'mac' ? <>
          <ol>
            <li>Open <strong>System Settings</strong> on your Mac.</li>
            <li>Choose <strong>Accessibility → Read &amp; Speak</strong>.</li>
            <li>Set <strong>System speech language</strong> to {localeName}.</li>
            <li>Open <strong>System voice</strong>, then choose <strong>Manage Voices</strong>.</li>
            <li>Expand {localeName}, preview the voices, and download the one you prefer.</li>
            <li>Fully quit Chrome with <strong>⌘Q</strong>, reopen it, and return to Echo.</li>
          </ol>
          <p className="modal-note">Chrome receives voices from macOS. Echo will prefer an installed {localeName} voice after Chrome restarts.</p>
        </> : <>
          <ol>
            <li>Connect your iPhone to <strong>Wi-Fi</strong>.</li>
            <li>Open <strong>Settings → Accessibility → Read &amp; Speak</strong>. On some iOS versions this is called <strong>Spoken Content</strong>.</li>
            <li>Tap <strong>Voices → {languageName} → {localeName}</strong>.</li>
            <li>Preview the available voices and tap the download button beside an <strong>Enhanced</strong> or higher-quality voice.</li>
            <li>Wait for the download to finish, then close and reopen your browser before returning to Echo.</li>
          </ol>
          <p className="modal-note">Enhanced voices can be 100 MB or larger. Chrome and Safari on iPhone both use voices installed by iOS.</p>
        </>}
        <button className="primary" type="button" onClick={() => setShowVoiceHelp(false)}>Got it</button>
      </section>
    </div>}
  </main>
}

export default function App() {
  const [sessionKey, setSessionKey] = useState(0)
  const [language, setLanguage] = useState<LanguageChoice>('fr')
  const [level, setLevel] = useState<LevelChoice>('beginner')
  const [mode, setMode] = useState<ExerciseMode>('dictation')
  const [packOrder, setPackOrder] = useState(1)
  const [progress, setProgress] = useState<CourseProgress>(() => {
    try { const saved = JSON.parse(localStorage.getItem('echo-progress-fr-beginner') ?? ''); return { seen: saved.seen ?? [], packSessions: saved.packSessions ?? { 1: saved.sessions ?? 0 }, unlockedPack: saved.unlockedPack ?? 1 } }
    catch { return { seen: [], packSessions: {}, unlockedPack: 1 } }
  })
  const [spanishProgress, setSpanishProgress] = useState<CourseProgress>(() => {
    try { const saved = JSON.parse(localStorage.getItem('echo-progress-es-beginner') ?? ''); return { seen: saved.seen ?? [], packSessions: saved.packSessions ?? {}, unlockedPack: saved.unlockedPack ?? 1 } }
    catch { return { seen: [], packSessions: {}, unlockedPack: 1 } }
  })
  const [colombianProgress, setColombianProgress] = useState<CourseProgress>(() => {
    try { const saved = JSON.parse(localStorage.getItem('echo-progress-es-CO-beginner') ?? ''); return { seen: saved.seen ?? [], packSessions: saved.packSessions ?? {}, unlockedPack: saved.unlockedPack ?? 1 } }
    catch { return { seen: [], packSessions: {}, unlockedPack: 1 } }
  })
  const isPackedCourse = (language === 'fr' || language === 'es' || language === 'es-CO') && level === 'beginner'
  const activeProgress = language === 'es' ? spanishProgress : language === 'es-CO' ? colombianProgress : progress
  const maxPack = language === 'fr' ? 4 : language === 'es-CO' ? 3 : 2
  const session = useMemo(() => {
    const languagePool = lessons.filter((lesson) => lesson.language === language)
    let pool = level === 'mixed' ? languagePool : languagePool.filter((lesson) => lesson.level === level)
    if (isPackedCourse) {
      pool = pool.filter((lesson) => lesson.packOrder === packOrder)
      const seen = activeProgress.seen
      const unseen = pool.filter((lesson) => !seen.includes(lesson.id))
      if (unseen.length >= SESSION_LENGTH) pool = unseen
    }
    return variedSession(pool, level === 'mixed')
  }, [language, level, packOrder, sessionKey])
  const [position, setPosition] = useState(0)
  const [scores, setScores] = useState<ExerciseResult[]>([])

  const next = (result: ExerciseResult) => {
    setScores((current) => [...current, result])
    if (isPackedCourse) {
      const seen = [...new Set([...activeProgress.seen, session[position].id])]
      const packSessions = { ...activeProgress.packSessions, [packOrder]: (activeProgress.packSessions[packOrder] ?? 0) + (position === session.length - 1 ? 1 : 0) }
      const packSeen = lessons.filter((lesson) => lesson.language === language && lesson.level === 'beginner' && lesson.packOrder === packOrder && seen.includes(lesson.id)).length
      const unlockedPack = packSeen >= 20 && packSessions[packOrder] >= 2 ? Math.max(activeProgress.unlockedPack, Math.min(packOrder + 1, maxPack)) : activeProgress.unlockedPack
      const updated = { seen, packSessions, unlockedPack }
      if (language === 'es') setSpanishProgress(updated); else if (language === 'es-CO') setColombianProgress(updated); else setProgress(updated)
      localStorage.setItem(`echo-progress-${language}-beginner`, JSON.stringify(updated))
    }
    setPosition((current) => current + 1)
  }
  const encounter = () => {
    if (!isPackedCourse) return
    const seen = [...new Set([...activeProgress.seen, session[position].id])]
    const updated = { ...activeProgress, seen }
    if (language === 'es') setSpanishProgress(updated); else if (language === 'es-CO') setColombianProgress(updated); else setProgress(updated)
    localStorage.setItem(`echo-progress-${language}-beginner`, JSON.stringify(updated))
  }
  const restart = () => { setPosition(0); setScores([]); setSessionKey((key) => key + 1) }
  const changeLevel = (choice: LevelChoice) => { setLevel(choice); setPosition(0); setScores([]); setSessionKey((key) => key + 1) }
  const changeLanguage = (choice: LanguageChoice) => { setLanguage(choice); if (choice === 'es-CO') setLevel('beginner'); setPackOrder(1); setPosition(0); setScores([]); setSessionKey((key) => key + 1) }
  const changeMode = (choice: ExerciseMode) => { setMode(choice); setPosition(0); setScores([]); setSessionKey((key) => key + 1) }
  const finished = position >= session.length
  const averageScore = scores.length ? Math.round(scores.reduce((sum, result) => sum + result.score, 0) / scores.length) : 0
  const currentPackSeen = lessons.filter((lesson) => lesson.language === language && lesson.level === 'beginner' && lesson.packOrder === packOrder && activeProgress.seen.includes(lesson.id)).length
  const currentPackSessions = activeProgress.packSessions[packOrder] ?? 0

  return <div className="app-shell">
    <nav>
      <div className="brand"><span className="brand-mark" aria-hidden="true">◖</span> echo</div>
      <div className="session-pickers"><label className="level-picker">Language
        <select value={language} onChange={(event) => changeLanguage(event.target.value as LanguageChoice)}>
          <option value="fr">French</option>
          <option value="es">Spanish (Spain)</option>
          <option value="es-CO">Spanish (Latin America)</option>
          <option value="de">German</option>
        </select>
      </label><label className="level-picker">Exercise
        <select value={mode} onChange={(event) => changeMode(event.target.value as ExerciseMode)}>
          <option value="dictation">Dictation</option>
          <option value="translation">Translation</option>
        </select>
      </label><label className="level-picker">Level
        <select value={level} onChange={(event) => changeLevel(event.target.value as LevelChoice)}>
          <option value="mixed" disabled={language === 'es-CO'}>Mixed</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate" disabled={language === 'es-CO'}>Intermediate</option>
          <option value="advanced" disabled={language === 'es-CO'}>Advanced</option>
        </select>
      </label>{isPackedCourse && <label className="level-picker">Pack
        <select value={packOrder} onChange={(event) => { setPackOrder(Number(event.target.value)); setPosition(0); setScores([]); setSessionKey((key) => key + 1) }}>
          <option value="1">1 · Introductions</option>
          {language === 'fr' && <>
            <option value="2">2 · Café</option>
            <option value="3">3 · Shopping</option>
            <option value="4">4 · Transport</option>
          </>}
          {language === 'es' && <option value="2">2 · Café</option>}
          {language === 'es-CO' && <option value="2">2 · Landscape painting</option>}
          {language === 'es-CO' && <option value="3">3 · Record shopping</option>}
        </select>
      </label>}</div>
    </nav>
    {finished ? <main className="card summary">
      <p className="eyebrow">Session complete</p><h1>Nice listening.</h1><p className="summary-copy">Take a breath. Notice what felt clearer on the second listen. Your next session will use the {level} {language === 'es-CO' ? 'Latin American Spanish' : language === 'es' ? 'Spanish' : language === 'de' ? 'German' : 'French'} phrase collection.</p>
      {isPackedCourse && <p className="course-progress">Pack {packOrder} · {currentPackSeen} of 25 encountered · {currentPackSessions} sessions<br />All packs are available.</p>}
      <div className="summary-grid"><div><strong>{averageScore}%</strong><span>{mode === 'dictation' ? 'Average dictation' : 'Translation match'}</span></div><div><strong>{scores.length}</strong><span>Exercises completed</span></div></div>
      <button className="primary" type="button" onClick={restart}>Start Another Session</button>
    </main> : <Exercise key={`${session[position].id}-${mode}`} lesson={session[position]} position={position} mode={mode} onComplete={next} onEncounter={encounter} />}
    <footer>Hear it. Understand it. Make it yours.</footer>
  </div>
}
