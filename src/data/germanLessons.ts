import type { Lesson } from '../types'

type Pair = { de: string; en: string }
type Template = { de: (value: string) => string; en: (value: string) => string }

function curated(level: Lesson['level'], group: string, sentences: Pair[]): Lesson[] {
  return sentences.map((sentence, index) => ({
    id: `de-${level}-${group}-${String(index + 1).padStart(3, '0')}`,
    language: 'de', level, sentence: sentence.de, english: sentence.en,
    audio: `/audio/de/${level}/${group}-${String(index + 1).padStart(3, '0')}.mp3`,
    notes: [], topics: ['spoken German']
  }))
}

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
  { de: (v) => `Wir können hier ${v}.`, en: (v) => `We can ${v} here.` },
  { de: (v) => `Ich würde gern ${v}.`, en: (v) => `I would like to ${v}.` }
]
const intermediateTemplates: Template[] = [
  { de: (v) => `Vielleicht sollten wir ${v}.`, en: (v) => `Maybe we should ${v}.` },
  { de: (v) => `Ich möchte bald ${v}.`, en: (v) => `I would like to ${v} soon.` },
  { de: (v) => `Wir könnten morgen ${v}.`, en: (v) => `We could ${v} tomorrow.` },
  { de: (v) => `Ich muss noch ${v}.`, en: (v) => `I still need to ${v}.` },
  { de: (v) => `Warum sollten wir nicht ${v}?`, en: (v) => `Why shouldn't we ${v}?` },
  { de: (v) => `Wir haben noch Zeit, ${v}.`, en: (v) => `We still have time to ${v}.` }
]
const advancedTemplates: Template[] = [
  { de: (v) => `Es steht außer Frage, dass ${v}.`, en: (v) => `There is no doubt that ${v}.` },
  { de: (v) => `Vieles deutet darauf hin, dass ${v}.`, en: (v) => `Much suggests that ${v}.` },
  { de: (v) => `Man könnte einwenden, dass ${v}.`, en: (v) => `One could object that ${v}.` },
  { de: (v) => `Es wäre falsch zu behaupten, dass ${v}.`, en: (v) => `It would be wrong to claim that ${v}.` },
  { de: (v) => `Es bleibt abzuwarten, ob ${v}.`, en: (v) => `It remains to be seen whether ${v}.` }
]

const beginnerNatural: Pair[] = [
  { de: 'Sprechen Sie Englisch?', en: 'Do you speak English?' }, { de: 'Ich habe das nicht verstanden.', en: "I didn't understand that." },
  { de: 'Können Sie das bitte wiederholen?', en: 'Can you repeat that, please?' }, { de: 'Wie viel kostet das?', en: 'How much is it?' },
  { de: 'Geht es hier entlang?', en: 'Is it this way?' }, { de: 'Wollen wir los?', en: 'Shall we go?' },
  { de: 'Ich bin in fünf Minuten da.', en: "I'll be there in five minutes." }, { de: 'Heute ist richtig schönes Wetter.', en: "It's really nice out today." },
  { de: 'Es fängt gerade an zu regnen.', en: "It's starting to rain." }, { de: 'Wir haben noch Zeit.', en: 'We still have time.' },
  { de: 'Ich nehme das hier.', en: "I'll take this one." }, { de: 'Haben Sie reserviert?', en: 'Do you have a reservation?' },
  { de: 'Ist die Terrasse geöffnet?', en: 'Is the terrace open?' }, { de: 'Ich suche den Bahnhof.', en: "I'm looking for the station." },
  { de: 'Wir können zu Fuß hingehen.', en: 'We can walk there.' }
]

const intermediateNatural: Pair[] = [
  { de: 'Ich frage mich, ob sich der Umweg wirklich lohnt.', en: "I wonder if the detour is really worth it." },
  { de: 'Wir können etwas später losfahren, aber dann kommen wir vielleicht erst nach Ladenschluss an.', en: 'We can leave a little later, but then we might arrive after closing.' },
  { de: 'Wenn wir uns beeilen, schaffen wir es noch zum Markt.', en: 'If we hurry, we can still make it to the market.' },
  { de: 'An deiner Stelle würde ich vorher anrufen.', en: "If I were you, I'd call first." },
  { de: 'Da wir es nicht eilig haben, können wir die Nebenstraße nehmen.', en: "Since we're not in a hurry, we can take the back road." },
  { de: 'Ich habe das Gefühl, dass es gleich regnet.', en: "I have the feeling it's about to rain." },
  { de: 'Wir müssen nicht alles heute machen.', en: "We don't have to do everything today." },
  { de: 'Kennen Sie hier in der Nähe ein gutes Restaurant?', en: 'Do you know a good restaurant nearby?' },
  { de: 'Vielleicht lohnt es sich, jetzt schon zu reservieren.', en: 'It might be worth booking now.' },
  { de: 'Ich glaube, wir sollten morgen früh losfahren.', en: 'I think we should leave early tomorrow.' },
  { de: 'Wir haben noch Zeit für einen Kaffee.', en: 'We still have time for a coffee.' },
  { de: 'Weißt du, ob sie noch geöffnet haben?', en: 'Do you know if they are still open?' },
  { de: 'Ich hätte nicht gedacht, dass es so weit ist.', en: "I didn't think it would be this far." },
  { de: 'Das sehen wir, wenn wir da sind.', en: "We'll see when we get there." },
  { de: 'Es hängt vor allem vom Wetter ab.', en: 'It mostly depends on the weather.' }
]

