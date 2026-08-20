import type { Lesson } from '../types'

interface PackDeck {
  remainingIds: string[]
}

const key = (packId: string) => `echo-pack-deck-${packId}`

function shuffle<T>(items: T[]): T[] {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[swapIndex]] = [result[swapIndex], result[index]]
  }
  return result
}

function loadDeck(packId: string): PackDeck {
  try {
    const deck = JSON.parse(localStorage.getItem(key(packId)) ?? '{}') as PackDeck
    return { remainingIds: Array.isArray(deck.remainingIds) ? deck.remainingIds : [] }
  } catch {
    return { remainingIds: [] }
  }
}

export function dealPackSession(packId: string, lessons: Lesson[], count: number): Lesson[] {
  const lessonById = new Map(lessons.map((lesson) => [lesson.id, lesson]))
  const validRemaining = loadDeck(packId).remainingIds.filter((id) => lessonById.has(id))
  const queued = new Set(validRemaining)
  let remainingIds = [...validRemaining, ...shuffle(lessons.map((lesson) => lesson.id).filter((id) => !queued.has(id)))]
  const selectedIds: string[] = []

  while (selectedIds.length < count && lessons.length) {
    if (!remainingIds.length) {
      const selected = new Set(selectedIds)
      remainingIds = shuffle(lessons.map((lesson) => lesson.id).filter((id) => !selected.has(id)))
      if (!remainingIds.length) break
    }
    selectedIds.push(remainingIds.shift()!)
  }

  localStorage.setItem(key(packId), JSON.stringify({ remainingIds }))
  return selectedIds.flatMap((id) => lessonById.get(id) ?? [])
}
