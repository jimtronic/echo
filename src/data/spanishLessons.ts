import type { Lesson } from '../types'

type Pair = { es: string; en: string }
type Template = { es: (value: string) => string; en: (value: string) => string }

function expand(level: Lesson['level'], values: Pair[], templates: Template[]): Lesson[] {
  return templates.flatMap((template, templateIndex) => values.map((value, valueIndex) => {
    const number = templateIndex * values.length + valueIndex + 1
    return {
      id: `es-${level}-core-${String(number).padStart(3, '0')}`,
      language: 'es',
      level,
      sentence: template.es(value.es),
      english: template.en(value.en),
      audio: `/audio/es/${level}/${String(number).padStart(3, '0')}.mp3`,
      notes: [],
      topics: ['everyday Spanish']
    }
  }))
}

const beginnerValues: Pair[] = [
  { es: 'tomar un café', en: 'have a coffee' }, { es: 'dar un paseo', en: 'go for a walk' },
  { es: 'visitar el museo', en: 'visit the museum' }, { es: 'ver una película', en: 'watch a movie' },
  { es: 'preparar la cena', en: 'make dinner' }, { es: 'escuchar música', en: 'listen to music' },
  { es: 'comprar pan', en: 'buy some bread' }, { es: 'tomar el tren', en: 'take the train' },
  { es: 'llamar a mis padres', en: 'call my parents' }, { es: 'reservar una mesa', en: 'book a table' },
  { es: 'aprender español', en: 'learn Spanish' }, { es: 'hacer la compra', en: 'go grocery shopping' },
  { es: 'volver a casa', en: 'go home' }, { es: 'almorzar fuera', en: 'have lunch out' },
  { es: 'sacar una foto', en: 'take a picture' }, { es: 'ir a la playa', en: 'go to the beach' },
  { es: 'buscar un hotel', en: 'look for a hotel' }, { es: 'pedir un taxi', en: 'call a taxi' },
  { es: 'escribir un mensaje', en: 'write a message' }, { es: 'abrir la ventana', en: 'open the window' },
  { es: 'cerrar la puerta', en: 'close the door' }, { es: 'cambiar dinero', en: 'exchange money' },
  { es: 'probar este queso', en: 'try this cheese' }, { es: 'hablar más despacio', en: 'speak more slowly' },
  { es: 'practicar todos los días', en: 'practice every day' }, { es: 'llegar temprano', en: 'arrive early' },
  { es: 'pagar con tarjeta', en: 'pay by card' }, { es: 'llevar un paraguas', en: 'take an umbrella' },
  { es: 'descansar un poco', en: 'rest for a while' }, { es: 'conocer la ciudad', en: 'get to know the city' }
]

const intermediateValues: Pair[] = [
  { es: 'cambiar de trabajo', en: 'change jobs' }, { es: 'viajar durante unos días', en: 'travel for a few days' },
  { es: 'mudarnos en septiembre', en: 'move in September' }, { es: 'hacer un curso nocturno', en: 'take an evening class' },
  { es: 'invitar a nuestros vecinos', en: 'invite our neighbors' }, { es: 'alquilar un coche', en: 'rent a car' },
  { es: 'aplazar la reunión', en: 'postpone the meeting' }, { es: 'pintar de nuevo la cocina', en: 'repaint the kitchen' },
  { es: 'pasar el fin de semana en Madrid', en: 'spend the weekend in Madrid' }, { es: 'trabajar desde casa', en: 'work from home' },
  { es: 'tomarme unos días libres', en: 'take a few days off' }, { es: 'organizar una fiesta', en: 'organize a party' },
  { es: 'empezar más temprano', en: 'start earlier' }, { es: 'probar ese restaurante nuevo', en: 'try that new restaurant' },
  { es: 'llevar la bicicleta a reparar', en: 'have the bicycle repaired' }, { es: 'hablar con el encargado', en: 'speak with the manager' },
  { es: 'buscar una solución distinta', en: 'look for a different solution' }, { es: 'comparar las dos opciones', en: 'compare the two options' },
  { es: 'cancelar la reserva', en: 'cancel the reservation' }, { es: 'pedir más información', en: 'ask for more information' },
  { es: 'mejorar mi pronunciación', en: 'improve my pronunciation' }, { es: 'terminar el informe', en: 'finish the report' },
  { es: 'cambiar la fecha del viaje', en: 'change the date of the trip' }, { es: 'revisar los horarios', en: 'check the schedules' },
  { es: 'hacer una copia de las llaves', en: 'make a copy of the keys' }, { es: 'consultarlo con mi familia', en: 'discuss it with my family' },
  { es: 'reducir nuestros gastos', en: 'reduce our expenses' }, { es: 'apuntarme al gimnasio', en: 'join the gym' },
  { es: 'solicitar otro presupuesto', en: 'request another estimate' }, { es: 'quedarme hasta el lunes', en: 'stay until Monday' }
]

