export interface Lesson {
  id: string
  language: string
  level: 'beginner' | 'intermediate' | 'advanced'
  sentence: string
  english: string
  audio: string
  notes: string[]
  topics: string[]
}
