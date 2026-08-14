import { FormEvent, useState } from 'react'
import type { Lesson } from './types'

export interface CustomPack {
  id: string
  language: string
  locale: string
  level: Lesson['level']
  title: string
  description: string
  targetVocabulary: string[]
  scenario: string
  lessons: Lesson[]
}

const examples = ['Shopping for records in Buenos Aires', 'Chatting about landscape painting in France', 'Ordering breakfast in Madrid', 'Meeting my partner’s family in Colombia']

function normalizePack(raw: Omit<CustomPack, 'scenario' | 'lessons'> & { lessons: Array<Omit<Lesson, 'language' | 'level' | 'audio'>> }, scenario: string, offset = 0): CustomPack {
  return {
    ...raw, scenario,
    lessons: raw.lessons.map((lesson, index) => ({ ...lesson, id: `${raw.id}-${offset + index + 1}`, language: raw.locale, level: raw.level, audio: `/audio/custom/${raw.id}/${offset + index + 1}.mp3` }))
  }
}

export function ScenarioBuilder({ onPractice, initialPack = null }: { onPractice: (pack: CustomPack) => void; initialPack?: CustomPack | null }) {
  const [scenario, setScenario] = useState('')
  const [language, setLanguage] = useState('auto')
  const [level, setLevel] = useState<Lesson['level']>('beginner')
  const [pack, setPack] = useState<CustomPack | null>(initialPack)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const requestPack = async (more = false) => {
    setLoading(true); setError('')
    try {
      const response = await fetch('/api/generate-pack', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ scenario: pack?.scenario ?? scenario, language, level, existingSentences: more ? pack?.lessons.map((lesson) => lesson.sentence) : [] }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error ?? 'Could not generate this pack.')
      const generated = normalizePack(data, pack?.scenario ?? scenario, more ? pack?.lessons.length ?? 0 : 0)
      const next = more && pack ? { ...pack, targetVocabulary: [...new Set([...pack.targetVocabulary, ...generated.targetVocabulary])], lessons: [...pack.lessons, ...generated.lessons] } : generated
      setPack(next)
      localStorage.setItem(`echo-custom-pack-${next.id}`, JSON.stringify(next))
    } catch (problem) { setError(problem instanceof Error ? problem.message : 'Could not generate this pack.') }
    finally { setLoading(false) }
  }

  const submit = (event: FormEvent) => { event.preventDefault(); if (scenario.trim()) void requestPack() }

  return <main className="scenario-page">
    {!pack ? <>
      <p className="eyebrow">Practice anything</p>
      <h1>Listening exercises on any topic and language.</h1>
      <p className="scenario-intro">Describe a real situation. Echo will create 25 natural phrases to help you understand what you’re likely to hear.</p>
      <form className="scenario-form" onSubmit={submit}>
        <label>Type a scenario to start practicing
          <textarea rows={3} value={scenario} onChange={(event) => setScenario(event.target.value)} placeholder="Shopping for records in Buenos Aires" maxLength={300} />
        </label>
        <div className="scenario-options">
          <label>Language<select value={language} onChange={(event) => setLanguage(event.target.value)}>
            <option value="auto">Auto-detect</option><option value="fr-FR">French</option><option value="es-ES">Spanish — Spain</option><option value="es-419">Spanish — Latin America</option><option value="de-DE">German</option><option value="it-IT">Italian</option><option value="ja-JP">Japanese</option>
          </select></label>
          <label>Level<select value={level} onChange={(event) => setLevel(event.target.value as Lesson['level'])}><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></label>
        </div>
        <button className="primary" type="submit" disabled={loading || scenario.trim().length < 5}>{loading ? 'Creating 25 exercises…' : 'Create exercises'}</button>
        <p className="scenario-review-note">Submitted scenarios may be reviewed by the Echo administrator to improve the experience. Don’t include private or identifying information.</p>
      </form>
      <div className="scenario-examples"><span>Try an example</span>{examples.map((example) => <button type="button" key={example} onClick={() => setScenario(example)}>{example}</button>)}</div>
    </> : <section className="generated-pack">
      <p className="eyebrow">Your custom practice</p><h1>{pack.title}</h1><p>{pack.description}</p>
      <div className="pack-facts"><span>{pack.locale}</span><span>{pack.level}</span><span>{pack.lessons.length} exercises</span></div>
      <button className="primary" type="button" onClick={() => onPractice(pack)}>Start practicing</button>
      <div className="pack-vocabulary">
        <h2>Vocabulary in this pack</h2>
        <div>{pack.targetVocabulary.map((word) => <span key={word}>{word}</span>)}</div>
      </div>
      <button className="secondary" type="button" disabled={loading} onClick={() => void requestPack(true)}>{loading ? 'Generating…' : 'Generate 25 more'}</button>
      <button className="text-button" type="button" onClick={() => setPack(null)}>Try another scenario</button>
    </section>}
    {error && <p className="generation-error" role="alert">{error}</p>}
  </main>
}

export function CustomPackLibrary({ onPractice }: { onPractice: (pack: CustomPack) => void }) {
  const [packs, setPacks] = useState<CustomPack[]>(() => Object.keys(localStorage)
    .filter((key) => key.startsWith('echo-custom-pack-'))
    .flatMap((key) => { try { return [JSON.parse(localStorage.getItem(key) ?? '') as CustomPack] } catch { return [] } })
    .sort((a, b) => a.title.localeCompare(b.title)))

  const remove = (pack: CustomPack) => {
    localStorage.removeItem(`echo-custom-pack-${pack.id}`)
    setPacks((current) => current.filter((candidate) => candidate.id !== pack.id))
  }

  return <main className="scenario-page pack-library">
    <p className="eyebrow">Saved on this device</p><h1>My packs</h1>
    {packs.length ? <div className="saved-packs">{packs.map((pack) => <article key={pack.id}>
      <div><h2>{pack.title}</h2><p>{pack.description}</p><div className="pack-facts"><span>{pack.locale}</span><span>{pack.level}</span><span>{pack.lessons.length} exercises</span></div></div>
      <div className="saved-pack-actions"><button className="primary" type="button" onClick={() => onPractice(pack)}>Practice</button><button className="text-button" type="button" onClick={() => remove(pack)}>Remove</button></div>
    </article>)}</div> : <div className="empty-library"><h2>No saved packs yet</h2><p>Create a scenario and it will appear here automatically.</p></div>}
  </main>
}
