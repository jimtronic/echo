export type DiffKind = 'correct' | 'missing' | 'incorrect' | 'extra'
export interface DiffToken { text: string; kind: DiffKind }

export function normalize(value: string): string {
  return value
    .toLocaleLowerCase('fr')
    .replace(/[’‘]/g, "'")
    .replace(/[.,!?¡¿;:«»"()[\]{}…—–-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function editDistance(a: string, b: string): number {
  const previous = Array.from({ length: b.length + 1 }, (_, index) => index)
  for (let i = 1; i <= a.length; i += 1) {
    let diagonal = previous[0]
    previous[0] = i
    for (let j = 1; j <= b.length; j += 1) {
      const above = previous[j]
      previous[j] = Math.min(previous[j] + 1, previous[j - 1] + 1, diagonal + (a[i - 1] === b[j - 1] ? 0 : 1))
      diagonal = above
    }
  }
  return previous[b.length]
}

export function scoreAnswer(answer: string, expected: string): number {
  const a = normalize(answer)
  const b = normalize(expected)
  if (!a && !b) return 100
  if (!a || !b) return 0
  return Math.round(100 * (1 - editDistance(a, b) / Math.max(a.length, b.length)))
}

export function diffWords(answer: string, expected: string): DiffToken[] {
  const actual = normalize(answer).split(' ').filter(Boolean)
  const target = normalize(expected).split(' ').filter(Boolean)
  const rows = target.length + 1
  const cols = actual.length + 1
  const table = Array.from({ length: rows }, () => Array<number>(cols).fill(0))
  for (let i = 0; i < rows; i += 1) table[i][0] = i
  for (let j = 0; j < cols; j += 1) table[0][j] = j
  for (let i = 1; i < rows; i += 1) for (let j = 1; j < cols; j += 1) {
    table[i][j] = target[i - 1] === actual[j - 1]
      ? table[i - 1][j - 1]
      : 1 + Math.min(table[i - 1][j], table[i][j - 1], table[i - 1][j - 1])
  }
  const result: DiffToken[] = []
  let i = target.length
  let j = actual.length
  while (i || j) {
    if (i && j && target[i - 1] === actual[j - 1]) {
      result.unshift({ text: target[--i], kind: 'correct' }); j -= 1
    } else if (i && j && table[i][j] === table[i - 1][j - 1] + 1) {
      result.unshift({ text: `${actual[j - 1]} → ${target[i - 1]}`, kind: 'incorrect' }); i -= 1; j -= 1
    } else if (i && table[i][j] === table[i - 1][j] + 1) {
      result.unshift({ text: target[--i], kind: 'missing' })
    } else {
      result.unshift({ text: actual[--j], kind: 'extra' })
    }
  }
  return result
}
