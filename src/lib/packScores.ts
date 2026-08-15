export interface PackSessionScore {
  completedAt: string
  mode: 'dictation' | 'translation'
  average: number
  exercises: number
}

const key = (packId: string) => `echo-pack-scores-${packId}`

export function getPackSessionScores(packId: string): PackSessionScore[] {
  try {
    const scores = JSON.parse(localStorage.getItem(key(packId)) ?? '[]')
    return Array.isArray(scores) ? scores : []
  } catch {
    return []
  }
}

export function savePackSessionScore(packId: string, session: PackSessionScore): void {
  const scores = getPackSessionScores(packId)
  localStorage.setItem(key(packId), JSON.stringify([...scores, session]))
}

export function packScoreSummary(packId: string): { average: number; sessions: number } | null {
  const scores = getPackSessionScores(packId)
  if (!scores.length) return null
  const exerciseCount = scores.reduce((total, session) => total + session.exercises, 0)
  const scoreTotal = scores.reduce((total, session) => total + session.average * session.exercises, 0)
  return { average: exerciseCount ? Math.round(scoreTotal / exerciseCount) : 0, sessions: scores.length }
}