const advancedNatural: Pair[] = [
  { de: 'Na ja, wenn wir jetzt losfahren, müssten wir gegen acht da sein.', en: 'Well, if we leave now, we should get there around eight.' },
  { de: 'Also, was machen wir? Fahren wir weiter oder bleiben wir hier?', en: 'So what do we do? Keep going or stay here?' },
  { de: 'Eigentlich dachte ich, dass es hier viel touristischer wäre.', en: 'Actually, I thought it would be much more touristy here.' },
  { de: 'Es würde mich wundern, wenn sie um diese Uhrzeit noch offen hätten.', en: "I'd be surprised if they were still open at this hour." },
  { de: 'Wir hätten vorher anrufen sollen, aber so schlimm ist es auch nicht.', en: "We should have called first, but it's not that bad." },
  { de: 'Ich weiß nicht so recht, ich schwanke zwischen den beiden.', en: "I'm not really sure; I'm torn between the two." },
  { de: 'Wenn wir schon hier sind, können wir uns auch das Dorf ansehen.', en: "Since we're already here, we might as well see the village." },
  { de: 'Ich finde, es lohnt sich, besonders wenn wir genug Zeit haben.', en: "I think it's worth it, especially if we have enough time." },
  { de: 'Es ist nicht so, dass ich nicht hinwill; es ist nur schon ziemlich spät.', en: "It's not that I don't want to go; it's just pretty late." },
  { de: 'Auch wenn es ein bisschen regnet, wird es schon gehen.', en: 'Even if it rains a little, it should be fine.' },
  { de: 'Ich dachte, wir hätten mehr Zeit als das.', en: 'I thought we would have more time than this.' },
  { de: 'Das hängt davon ab, was wir danach machen wollen.', en: 'It depends on what we want to do afterward.' },
  { de: 'Ehrlich gesagt würde ich lieber hierbleiben.', en: 'Honestly, I would rather stay here.' },
  { de: 'Im Nachhinein war es so vielleicht besser.', en: 'In hindsight, maybe it was better this way.' },
  { de: 'Wir können schließlich auch morgen wiederkommen.', en: 'We can always come back tomorrow.' },
  { de: 'Ich würde eher Ja sagen, aber es kommt auf den Preis an.', en: "I'd tend to say yes, but it depends on the price." },
  { de: 'Ich verstehe, was du meinst, bin aber nicht ganz deiner Meinung.', en: "I see what you mean, but I don't completely agree." },
  { de: 'Es wäre wirklich schade, wieder zu fahren, ohne den Markt gesehen zu haben.', en: 'It would be a shame to leave without seeing the market.' },
  { de: 'Wir dachten, wir entscheiden einfach vor Ort.', en: "We figured we'd decide once we got there." },
  { de: 'Im schlimmsten Fall ist es geschlossen und wir suchen etwas anderes.', en: "Worst case, it's closed and we'll find something else." }
]

const advancedListening: Pair[] = [
  { de: 'Hast du es geschafft, die Öffnungszeiten nachzusehen?', en: 'Did you have time to check the opening times?' },
  { de: 'Ich weiß nicht, ob du es gesehen hast, aber es soll regnen.', en: "I don't know if you saw, but they're forecasting rain." },
  { de: 'Am Ende der Straße ist ein kleines Restaurant.', en: "There's a little restaurant at the end of the street." },
  { de: 'Keine Sorge, wir haben mehr als genug Zeit.', en: "Don't worry, we have plenty of time." },
  { de: 'Ich war noch nie dort, aber es soll ganz schön sein.', en: "I've never been there, but I've heard it's quite nice." },
  { de: 'Stört es dich, wenn wir fünf Minuten anhalten?', en: 'Do you mind if we stop for five minutes?' },
  { de: 'Ich dachte, wir müssten hier links abbiegen.', en: 'I thought we were supposed to turn left here.' },
  { de: 'Warte mal, ich schaue kurz auf die Karte.', en: 'Hang on, let me quickly check the map.' },
  { de: 'Vielleicht fragen wir lieber jemanden.', en: 'Maybe we should ask someone.' },
  { de: 'Wir sind schon seit einer Stunde unterwegs.', en: "We've already been traveling for an hour." },
  { de: 'Bist du sicher, dass es hier langgeht?', en: "Are you sure it's this way?" },
  { de: 'Ich möchte nicht irgendwo im Regen feststecken.', en: "I don't want to get stuck in the rain." },
  { de: 'Mal sehen, wir haben es ja nicht eilig.', en: "We'll see; we're not in a hurry anyway." },
  { de: 'Es wäre schade gewesen, das zu verpassen.', en: 'It would have been a shame to miss it.' },
  { de: 'Ich hätte nicht gedacht, dass es so steil wird.', en: "I didn't think it would get this steep." }
]

export const germanLessons: Lesson[] = [
  ...expand('beginner', beginnerValues.slice(0, 12), beginnerTemplates),
  ...curated('beginner', 'natural', beginnerNatural),
  ...expand('intermediate', intermediateValues.slice(0, 12), intermediateTemplates),
  ...curated('intermediate', 'natural', intermediateNatural),
  ...expand('advanced', advancedValues.slice(0, 12), advancedTemplates.slice(0, 3)),
  ...curated('advanced', 'natural', advancedNatural),
  ...curated('advanced', 'listening', advancedListening)
]