const advancedValues: Pair[] = [
  { es: 'replantear por completo nuestra estrategia', en: 'completely rethink our strategy' },
  { es: 'consultar a todas las personas implicadas', en: 'consult everyone involved' },
  { es: 'prever una solución alternativa', en: 'plan an alternative solution' },
  { es: 'tener en cuenta las consecuencias a largo plazo', en: 'consider the long-term consequences' },
  { es: 'aclarar las responsabilidades de cada uno', en: "clarify everyone's responsibilities" },
  { es: 'cuestionar algunas de nuestras suposiciones', en: 'question some of our assumptions' },
  { es: 'buscar un acuerdo aceptable', en: 'look for an acceptable agreement' },
  { es: 'comprobar la fiabilidad de estos datos', en: 'check the reliability of this data' },
  { es: 'anticipar las objeciones más probables', en: 'anticipate the most likely objections' },
  { es: 'reconocer abiertamente nuestro error', en: 'openly acknowledge our mistake' },
  { es: 'establecer objetivos más realistas', en: 'set more realistic goals' },
  { es: 'recurrir a un experto independiente', en: 'bring in an independent expert' },
  { es: 'examinar la cuestión desde otra perspectiva', en: 'examine the issue from another perspective' },
  { es: 'tomarnos un tiempo antes de responder', en: 'take some time before responding' },
  { es: 'renegociar las condiciones del contrato', en: 'renegotiate the terms of the contract' },
  { es: 'distinguir los hechos de las opiniones', en: 'distinguish facts from opinions' },
  { es: 'evaluar los riesgos con más cuidado', en: 'assess the risks more carefully' },
  { es: 'admitir que nos equivocamos', en: 'admit that we were wrong' },
  { es: 'explicar los motivos de la decisión', en: 'explain the reasons for the decision' },
  { es: 'reconsiderar nuestras prioridades', en: 'reconsider our priorities' },
  { es: 'analizar el problema en su conjunto', en: 'analyze the problem as a whole' },
  { es: 'revisar las estimaciones iniciales', en: 'review the initial estimates' },
  { es: 'escuchar las preocupaciones del equipo', en: "listen to the team's concerns" },
  { es: 'evitar conclusiones precipitadas', en: 'avoid hasty conclusions' },
  { es: 'justificar cada gasto adicional', en: 'justify every additional expense' },
  { es: 'establecer un calendario viable', en: 'establish a workable schedule' },
  { es: 'proteger los intereses de ambas partes', en: 'protect the interests of both parties' },
  { es: 'medir el impacto real de la medida', en: 'measure the real impact of the measure' },
  { es: 'abordar las causas del problema', en: 'address the causes of the problem' },
  { es: 'mantener abiertas todas las opciones', en: 'keep all options open' }
]

const beginnerTemplates: Template[] = [
  { es: (v) => `Quiero ${v}.`, en: (v) => `I want to ${v}.` },
  { es: (v) => `Voy a ${v} mañana.`, en: (v) => `I'm going to ${v} tomorrow.` },
  { es: (v) => `¿Quieres ${v} conmigo?`, en: (v) => `Do you want to ${v} with me?` },
  { es: (v) => `Necesito ${v} esta semana.`, en: (v) => `I need to ${v} this week.` },
  { es: (v) => `Es fácil ${v} aquí.`, en: (v) => `It is easy to ${v} here.` }
]
const intermediateTemplates: Template[] = [
  { es: (v) => `Estoy pensando en ${v}.`, en: (v) => `I'm thinking about whether to ${v}.` },
  { es: (v) => `Al final decidimos ${v}.`, en: (v) => `In the end, we decided to ${v}.` },
  { es: (v) => `Me cuesta ${v}.`, en: (v) => `I find it difficult to ${v}.` },
  { es: (v) => `Sería mejor ${v}.`, en: (v) => `It would be better to ${v}.` },
  { es: (v) => `No esperaba tener que ${v}.`, en: (v) => `I didn't expect to have to ${v}.` }
]
const advancedTemplates: Template[] = [
  { es: (v) => `Habría sido mejor ${v}.`, en: (v) => `It would have been better to ${v}.` },
  { es: (v) => `Nada nos impide ${v}.`, en: (v) => `Nothing prevents us from choosing to ${v}.` },
  { es: (v) => `Antes de ${v}, convendría valorar las consecuencias.`, en: (v) => `Before we ${v}, we should assess the consequences.` },
  { es: (v) => `En lugar de ${v}, deberíamos buscar otra solución.`, en: (v) => `Instead of choosing to ${v}, we should look for another solution.` },
  { es: (v) => `El mero hecho de ${v} no garantiza el resultado.`, en: (v) => `Simply choosing to ${v} does not guarantee the result.` }
]

export const spanishLessons: Lesson[] = [
  ...expand('beginner', beginnerValues, beginnerTemplates),
  ...expand('intermediate', intermediateValues, intermediateTemplates),
  ...expand('advanced', advancedValues, advancedTemplates)
]
