import type { Lesson } from '../types'
import { frenchLessons } from './betterLessons'
import { spanishLessons } from './spanishLessons'
import { germanLessons } from './germanLessons'

function loadLessons(): Lesson[] {
  const loaded = [...frenchLessons, ...spanishLessons, ...germanLessons]
  const ids = new Set<string>()

  for (const lesson of loaded) {
    if (!lesson.id || !lesson.sentence || !lesson.english || !lesson.audio) {
      throw new Error(`Invalid lesson content near ${lesson.id || 'an unknown lesson'}`)
    }
    if (ids.has(lesson.id)) throw new Error(`Duplicate lesson id: ${lesson.id}`)
    ids.add(lesson.id)
  }

  const expectedCounts: Record<string, Record<Lesson['level'], number>> = {
    fr: { beginner: 87, intermediate: 87, advanced: 71 },
    es: { beginner: 150, intermediate: 150, advanced: 150 },
    de: { beginner: 150, intermediate: 150, advanced: 150 }
  }
  for (const language of Object.keys(expectedCounts)) for (const level of ['beginner', 'intermediate', 'advanced'] as const) {
    const count = loaded.filter((lesson) => lesson.language === language && lesson.level === level).length
    const expected = expectedCounts[language][level]
    if (count !== expected) throw new Error(`Expected ${expected} ${language} ${level} lessons, found ${count}`)
  }

  return loaded
}

export const lessons = loadLessons()
