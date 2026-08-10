import { FormEvent, useMemo, useState } from 'react'
import { lessons } from './data/lessons'
import { useLessonAudio } from './lib/audio'
import { diffWords, scoreAnswer } from './lib/scoring'
import type { Lesson } from './types'

const SESSION_LENGTH = 10
type LevelChoice = Lesson['level'] | 'mixed'
interface ExerciseResult { dictation: number; translation: number }

function shuffle<T>(items: T[]): T[] {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[swapIndex]] = [result[swapIndex], result[index]]
  }
  return result
}

function phraseFamily(lesson: Lesson): string {
  const generated = lesson.id.match(/^fr-(?:beginner|intermediate|advanced)-([a-z]+)-(\d+)$/)
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

function Exercise({ lesson, position, onComplete }: { lesson: Lesson; position: number; onComplete: (result: ExerciseResult) => void }) {
  const [dictation, setDictation] = useState('')
  const [translation, setTranslation] = useState('')
  const [checked, setChecked] = useState(false)
  const [speed, setSpeed] = useState(1)
  const dictationScore = checked ? scoreAnswer(dictation, lesson.sentence) : 0
  const translationScore = checked ? scoreAnswer(translation, lesson.english) : 0
  const { play, togglePause, state, playbackState } = useLessonAudio(lesson.audio, lesson.sentence, lesson.language, speed)

  const submit = (event: FormEvent) => { event.preventDefault(); if (dictation.trim() && translation.trim()) setChecked(true) }

  return <main className="card">
    <header className="exercise-header"><span>Exercise {position + 1} of {SESSION_LENGTH}</span><span className="language">French · {lesson.level}</span></header>
    <section className="listening" aria-label="Audio controls">
      <button className="play" type="button" onClick={() => void play()} aria-label="Play exercise audio"><span aria-hidden="true">▶</span> Play</button>
      <div className="audio-options">
        <button className="quiet-button" type="button" onClick={() => void play()}>↻ Replay</button>
        <button className="quiet-button" type="button" disabled={playbackState === 'idle'} onClick={() => void togglePause()}>{playbackState === 'paused' ? '▶ Resume' : 'Ⅱ Pause'}</button>
        <div className="speed" aria-label="Playback speed">
          {[0.6, 0.8, 1].map((value) => <button type="button" className={speed === value ? 'selected' : ''} onClick={() => setSpeed(value)} key={value}>{value.toFixed(1)}×</button>)}
        </div>
      </div>
      {state === 'speech' && <p className="audio-status">Using your browser’s French voice</p>}
      {state === 'unavailable' && <p className="audio-status error">Audio not available yet.</p>}
    </section>

    <form onSubmit={submit}>
      <label>What did you hear?<textarea value={dictation} onChange={(event) => setDictation(event.target.value)} disabled={checked} autoCapitalize="none" spellCheck={false} placeholder="Type the French you heard…" /></label>
      <label>What does it mean?<textarea value={translation} onChange={(event) => setTranslation(event.target.value)} disabled={checked} placeholder="Type your English translation…" /></label>
      {!checked && <button className="primary" disabled={!dictation.trim() || !translation.trim()} type="submit">Check Answer</button>}
    </form>

    {checked && <section className="feedback" aria-live="polite">
      <div className="score-pair">
        <div className="score"><span>Dictation score</span><strong>{dictationScore}%</strong></div>
        <div className="score"><span>Translation match <small>approximate</small></span><strong>{translationScore}%</strong></div>
      </div>
      <div className="answer-block">
        <div className="answer-heading"><h2>What was said</h2><button className="inline-replay" type="button" onClick={() => void play()} aria-label="Replay exercise audio">↻ Replay</button></div>
        <p lang="fr">{lesson.sentence}</p><p className="translation">{lesson.english}</p>
      </div>
      <div className="answer-block"><h2>Your dictation</h2><div className="diff" aria-label="Dictation differences">
        {diffWords(dictation, lesson.sentence).map((token, index) => <span className={token.kind} key={`${token.text}-${index}`}>{token.text}</span>)}
      </div><div className="legend"><span className="missing">missing</span><span className="incorrect">changed</span><span className="extra">extra</span></div></div>
      <div className="answer-block"><h2>Your translation</h2><div className="diff" aria-label="Translation differences">
        {diffWords(translation, lesson.english).map((token, index) => <span className={token.kind} key={`${token.text}-${index}`}>{token.text}</span>)}
      </div><p className="match-note">Wording overlap: {translationScore}%. This is a text comparison, not a judgment of meaning.</p></div>
      <button className="primary" type="button" onClick={() => onComplete({ dictation: dictationScore, translation: translationScore })}>Next Sentence <span aria-hidden="true">→</span></button>
    </section>}
  </main>
}

export default function App() {
  const [sessionKey, setSessionKey] = useState(0)
  const [level, setLevel] = useState<LevelChoice>('beginner')
  const session = useMemo(() => {
    const pool = level === 'mixed' ? lessons : lessons.filter((lesson) => lesson.level === level)
    return variedSession(pool, level === 'mixed')
  }, [level, sessionKey])
  const [position, setPosition] = useState(0)
  const [scores, setScores] = useState<ExerciseResult[]>([])

  const next = (result: ExerciseResult) => { setScores((current) => [...current, result]); setPosition((current) => current + 1) }
  const restart = () => { setPosition(0); setScores([]); setSessionKey((key) => key + 1) }
  const changeLevel = (choice: LevelChoice) => { setLevel(choice); setPosition(0); setScores([]); setSessionKey((key) => key + 1) }
  const finished = position >= session.length
  const dictationAverage = scores.length ? Math.round(scores.reduce((sum, result) => sum + result.dictation, 0) / scores.length) : 0
  const translationAverage = scores.length ? Math.round(scores.reduce((sum, result) => sum + result.translation, 0) / scores.length) : 0

  return <div className="app-shell">
    <nav>
      <div className="brand"><span className="brand-mark" aria-hidden="true">◖</span> echo</div>
      <label className="level-picker">Level
        <select value={level} onChange={(event) => changeLevel(event.target.value as LevelChoice)}>
          <option value="mixed">Mixed</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </label>
    </nav>
    {finished ? <main className="card summary">
      <p className="eyebrow">Session complete</p><h1>Nice listening.</h1><p className="summary-copy">Take a breath. Notice what felt clearer on the second listen. Your next session will use the {level} phrase collection.</p>
      <div className="summary-grid"><div><strong>{dictationAverage}%</strong><span>Average dictation</span></div><div><strong>{translationAverage}%</strong><span>Translation match</span></div><div><strong>{scores.length}</strong><span>Exercises completed</span></div></div>
      <button className="primary" type="button" onClick={restart}>Start Another Session</button>
    </main> : <Exercise key={session[position].id} lesson={session[position]} position={position} onComplete={next} />}
    <footer>Hear it. Understand it. Make it yours.</footer>
  </div>
}
