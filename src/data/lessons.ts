import type { Lesson } from '../types'
import { expandedLessons } from './expandedLessons'

const modules = import.meta.glob<{ default: Lesson[] }>('./content/fr/*.json', { eager: true })

function loadLessons(): Lesson[] {
  const loaded = [...Object.values(modules).flatMap((module) => module.default), ...expandedLessons]
  const ids = new Set<string>()

  for (const lesson of loaded) {
    if (!lesson.id || !lesson.sentence || !lesson.english || !lesson.audio) {
      throw new Error(`Invalid lesson content near ${lesson.id || 'an unknown lesson'}`)
    }
    if (ids.has(lesson.id)) throw new Error(`Duplicate lesson id: ${lesson.id}`)
    ids.add(lesson.id)
  }

  for (const level of ['beginner', 'intermediate', 'advanced'] as const) {
    const count = loaded.filter((lesson) => lesson.level === level).length
    if (count !== 150) throw new Error(`Expected 150 ${level} lessons, found ${count}`)
  }

  return loaded
}

export const lessons = loadLessons()
