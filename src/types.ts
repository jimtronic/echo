export interface Lesson {
  id: string
  language: string
  level: 'beginner' | 'intermediate' | 'advanced'
  sentence: string
  english: string
  audio: string
  notes: string[]
  topics: string[]
  acceptedTranslations?: string[]
  family?: string
  kind?: 'curated' | 'construction'
  packId?: string
  packOrder?: number
}
