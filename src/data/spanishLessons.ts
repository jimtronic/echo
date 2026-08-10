import type { Lesson } from '../types'

type Pair = { es: string; en: string }
type Template = { es: (value: string) => string; en: (value: string) => string }

function curated(level: Lesson['level'], group: string, sentences: Pair[]): Lesson[] {
  return sentences.map((sentence, index) => ({
    id: `es-${level}-${group}-${String(index + 1).padStart(3, '0')}`,
    language: 'es', level, sentence: sentence.es, english: sentence.en,
    audio: `/audio/es/${level}/${group}-${String(index + 1).padStart(3, '0')}.mp3`,
    notes: [], topics: ['spoken Spanish']
  }))
}

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
  { es: (v) => `Podemos ${v} aquí.`, en: (v) => `We can ${v} here.` },
  { es: (v) => `Prefiero ${v} por la mañana.`, en: (v) => `I prefer to ${v} in the morning.` }
]
const intermediateTemplates: Template[] = [
  { es: (v) => `Estoy pensando en ${v}.`, en: (v) => `I'm thinking about whether to ${v}.` },
  { es: (v) => `Al final decidimos ${v}.`, en: (v) => `In the end, we decided to ${v}.` },
  { es: (v) => `Me cuesta ${v}.`, en: (v) => `I find it difficult to ${v}.` },
  { es: (v) => `Sería mejor ${v}.`, en: (v) => `It would be better to ${v}.` },
  { es: (v) => `No esperaba tener que ${v}.`, en: (v) => `I didn't expect to have to ${v}.` },
  { es: (v) => `Todavía estamos a tiempo de ${v}.`, en: (v) => `We still have time to ${v}.` }
]
const advancedTemplates: Template[] = [
  { es: (v) => `Habría sido mejor ${v}.`, en: (v) => `It would have been better to ${v}.` },
  { es: (v) => `Nada nos impide ${v}.`, en: (v) => `Nothing prevents us from choosing to ${v}.` },
  { es: (v) => `Antes de ${v}, convendría valorar las consecuencias.`, en: (v) => `Before we ${v}, we should assess the consequences.` },
  { es: (v) => `En lugar de ${v}, deberíamos buscar otra solución.`, en: (v) => `Instead of choosing to ${v}, we should look for another solution.` },
  { es: (v) => `El mero hecho de ${v} no garantiza el resultado.`, en: (v) => `Simply choosing to ${v} does not guarantee the result.` }
]

const beginnerNatural: Pair[] = [
  { es: '¿Habla inglés?', en: 'Do you speak English?' }, { es: 'No lo he entendido.', en: "I didn't understand that." },
  { es: '¿Puede repetirlo?', en: 'Can you repeat that?' }, { es: '¿Cuánto cuesta?', en: 'How much is it?' },
  { es: '¿Es por aquí?', en: 'Is it this way?' }, { es: '¿Nos vamos?', en: 'Shall we go?' },
  { es: 'Llego en cinco minutos.', en: "I'll be there in five minutes." }, { es: 'Hoy hace muy buen tiempo.', en: "It's really nice out today." },
  { es: 'Está empezando a llover.', en: "It's starting to rain." }, { es: 'Todavía tenemos tiempo.', en: 'We still have time.' },
  { es: 'Me llevo este.', en: "I'll take this one." }, { es: '¿Tiene una reserva?', en: 'Do you have a reservation?' },
  { es: '¿Está abierta la terraza?', en: 'Is the terrace open?' }, { es: 'Estoy buscando la estación.', en: "I'm looking for the station." },
  { es: 'Podemos ir andando.', en: 'We can walk there.' }
]

const intermediateNatural: Pair[] = [
  { es: 'Me pregunto si de verdad merece la pena.', en: "I wonder if it's really worth it." },
  { es: 'Podemos salir un poco más tarde, pero igual llegamos después de que cierren.', en: 'We can leave a little later, but we might arrive after they close.' },
  { es: 'Si nos damos prisa, todavía llegamos al mercado.', en: 'If we hurry, we can still make it to the market.' },
  { es: 'Yo que tú, llamaría antes de ir.', en: "If I were you, I'd call before going." },
  { es: 'Como no tenemos prisa, podemos ir por la carretera secundaria.', en: "Since we're not in a hurry, we can take the back road." },
  { es: 'Me da la impresión de que va a llover.', en: "I have the feeling it's going to rain." },
  { es: 'No hace falta hacerlo todo hoy.', en: "We don't have to do everything today." },
  { es: '¿Conoce algún sitio bueno para cenar por aquí?', en: 'Do you know a good place to have dinner nearby?' },
  { es: 'Quizá merezca la pena reservar ahora.', en: 'It might be worth booking now.' },
  { es: 'Creo que sería mejor salir temprano mañana.', en: 'I think it would be better to leave early tomorrow.' },
  { es: 'Todavía nos da tiempo a tomar un café.', en: 'We still have time for a coffee.' },
  { es: '¿Sabes si siguen abiertos?', en: 'Do you know if they are still open?' },
  { es: 'No pensaba que estuviera tan lejos.', en: "I didn't think it would be this far." },
  { es: 'Ya veremos cuando lleguemos.', en: "We'll see when we get there." },
  { es: 'Depende sobre todo del tiempo que haga.', en: 'It mostly depends on the weather.' }
]

