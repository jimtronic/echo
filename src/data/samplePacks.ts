import type { CustomPack } from '../ScenarioBuilder'
import type { Lesson } from '../types'
import frenchTransport from './packs/fr-beginner-04.json'
import spanishCafe from './packs/es-beginner-02.json'
import latinAmericanPainting from './packs/es-419-beginner-landscape-painter-01.json'
import { germanLessons } from './germanLessons'

type RawPack = {
  id: string
  language: string
  locale: string
  level: Lesson['level']
  title: string
  description?: string
  targetVocabulary?: string[]
  lessons: Array<Omit<Lesson, 'language' | 'level'> & { kind?: string }>
}

function fromCoursePack(raw: RawPack, scenario: string, description?: string, targetVocabulary?: string[]): CustomPack {
  return {
    id: `sample-${raw.id}`,
    language: raw.language,
    locale: raw.locale,
    level: raw.level,
    title: raw.title,
    description: raw.description ?? description ?? '',
    targetVocabulary: raw.targetVocabulary ?? targetVocabulary ?? [],
    scenario,
    lessons: raw.lessons.map((lesson) => ({
      ...lesson,
      kind: lesson.kind === 'construction' ? 'construction' : 'curated',
      language: raw.locale,
      level: raw.level,
    })),
  }
}

const germanNatural = germanLessons.filter((lesson) => lesson.level === 'beginner' && lesson.id.includes('-natural-'))
const germanPractical = germanLessons.filter((lesson) => lesson.level === 'beginner' && [
  'einen Kaffee trinken', 'das Museum besuchen', 'Brot kaufen', 'den Zug nehmen', 'einen Tisch reservieren',
  'Deutsch lernen', 'einkaufen gehen', 'nach Hause fahren', 'ein Hotel suchen', 'mit Karte bezahlen',
].some((phrase) => lesson.sentence.includes(phrase))).slice(0, 10)

const germanTravel: CustomPack = {
  id: 'sample-de-beginner-everyday-travel-01',
  language: 'de',
  locale: 'de-DE',
  level: 'beginner',
  title: 'Everyday travel in Germany',
  description: 'Practical beginner phrases for getting around, eating out, shopping, and asking for help in Germany.',
  targetVocabulary: ['bitte', 'Bahnhof', 'Zug', 'Kaffee', 'reservieren', 'kosten', 'zu Fuß', 'verstehen', 'wiederholen', 'bezahlen'],
  scenario: 'Everyday travel in Germany',
  lessons: [...germanNatural, ...germanPractical].slice(0, 25).map((lesson) => ({ ...lesson, language: 'de-DE' })),
}

export const samplePacks: CustomPack[] = [
  fromCoursePack(
    frenchTransport as RawPack,
    'Getting around France by train and bus',
    'Natural phrases for asking directions and traveling around France by foot, train, bus, taxi, or bike.',
    ['où', 'gare', 'arrêt', 'train', 'bus', 'billet', 'à pied', 'tout droit', 'à gauche', 'à droite', 'loin', 'près'],
  ),
  fromCoursePack(spanishCafe as RawPack, 'Ordering at a café in Madrid'),
  fromCoursePack(latinAmericanPainting as RawPack, 'Chatting about landscape painting in Latin America'),
  germanTravel,
]
