import type { Lesson } from '../types'
import { frenchLessons } from './betterLessons'
import { spanishLessons } from './spanishLessons'
import { germanLessons } from './germanLessons'
import frenchBeginner01 from './packs/fr-beginner-01.json'
import frenchBeginner02 from './packs/fr-beginner-02.json'
import frenchBeginner03 from './packs/fr-beginner-03.json'
import frenchBeginner04 from './packs/fr-beginner-04.json'
import spanishBeginner01 from './packs/es-beginner-01.json'
import spanishBeginner02 from './packs/es-beginner-02.json'
import colombianSpanishBeginner01 from './packs/es-co-beginner-01.json'
import latinAmericanLandscapePainter01 from './packs/es-419-beginner-landscape-painter-01.json'
import latinAmericanRecordShop01 from './packs/es-419-beginner-record-shop-01.json'

function loadLessons(): Lesson[] {
  const packedFrenchBeginner = [frenchBeginner01, frenchBeginner02, frenchBeginner03, frenchBeginner04].flatMap((pack) => pack.lessons.map((lesson) => ({ ...lesson, language: 'fr', level: 'beginner' as const, packId: pack.id, packOrder: pack.order }) as Lesson))
  const packedSpanishBeginner = [spanishBeginner01, spanishBeginner02].flatMap((pack) => pack.lessons.map((lesson) => ({ ...lesson, language: 'es', level: 'beginner' as const, packId: pack.id, packOrder: pack.order }) as Lesson))
  const packedColombianSpanishBeginner = [colombianSpanishBeginner01, latinAmericanLandscapePainter01, latinAmericanRecordShop01].flatMap((pack) => pack.lessons.map((lesson) => ({ ...lesson, language: 'es-CO', level: 'beginner' as const, packId: pack.id, packOrder: pack.order }) as Lesson))
  const loaded = [...packedFrenchBeginner, ...packedSpanishBeginner, ...packedColombianSpanishBeginner, ...frenchLessons.filter((lesson) => lesson.level !== 'beginner'), ...spanishLessons.filter((lesson) => lesson.level !== 'beginner'), ...germanLessons]
  const ids = new Set<string>()

  for (const lesson of loaded) {
    if (!lesson.id || !lesson.sentence || !lesson.english || !lesson.audio) {
      throw new Error(`Invalid lesson content near ${lesson.id || 'an unknown lesson'}`)
    }
    if (ids.has(lesson.id)) throw new Error(`Duplicate lesson id: ${lesson.id}`)
    ids.add(lesson.id)
  }

  const expectedCounts: Record<string, Record<Lesson['level'], number>> = {
    fr: { beginner: 100, intermediate: 87, advanced: 71 },
    es: { beginner: 50, intermediate: 87, advanced: 71 },
    'es-CO': { beginner: 75, intermediate: 0, advanced: 0 },
    de: { beginner: 87, intermediate: 87, advanced: 71 }
  }
  for (const language of Object.keys(expectedCounts)) for (const level of ['beginner', 'intermediate', 'advanced'] as const) {
    const count = loaded.filter((lesson) => lesson.language === language && lesson.level === level).length
    const expected = expectedCounts[language][level]
    if (count !== expected) throw new Error(`Expected ${expected} ${language} ${level} lessons, found ${count}`)
  }

  return loaded
}

export const lessons = loadLessons()
