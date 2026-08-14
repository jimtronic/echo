const lessonSchema = {
  type: 'object', additionalProperties: false,
  required: ['id', 'sentence', 'english', 'acceptedTranslations', 'notes', 'topics', 'kind', 'family'],
  properties: {
    id: { type: 'string' }, sentence: { type: 'string' }, english: { type: 'string' },
    acceptedTranslations: { type: 'array', items: { type: 'string' }, minItems: 1, maxItems: 3 },
    notes: { type: 'array', items: { type: 'string' }, minItems: 1, maxItems: 2 },
    topics: { type: 'array', items: { type: 'string' }, minItems: 1, maxItems: 3 },
    kind: { type: 'string', enum: ['curated', 'construction'] }, family: { type: 'string' }
  }
}

const packSchema = {
  type: 'object', additionalProperties: false,
  required: ['id', 'language', 'locale', 'level', 'title', 'description', 'targetVocabulary', 'lessons'],
  properties: {
    id: { type: 'string' }, language: { type: 'string' }, locale: { type: 'string' },
    level: { type: 'string', enum: ['beginner', 'intermediate', 'advanced'] },
    title: { type: 'string' }, description: { type: 'string' },
    targetVocabulary: { type: 'array', items: { type: 'string' }, minItems: 8, maxItems: 20 },
    lessons: { type: 'array', items: lessonSchema, minItems: 25, maxItems: 25 }
  }
}

function outputText(response) {
  for (const item of response.output ?? []) for (const content of item.content ?? []) if (content.type === 'output_text') return content.text
  throw new Error('The model returned no pack content.')
}

export async function generatePack({ scenario, language = 'auto', level = 'beginner', existingSentences = [] }) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('Custom pack generation is not configured yet.')
  if (typeof scenario !== 'string' || scenario.trim().length < 5 || scenario.length > 300) throw new Error('Please describe a scenario in 5–300 characters.')
  if (!['auto', 'fr-FR', 'es-ES', 'es-419', 'de-DE', 'it-IT', 'ja-JP'].includes(language)) throw new Error('Unsupported language selection.')
  if (!['beginner', 'intermediate', 'advanced'].includes(level)) throw new Error('Unsupported level selection.')
  const avoid = existingSentences.slice(-100).map((sentence) => `- ${sentence}`).join('\n')
  const prompt = `Create exactly 25 natural listening exercises for Echo.\nScenario: ${scenario.trim()}\nLanguage override: ${language === 'auto' ? 'Infer the most likely target language and regional locale from the scenario.' : language}\nLevel: ${level}\n\nEach sentence must be something a learner is genuinely likely to hear or say in that scenario. Use natural contemporary language, varied speakers and intentions, useful repetition without templated monotony, concise English translations, and helpful usage notes. Keep beginner sentences short and accessible. IDs must be unique. Do not include answers in metadata beyond the requested lesson fields.${avoid ? `\n\nDo not repeat these existing sentences:\n${avoid}` : ''}`
  const apiResponse = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: process.env.OPENAI_PACK_MODEL ?? 'gpt-5.6-terra',
      input: [{ role: 'system', content: 'You are an expert language educator and native-quality lesson editor. Return only the requested structured pack.' }, { role: 'user', content: prompt }],
      reasoning: { effort: 'low' },
      text: { format: { type: 'json_schema', name: 'echo_pack', strict: true, schema: packSchema } }
    })
  })
  const response = await apiResponse.json()
  if (!apiResponse.ok) throw new Error(response.error?.message ?? 'Pack generation failed.')
  const pack = JSON.parse(outputText(response))
  if (pack.lessons?.length !== 25) throw new Error('The generated pack did not contain 25 lessons.')
  return pack
}
