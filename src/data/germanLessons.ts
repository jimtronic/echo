import type { Lesson } from '../types'

type Pair = { de: string; en: string }
type Template = { de: (value: string) => string; en: (value: string) => string }

function expand(level: Lesson['level'], values: Pair[], templates: Template[]): Lesson[] {
  return templates.flatMap((template, templateIndex) => values.map((value, valueIndex) => {
    const number = templateIndex * values.length + valueIndex + 1
    return {
      id: `de-${level}-core-${String(number).padStart(3, '0')}`,
      language: 'de', level,
      sentence: template.de(value.de), english: template.en(value.en),
      audio: `/audio/de/${level}/${String(number).padStart(3, '0')}.mp3`,
      notes: [], topics: ['everyday German']
    }
  }))
}

const beginnerValues: Pair[] = [
  { de: 'einen Kaffee trinken', en: 'have a coffee' }, { de: 'spazieren gehen', en: 'go for a walk' },
  { de: 'das Museum besuchen', en: 'visit the museum' }, { de: 'einen Film sehen', en: 'watch a movie' },
  { de: 'das Abendessen kochen', en: 'make dinner' }, { de: 'Musik hören', en: 'listen to music' },
  { de: 'Brot kaufen', en: 'buy some bread' }, { de: 'den Zug nehmen', en: 'take the train' },
  { de: 'meine Eltern anrufen', en: 'call my parents' }, { de: 'einen Tisch reservieren', en: 'book a table' },
  { de: 'Deutsch lernen', en: 'learn German' }, { de: 'einkaufen gehen', en: 'go shopping' },
  { de: 'nach Hause fahren', en: 'go home' }, { de: 'draußen zu Mittag essen', en: 'have lunch outside' },
  { de: 'ein Foto machen', en: 'take a picture' }, { de: 'an den Strand fahren', en: 'go to the beach' },
  { de: 'ein Hotel suchen', en: 'look for a hotel' }, { de: 'ein Taxi bestellen', en: 'call a taxi' },
  { de: 'eine Nachricht schreiben', en: 'write a message' }, { de: 'das Fenster öffnen', en: 'open the window' },
  { de: 'die Tür schließen', en: 'close the door' }, { de: 'Geld wechseln', en: 'exchange money' },
  { de: 'diesen Käse probieren', en: 'try this cheese' }, { de: 'langsamer sprechen', en: 'speak more slowly' },
  { de: 'jeden Tag üben', en: 'practice every day' }, { de: 'früh ankommen', en: 'arrive early' },
  { de: 'mit Karte bezahlen', en: 'pay by card' }, { de: 'einen Regenschirm mitnehmen', en: 'take an umbrella' },
  { de: 'mich etwas ausruhen', en: 'rest for a while' }, { de: 'die Stadt kennenlernen', en: 'get to know the city' }
]

const intermediateValues: Pair[] = [
  { de: 'die Stelle wechseln', en: 'change jobs' }, { de: 'ein paar Tage verreisen', en: 'go away for a few days' },
  { de: 'im September umziehen', en: 'move in September' }, { de: 'einen Abendkurs besuchen', en: 'take an evening class' },
  { de: 'unsere Nachbarn einladen', en: 'invite our neighbors' }, { de: 'ein Auto mieten', en: 'rent a car' },
  { de: 'die Besprechung verschieben', en: 'postpone the meeting' }, { de: 'die Küche neu streichen', en: 'repaint the kitchen' },
  { de: 'das Wochenende in Berlin verbringen', en: 'spend the weekend in Berlin' }, { de: 'von zu Hause arbeiten', en: 'work from home' },
  { de: 'ein paar Tage freinehmen', en: 'take a few days off' }, { de: 'eine Feier organisieren', en: 'organize a party' },
  { de: 'früher anfangen', en: 'start earlier' }, { de: 'das neue Restaurant ausprobieren', en: 'try the new restaurant' },
  { de: 'das Fahrrad reparieren lassen', en: 'have the bicycle repaired' }, { de: 'mit der Leitung sprechen', en: 'speak with the manager' },
  { de: 'eine andere Lösung suchen', en: 'look for a different solution' }, { de: 'die beiden Möglichkeiten vergleichen', en: 'compare the two options' },
  { de: 'die Reservierung stornieren', en: 'cancel the reservation' }, { de: 'um weitere Informationen bitten', en: 'ask for more information' },
  { de: 'meine Aussprache verbessern', en: 'improve my pronunciation' }, { de: 'den Bericht fertigstellen', en: 'finish the report' },
  { de: 'das Reisedatum ändern', en: 'change the travel date' }, { de: 'die Fahrpläne überprüfen', en: 'check the schedules' },
  { de: 'einen Ersatzschlüssel machen lassen', en: 'have a spare key made' }, { de: 'es mit meiner Familie besprechen', en: 'discuss it with my family' },
  { de: 'unsere Ausgaben reduzieren', en: 'reduce our expenses' }, { de: 'mich im Fitnessstudio anmelden', en: 'join the gym' },
  { de: 'ein weiteres Angebot einholen', en: 'request another estimate' }, { de: 'bis Montag bleiben', en: 'stay until Monday' }
]