const advancedNatural: Pair[] = [
  { es: 'Bueno, si salimos ahora, deberíamos llegar sobre las ocho.', en: 'Well, if we leave now, we should arrive around eight.' },
  { es: 'Entonces, ¿qué hacemos? ¿Seguimos o paramos aquí?', en: 'So what do we do? Keep going or stop here?' },
  { es: 'La verdad es que pensaba que sería mucho más turístico.', en: 'Honestly, I thought it would be much more touristy.' },
  { es: 'Me extrañaría que siguieran abiertos a estas horas.', en: "I'd be surprised if they were still open at this hour." },
  { es: 'Tendríamos que haber llamado antes, pero tampoco pasa nada.', en: "We should have called first, but it's not a big deal." },
  { es: 'No sé, estoy dudando entre los dos.', en: "I'm not sure; I'm torn between the two." },
  { es: 'Ya que estamos aquí, podríamos acercarnos al pueblo.', en: "Since we're already here, we could go see the village." },
  { es: 'Yo creo que merece la pena, sobre todo si tenemos tiempo.', en: "I think it's worth it, especially if we have time." },
  { es: 'No es que no quiera ir, es que se nos ha hecho un poco tarde.', en: "It's not that I don't want to go; it's just gotten a little late." },
  { es: 'Aunque llueva un poco, no creo que pase nada.', en: 'Even if it rains a little, it should be fine.' },
  { es: 'Pensaba que íbamos a tener más tiempo.', en: 'I thought we were going to have more time.' },
  { es: 'Depende de lo que queramos hacer después.', en: 'It depends on what we want to do afterward.' },
  { es: 'Sinceramente, creo que prefiero quedarme aquí.', en: 'Honestly, I think I prefer staying here.' },
  { es: 'Al final, quizá haya sido mejor así.', en: 'In the end, maybe it was better this way.' },
  { es: 'De todas formas, siempre podemos volver mañana.', en: 'Anyway, we can always come back tomorrow.' },
  { es: 'Yo diría que sí, aunque depende del precio.', en: "I'd say yes, although it depends on the price." },
  { es: 'Entiendo lo que dices, pero no estoy del todo de acuerdo.', en: "I see what you mean, but I don't completely agree." },
  { es: 'Da un poco de pena irnos sin haber visto el mercado.', en: "It's a shame to leave without seeing the market." },
  { es: 'Pensamos que ya decidiríamos al llegar.', en: "We figured we'd decide when we got there." },
  { es: 'En el peor de los casos, si está cerrado, buscamos otra cosa.', en: "Worst case, if it's closed, we'll find something else." }
]

const advancedListening: Pair[] = [
  { es: '¿Te ha dado tiempo a mirar los horarios?', en: 'Did you have time to check the opening times?' },
  { es: 'No sé si lo has visto, pero dicen que va a llover.', en: "I don't know if you saw, but they're forecasting rain." },
  { es: 'Hay un restaurante pequeño al final de la calle.', en: "There's a little restaurant at the end of the street." },
  { es: 'No te preocupes, vamos bien de tiempo.', en: "Don't worry, we have plenty of time." },
  { es: 'No he estado nunca, pero me han dicho que está muy bien.', en: "I've never been there, but I've heard it's really nice." },
  { es: '¿Te importa si paramos cinco minutos?', en: 'Do you mind if we stop for five minutes?' },
  { es: 'Pensaba que teníamos que girar aquí a la izquierda.', en: 'I thought we were supposed to turn left here.' },
  { es: 'Espera, que lo miro un momento en el mapa.', en: 'Hang on, let me quickly check the map.' },
  { es: 'Igual sería mejor preguntarle a alguien.', en: 'Maybe we should ask someone.' },
  { es: 'Llevamos ya una hora de camino.', en: "We've already been traveling for an hour." },
  { es: '¿Seguro que es por aquí?', en: "Are you sure it's this way?" },
  { es: 'No me apetece quedarme atrapado bajo la lluvia.', en: "I don't want to get stuck in the rain." },
  { es: 'Ya veremos; total, no tenemos prisa.', en: "We'll see; anyway, we're not in a hurry." },
  { es: 'Habría sido una pena perdérnoslo.', en: 'It would have been a shame to miss it.' },
  { es: 'No pensaba que hubiera tanta subida.', en: "I didn't think it would be this steep." }
]

export const spanishLessons: Lesson[] = [
  ...expand('beginner', beginnerValues.slice(0, 12), beginnerTemplates),
  ...curated('beginner', 'natural', beginnerNatural),
  ...expand('intermediate', intermediateValues.slice(0, 12), intermediateTemplates),
  ...curated('intermediate', 'natural', intermediateNatural),
  ...expand('advanced', advancedValues.slice(0, 12), advancedTemplates.slice(0, 3)),
  ...curated('advanced', 'natural', advancedNatural),
  ...curated('advanced', 'listening', advancedListening)
]