const advancedValues: Pair[] = [
  { de: 'sich die Lage weiter verändern wird', en: 'the situation will continue to change' },
  { de: 'die Ergebnisse deutlich überschätzt wurden', en: 'the results were significantly overestimated' },
  { de: 'diese Maßnahme unerwartete Folgen haben wird', en: 'this measure will have unexpected consequences' },
  { de: 'die Debatte noch lange nicht beendet ist', en: 'the debate is far from over' },
  { de: 'mehrere Faktoren übersehen wurden', en: 'several factors were overlooked' },
  { de: 'die Nachfrage bald das Angebot übersteigen wird', en: 'demand will soon exceed supply' },
  { de: 'ihre Entscheidung von Vorsicht geprägt war', en: 'their decision was motivated by caution' },
  { de: 'die beiden Entwicklungen eng zusammenhängen', en: 'the two developments are closely linked' },
  { de: 'der Zeitplan überarbeitet werden muss', en: 'the schedule needs to be revised' },
  { de: 'der erste Eindruck täuschen kann', en: 'first impressions can be deceptive' },
  { de: 'keine Lösung alle zufriedenstellen wird', en: 'no solution will satisfy everyone' },
  { de: 'die tatsächlichen Kosten schwer einzuschätzen sind', en: 'the actual costs are difficult to assess' },
  { de: 'sich dieser Trend irgendwann umkehren wird', en: 'this trend will eventually reverse' },
  { de: 'sich die Prioritäten grundlegend verändert haben', en: 'the priorities have changed fundamentally' },
  { de: 'eine kleine Verzögerung alles gefährden könnte', en: 'a small delay could jeopardize everything' },
  { de: 'wir unsere Strategie überdenken müssen', en: 'we need to rethink our strategy' },
  { de: 'alle Beteiligten angehört werden sollten', en: 'everyone involved should be heard' },
  { de: 'eine Ausweichlösung notwendig sein könnte', en: 'a fallback solution may be necessary' },
  { de: 'langfristige Folgen nicht ignoriert werden dürfen', en: 'long-term consequences must not be ignored' },
  { de: 'die Zuständigkeiten unklar geblieben sind', en: 'the responsibilities have remained unclear' },
  { de: 'einige Annahmen nicht mehr zutreffen', en: 'some assumptions are no longer valid' },
  { de: 'ein tragfähiger Kompromiss möglich ist', en: 'a viable compromise is possible' },
  { de: 'die Zuverlässigkeit der Daten fraglich ist', en: 'the reliability of the data is questionable' },
  { de: 'weitere Einwände zu erwarten sind', en: 'further objections are to be expected' },
  { de: 'wir einen Fehler gemacht haben', en: 'we made a mistake' },
  { de: 'realistischere Ziele gesetzt werden müssen', en: 'more realistic goals need to be set' },
  { de: 'ein unabhängiges Gutachten hilfreich wäre', en: 'an independent assessment would be helpful' },
  { de: 'das Problem aus einer anderen Perspektive betrachtet werden sollte', en: 'the problem should be viewed from another perspective' },
  { de: 'eine vorschnelle Antwort mehr schaden könnte', en: 'a hasty answer could do more harm' },
  { de: 'die Vertragsbedingungen neu verhandelt werden müssen', en: 'the contract terms need to be renegotiated' }
]

const beginnerTemplates: Template[] = [
  { de: (v) => `Ich möchte ${v}.`, en: (v) => `I would like to ${v}.` },
  { de: (v) => `Ich werde morgen ${v}.`, en: (v) => `I will ${v} tomorrow.` },
  { de: (v) => `Möchtest du mit mir ${v}?`, en: (v) => `Would you like to ${v} with me?` },
  { de: (v) => `Ich muss diese Woche ${v}.`, en: (v) => `I need to ${v} this week.` },
  { de: (v) => `Wir können hier ${v}.`, en: (v) => `We can ${v} here.` }
]
const intermediateTemplates: Template[] = [
  { de: (v) => `Vielleicht sollten wir ${v}.`, en: (v) => `Maybe we should ${v}.` },
  { de: (v) => `Ich möchte bald ${v}.`, en: (v) => `I would like to ${v} soon.` },
  { de: (v) => `Wir könnten morgen ${v}.`, en: (v) => `We could ${v} tomorrow.` },
  { de: (v) => `Ich muss noch ${v}.`, en: (v) => `I still need to ${v}.` },
  { de: (v) => `Warum sollten wir nicht ${v}?`, en: (v) => `Why shouldn't we ${v}?` }
]
const advancedTemplates: Template[] = [
  { de: (v) => `Es steht außer Frage, dass ${v}.`, en: (v) => `There is no doubt that ${v}.` },
  { de: (v) => `Vieles deutet darauf hin, dass ${v}.`, en: (v) => `Much suggests that ${v}.` },
  { de: (v) => `Man könnte einwenden, dass ${v}.`, en: (v) => `One could object that ${v}.` },
  { de: (v) => `Es wäre falsch zu behaupten, dass ${v}.`, en: (v) => `It would be wrong to claim that ${v}.` },
  { de: (v) => `Es bleibt abzuwarten, ob ${v}.`, en: (v) => `It remains to be seen whether ${v}.` }
]

export const germanLessons: Lesson[] = [
  ...expand('beginner', beginnerValues, beginnerTemplates),
  ...expand('intermediate', intermediateValues, intermediateTemplates),
  ...expand('advanced', advancedValues, advancedTemplates)
]
