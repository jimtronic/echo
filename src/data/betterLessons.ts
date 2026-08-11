import type { Lesson } from '../types'

type Pair = {
  fr: string
  en: string
}

type Template = {
  fr: (value: string) => string
  en: (value: string) => string
}

/**
 * Use templates when repetition of a useful construction
 * is itself part of the lesson.
 */
function expand(
  level: Lesson['level'],
  group: string,
  topics: string[],
  values: Pair[],
  templates: Template[],
): Lesson[] {
  return templates.flatMap((template, templateIndex) =>
    values.map((value, valueIndex) => {
      const number = templateIndex * values.length + valueIndex + 1

      return {
        id: `fr-${level}-${group}-${String(number).padStart(3, '0')}`,
        language: 'fr',
        level,
        sentence: template.fr(value.fr),
        english: template.en(value.en),
        audio: `/audio/fr/${level}/${group}-${String(number).padStart(3, '0')}.mp3`,
        notes: [],
        topics,
      }
    }),
  )
}

/**
 * Use individually authored sentences when natural language matters
 * more than repetition of a grammatical frame.
 */
function curated(
  level: Lesson['level'],
  group: string,
  topics: string[],
  sentences: Pair[],
): Lesson[] {
  return sentences.map((sentence, index) => ({
    id: `fr-${level}-${group}-${String(index + 1).padStart(3, '0')}`,
    language: 'fr',
    level,
    sentence: sentence.fr,
    english: sentence.en,
    audio: `/audio/fr/${level}/${group}-${String(index + 1).padStart(3, '0')}.mp3`,
    notes: [],
    topics,
  }))
}

/* -------------------------------------------------------------------------- */
/* BEGINNER                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Beginner should mean:
 *
 * - short
 * - high-frequency vocabulary
 * - clearly pronounced
 * - immediately useful
 *
 * Not necessarily "grammar lesson number one."
 */

const beginnerActivities: Pair[] = [
  { fr: 'prendre un café', en: 'have a coffee' },
  { fr: 'faire une promenade', en: 'go for a walk' },
  { fr: 'acheter du pain', en: 'buy some bread' },
  { fr: 'prendre le train', en: 'take the train' },
  { fr: 'réserver une table', en: 'book a table' },
  { fr: 'déjeuner en terrasse', en: 'have lunch outside' },
  { fr: 'visiter le marché', en: 'visit the market' },
  { fr: 'rentrer à la maison', en: 'go home' },
  { fr: 'faire les courses', en: 'go grocery shopping' },
  { fr: 'prendre une photo', en: 'take a picture' },
  { fr: 'aller à la plage', en: 'go to the beach' },
  { fr: 'commander quelque chose', en: 'order something' },
]

const beginnerItems: Pair[] = [
  { fr: "une bouteille d'eau", en: 'a bottle of water' },
  { fr: 'un café', en: 'a coffee' },
  { fr: 'deux croissants', en: 'two croissants' },
  { fr: 'un billet de train', en: 'a train ticket' },
  { fr: 'une table pour deux', en: 'a table for two' },
  { fr: 'une chambre calme', en: 'a quiet room' },
  { fr: 'une carte de la ville', en: 'a map of the city' },
  { fr: 'un peu de fromage', en: 'some cheese' },
  { fr: 'un taxi', en: 'a taxi' },
  { fr: 'un reçu', en: 'a receipt' },
  { fr: 'un parapluie', en: 'an umbrella' },
  { fr: 'un peu de monnaie', en: 'some change' },
]

const beginnerNatural = curated(
  'beginner',
  'natural',
  ['daily life', 'travel', 'conversation'],
  [
    { fr: "Vous parlez anglais ?", en: 'Do you speak English?' },
    { fr: "Je n'ai pas compris.", en: "I didn't understand." },
    { fr: 'Vous pouvez répéter ?', en: 'Can you repeat that?' },
    { fr: "C'est combien ?", en: 'How much is it?' },
    { fr: "C'est par ici ?", en: 'Is it this way?' },
    { fr: "On y va ?", en: 'Shall we go?' },
    { fr: "J'arrive dans cinq minutes.", en: "I'll be there in five minutes." },
    { fr: "Il fait beau aujourd'hui.", en: "It's nice out today." },
    { fr: "Il commence à pleuvoir.", en: "It's starting to rain." },
    { fr: "On a encore le temps.", en: 'We still have time.' },
    { fr: "Je vais prendre celui-ci.", en: "I'll take this one." },
    { fr: "Vous avez une réservation ?", en: 'Do you have a reservation?' },
    { fr: "La terrasse est ouverte ?", en: 'Is the terrace open?' },
    { fr: "Je cherche la gare.", en: "I'm looking for the station." },
    { fr: "On peut y aller à pied.", en: 'We can walk there.' },
  ],
)

const beginnerEveryday = curated(
  'beginner',
  'everyday',
  ['daily life', 'conversation', 'travel', 'food'],
  [
    { fr: 'Bonjour, vous allez bien ?', en: 'Hello, how are you?' },
    { fr: 'Oui, très bien, merci.', en: 'Yes, very well, thank you.' },
    { fr: 'Excusez-moi, je peux passer ?', en: 'Excuse me, can I get through?' },
    { fr: 'Pardon, je me suis trompé.', en: 'Sorry, I made a mistake.' },
    { fr: 'Ce n’est pas grave.', en: "It's not a problem." },
    { fr: 'Merci beaucoup pour votre aide.', en: 'Thank you very much for your help.' },
    { fr: 'Avec plaisir.', en: "You're welcome." },
    { fr: 'À tout à l’heure.', en: 'See you later.' },
    { fr: 'Bonne journée !', en: 'Have a good day!' },
    { fr: 'Bonne soirée !', en: 'Have a good evening!' },
    { fr: 'Je suis un peu fatigué.', en: "I'm a little tired." },
    { fr: 'J’ai faim.', en: "I'm hungry." },
    { fr: 'J’ai soif.', en: "I'm thirsty." },
    { fr: 'J’ai froid.', en: "I'm cold." },
    { fr: 'Il fait trop chaud ici.', en: "It's too hot in here." },
    { fr: 'Je suis prêt.', en: "I'm ready." },
    { fr: 'Attendez une seconde.', en: 'Wait a second.' },
    { fr: 'Je reviens tout de suite.', en: "I'll be right back." },
    { fr: 'Je ne sais pas encore.', en: "I don't know yet." },
    { fr: 'Je crois que oui.', en: 'I think so.' },
    { fr: 'Je ne crois pas.', en: "I don't think so." },
    { fr: 'D’accord, pas de problème.', en: 'Okay, no problem.' },
    { fr: 'Ça me va.', en: 'That works for me.' },
    { fr: 'C’est une bonne idée.', en: "That's a good idea." },
    { fr: 'Qu’est-ce que vous conseillez ?', en: 'What do you recommend?' },
    { fr: 'Je préfère celui-là.', en: 'I prefer that one.' },
    { fr: 'Vous en avez un autre ?', en: 'Do you have another one?' },
    { fr: 'Je peux essayer ?', en: 'Can I try it?' },
    { fr: 'C’est un peu trop cher.', en: "It's a little too expensive." },
    { fr: 'Je paie par carte.', en: "I'll pay by card." },
    { fr: 'Vous prenez les cartes ?', en: 'Do you take cards?' },
    { fr: 'Gardez la monnaie.', en: 'Keep the change.' },
    { fr: 'L’addition, s’il vous plaît.', en: 'The check, please.' },
    { fr: 'Je vais prendre le plat du jour.', en: "I'll have the daily special." },
    { fr: 'Sans sucre, s’il vous plaît.', en: 'Without sugar, please.' },
    { fr: 'Encore un peu, merci.', en: 'A little more, thank you.' },
    { fr: 'C’était très bon.', en: 'It was very good.' },
    { fr: 'Où sont les toilettes ?', en: 'Where is the restroom?' },
    { fr: 'C’est loin d’ici ?', en: 'Is it far from here?' },
    { fr: 'C’est juste à côté.', en: "It's right next door." },
    { fr: 'Continuez tout droit.', en: 'Keep going straight.' },
    { fr: 'Tournez à gauche.', en: 'Turn left.' },
    { fr: 'C’est la prochaine rue.', en: "It's the next street." },
    { fr: 'Je suis un peu perdu.', en: "I'm a little lost." },
    { fr: 'Quel bus va au centre-ville ?', en: 'Which bus goes downtown?' },
    { fr: 'Le train part à quelle heure ?', en: 'What time does the train leave?' },
    { fr: 'Le train est en retard.', en: 'The train is late.' },
    { fr: 'C’est le bon quai ?', en: 'Is this the right platform?' },
    { fr: 'Je descends au prochain arrêt.', en: "I'm getting off at the next stop." },
    { fr: 'On se retrouve devant la gare.', en: "Let's meet in front of the station." },
    { fr: 'Je suis presque arrivé.', en: "I'm almost there." },
    { fr: 'Je serai un peu en retard.', en: "I'll be a little late." },
    { fr: 'Vous êtes libre ce soir ?', en: 'Are you free tonight?' },
    { fr: 'On se voit demain ?', en: 'Shall we see each other tomorrow?' },
    { fr: 'Ça vous dit de venir ?', en: 'Would you like to come?' },
    { fr: 'Désolé, je ne peux pas.', en: "Sorry, I can't." },
    { fr: 'Peut-être une autre fois.', en: 'Maybe another time.' },
    { fr: 'Je dois partir.', en: 'I have to go.' },
    { fr: 'À quelle heure vous commencez ?', en: 'What time do you start?' },
    { fr: 'Je travaille près d’ici.', en: 'I work near here.' },
    { fr: 'J’habite dans le quartier.', en: 'I live in the neighborhood.' },
    { fr: 'Je suis ici pour quelques jours.', en: "I'm here for a few days." },
    { fr: 'C’est la première fois que je viens.', en: "It's my first time here." },
  ],
)

const beginner = [
  ...expand(
    'beginner',
    'activities',
    ['daily life'],
    beginnerActivities,
    [
      {
        fr: (v) => `Je veux ${v}.`,
        en: (v) => `I want to ${v}.`,
      },
      {
        fr: (v) => `On va ${v} ?`,
        en: (v) => `Shall we ${v}?`,
      },
      {
        fr: (v) => `J'aimerais ${v} aujourd'hui.`,
        en: (v) => `I'd like to ${v} today.`,
      },
    ],
  ),

  ...expand(
    'beginner',
    'items',
    ['restaurants', 'shopping', 'travel'],
    beginnerItems,
    [
      {
        fr: (v) => `Je voudrais ${v}, s'il vous plaît.`,
        en: (v) => `I would like ${v}, please.`,
      },
      {
        fr: (v) => `Est-ce que vous avez ${v} ?`,
        en: (v) => `Do you have ${v}?`,
      },
      {
        fr: (v) => `Il me faut ${v}.`,
        en: (v) => `I need ${v}.`,
      },
    ],
  ),

  ...beginnerNatural,
  ...beginnerEveryday,
]

/* -------------------------------------------------------------------------- */
/* INTERMEDIATE                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Intermediate should introduce:
 *
 * - common conversational constructions
 * - pronouns
 * - conditionals
 * - connected ideas
 * - everyday French spoken at normal speed
 */

const intermediateActivities: Pair[] = [
  { fr: 'partir un peu plus tôt', en: 'leave a little earlier' },
  { fr: 'réserver avant de partir', en: 'book before we leave' },
  { fr: 'prendre la petite route', en: 'take the small road' },
  { fr: 's’arrêter prendre un café', en: 'stop for a coffee' },
  { fr: 'passer au marché', en: 'stop at the market' },
  { fr: 'manger quelque chose avant de partir', en: 'eat something before leaving' },
  { fr: 'appeler avant d’y aller', en: 'call before going there' },
  { fr: 'attendre encore quelques minutes', en: 'wait a few more minutes' },
  { fr: 'changer un peu l’itinéraire', en: 'change the route a little' },
  { fr: 'demander à quelqu’un', en: 'ask someone' },
  { fr: 'revenir demain matin', en: 'come back tomorrow morning' },
  { fr: 'faire un petit détour', en: 'make a small detour' },
]

const intermediateFacts: Pair[] = [
  { fr: 'le marché ferme à midi', en: 'the market closes at noon' },
  { fr: 'il va pleuvoir cet après-midi', en: "it's going to rain this afternoon" },
  { fr: 'le train a un peu de retard', en: 'the train is running a little late' },
  { fr: 'le restaurant est complet ce soir', en: 'the restaurant is fully booked tonight' },
  { fr: 'la route est fermée plus loin', en: 'the road is closed farther ahead' },
  { fr: 'on peut réserver en ligne', en: 'you can book online' },
  { fr: 'ils servent encore à cette heure-ci', en: 'they are still serving at this hour' },
  { fr: 'le temps devrait s’améliorer demain', en: 'the weather should improve tomorrow' },
  { fr: 'il y a un autre café juste à côté', en: 'there is another café right next door' },
  { fr: 'le dernier train part à dix heures', en: 'the last train leaves at ten' },
  { fr: 'le village est à une dizaine de kilomètres', en: 'the village is about ten kilometers away' },
  { fr: 'on peut laisser les vélos ici', en: 'we can leave the bikes here' },
]

const intermediateNatural = curated(
  'intermediate',
  'natural',
  ['conversation', 'travel', 'daily life'],
  [
    {
      fr: "Je me demande si ça vaut vraiment le détour.",
      en: "I wonder if it's really worth the detour.",
    },
    {
      fr: "On peut partir un peu plus tard, mais on risque d'arriver après la fermeture.",
      en: 'We can leave a little later, but we risk arriving after closing.',
    },
    {
      fr: "Si on se dépêche un peu, on peut passer au marché avant qu'il ferme.",
      en: 'If we hurry a little, we can stop at the market before it closes.',
    },
    {
      fr: "À ta place, j'appellerais avant d'y aller.",
      en: "If I were you, I'd call before going there.",
    },
    {
      fr: "Puisqu'on n'est pas pressés, autant prendre la petite route.",
      en: "Since we're not in a hurry, we might as well take the small road.",
    },
    {
      fr: "J'ai l'impression qu'il va pleuvoir, mais ça peut changer vite.",
      en: "I have the feeling it's going to rain, but that can change quickly.",
    },
    {
      fr: "On n'est pas obligés de faire tout le trajet aujourd'hui.",
      en: "We don't have to do the whole route today.",
    },
    {
      fr: "Vous connaissez un bon endroit pour dîner dans le coin ?",
      en: 'Do you know a good place to have dinner nearby?',
    },
    {
      fr: "Ça vaut peut-être la peine de réserver maintenant.",
      en: 'It might be worth booking now.',
    },
    {
      fr: "Je crois qu'il vaudrait mieux partir tôt demain matin.",
      en: 'I think it would be better to leave early tomorrow morning.',
    },
    {
      fr: "On a encore le temps de s'arrêter prendre un café.",
      en: 'We still have time to stop for a coffee.',
    },
    {
      fr: "Tu sais s'ils sont encore ouverts ?",
      en: 'Do you know if they are still open?',
    },
    {
      fr: "Je ne pensais pas que ce serait aussi loin.",
      en: "I didn't think it would be this far.",
    },
    {
      fr: "On verra bien quand on sera sur place.",
      en: "We'll see when we get there.",
    },
    {
      fr: "Ça dépend surtout du temps qu'il fera.",
      en: 'It mostly depends on what the weather is like.',
    },
  ],
)

const intermediate = [
  ...expand(
    'intermediate',
    'plans',
    ['plans', 'travel'],
    intermediateActivities,
    [
      {
        fr: (v) => `On ferait mieux de ${v}.`,
        en: (v) => `We'd better ${v}.`,
      },
      {
        fr: (v) => `Si on a le temps, on pourrait ${v}.`,
        en: (v) => `If we have time, we could ${v}.`,
      },
      {
        fr: (v) => `Ça te dirait de ${v} ?`,
        en: (v) => `Would you like to ${v}?`,
      },
    ],
  ),

  ...expand(
    'intermediate',
    'reported',
    ['conversation', 'travel'],
    intermediateFacts,
    [
      {
        fr: (v) => `Il paraît que ${v}.`,
        en: (v) => `Apparently, ${v}.`,
      },
      {
        fr: (v) => `Je crois que ${v}.`,
        en: (v) => `I think ${v}.`,
      },
      {
        fr: (v) => `Tu sais si ${v} ?`,
        en: (v) => `Do you know if ${v}?`,
      },
    ],
  ),

  ...intermediateNatural,
]

/* -------------------------------------------------------------------------- */
/* ADVANCED                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * "Advanced" in Echo should not mean business vocabulary.
 *
 * It should mean:
 *
 * - more natural spoken rhythm
 * - discourse markers
 * - implied meaning
 * - idiomatic constructions
 * - longer thought groups
 * - expressions learners often know on paper but miss by ear
 */

const advancedUsefulActions: Pair[] = [
  { fr: 'partir maintenant', en: 'leave now' },
  { fr: 'réserver tout de suite', en: 'book right away' },
  { fr: 'prendre la route la plus tranquille', en: 'take the quieter road' },
  { fr: 'demander avant de partir', en: 'ask before leaving' },
  { fr: 'attendre que la pluie passe', en: 'wait for the rain to pass' },
  { fr: 'faire le détour', en: 'make the detour' },
  { fr: 'changer nos plans', en: 'change our plans' },
  { fr: 'vérifier les horaires', en: 'check the opening times' },
  { fr: 's’arrêter ici pour déjeuner', en: 'stop here for lunch' },
  { fr: 'garder un peu de temps pour demain', en: 'save some time for tomorrow' },
  { fr: 'appeler pour être sûrs', en: 'call to make sure' },
  { fr: 'prendre notre temps', en: 'take our time' },
]

const advancedNatural = curated(
  'advanced',
  'natural',
  ['conversation', 'spoken french'],
  [
    {
      fr: "Bah, si on part maintenant, on devrait y être vers huit heures.",
      en: 'Well, if we leave now, we should get there around eight.',
    },
    {
      fr: "Du coup, on fait quoi ? On continue ou on s'arrête ici ?",
      en: 'So what do we do? Keep going or stop here?',
    },
    {
      fr: "En fait, je pensais que ce serait beaucoup plus touristique.",
      en: 'Actually, I thought it would be much more touristy.',
    },
    {
      fr: "Ça m'étonnerait qu'ils soient encore ouverts à cette heure-ci.",
      en: "I'd be surprised if they're still open at this hour.",
    },
    {
      fr: "On aurait dû appeler avant, mais bon, c'est pas très grave.",
      en: "We should have called first, but it's not a big deal.",
    },
    {
      fr: "Je sais pas trop, j'hésite entre les deux.",
      en: "I'm not really sure; I'm torn between the two.",
    },
    {
      fr: "Tant qu'à être ici, autant aller voir le village.",
      en: "Since we're already here, we might as well go see the village.",
    },
    {
      fr: "À mon avis, ça vaut le coup, surtout si on a le temps.",
      en: "In my opinion, it's worth it, especially if we have time.",
    },
    {
      fr: "C'est pas que je veux pas y aller, c'est juste qu'on est un peu tard.",
      en: "It's not that I don't want to go; it's just that we're a little late.",
    },
    {
      fr: "Même s'il pleut un peu, ça devrait aller.",
      en: 'Even if it rains a little, it should be fine.',
    },
    {
      fr: "Je pensais qu'on aurait plus de temps que ça.",
      en: 'I thought we would have more time than this.',
    },
    {
      fr: "Ça dépend de ce qu'on veut faire après.",
      en: 'It depends on what we want to do afterward.',
    },
    {
      fr: "Franchement, je crois que je préfère rester ici.",
      en: 'Honestly, I think I prefer staying here.',
    },
    {
      fr: "Finalement, c'était peut-être mieux comme ça.",
      en: 'In the end, maybe it was better this way.',
    },
    {
      fr: "De toute façon, on pourra toujours revenir demain.",
      en: 'Anyway, we can always come back tomorrow.',
    },
    {
      fr: "J'aurais tendance à dire oui, mais ça dépend du prix.",
      en: "I'd tend to say yes, but it depends on the price.",
    },
    {
      fr: "Je vois ce que tu veux dire, mais je suis pas tout à fait d'accord.",
      en: "I see what you mean, but I don't completely agree.",
    },
    {
      fr: "C'est quand même dommage de repartir sans avoir vu le marché.",
      en: "It's still a shame to leave without having seen the market.",
    },
    {
      fr: "On s'est dit qu'on verrait sur place.",
      en: "We figured we'd decide once we got there.",
    },
    {
      fr: "Au pire, si c'est fermé, on trouvera autre chose.",
      en: "Worst case, if it's closed, we'll find something else.",
    },
  ],
)

const advancedListening = curated(
  'advanced',
  'listening',
  ['spoken french', 'fast french'],
  [
    {
      fr: "T'as eu le temps de regarder les horaires ?",
      en: 'Did you have time to check the opening times?',
    },
    {
      fr: "Je sais pas si t'as vu, mais ils annoncent de la pluie.",
      en: "I don't know if you saw, but they're forecasting rain.",
    },
    {
      fr: "Y a un petit resto juste au bout de la rue.",
      en: "There's a little restaurant right at the end of the street.",
    },
    {
      fr: "T'inquiète, on a largement le temps.",
      en: "Don't worry, we have plenty of time.",
    },
    {
      fr: "J'y suis jamais allé, mais on m'a dit que c'était sympa.",
      en: "I've never been there, but I've heard it's nice.",
    },
    {
      fr: "Ça te dérange si on s'arrête cinq minutes ?",
      en: 'Do you mind if we stop for five minutes?',
    },
    {
      fr: "Je croyais qu'on devait tourner à gauche ici.",
      en: 'I thought we were supposed to turn left here.',
    },
    {
      fr: "Attends, je regarde vite fait sur la carte.",
      en: 'Hang on, let me quickly check the map.',
    },
    {
      fr: "On ferait peut-être mieux de demander à quelqu'un.",
      en: 'Maybe we should ask someone.',
    },
    {
      fr: "Ça fait déjà une heure qu'on roule.",
      en: "We've already been riding for an hour.",
    },
    {
      fr: "T'es sûr que c'est par là ?",
      en: "Are you sure it's this way?",
    },
    {
      fr: "J'ai pas envie de me retrouver coincé sous la pluie.",
      en: "I don't want to end up stuck in the rain.",
    },
    {
      fr: "On verra bien, de toute façon on n'est pas pressés.",
      en: "We'll see; anyway, we're not in a hurry.",
    },
    {
      fr: "Ça aurait été dommage de passer à côté.",
      en: 'It would have been a shame to miss it.',
    },
    {
      fr: "Je pensais pas que ça monterait autant.",
      en: "I didn't think it would climb this much.",
    },
  ],
)

const advanced = [
  ...expand(
    'advanced',
    'choices',
    ['conversation', 'decisions'],
    advancedUsefulActions,
    [
      {
        fr: (v) => `On aurait intérêt à ${v}.`,
        en: (v) => `We'd probably be better off if we ${v}.`,
      },
      {
        fr: (v) => `Je me demande si ça vaut vraiment le coup de ${v}.`,
        en: (v) => `I wonder if it's really worth it to ${v}.`,
      },
      {
        fr: (v) => `Tant qu'à faire, autant ${v}.`,
        en: (v) => `Since we're at it, we might as well ${v}.`,
      },
    ],
  ),

  ...advancedNatural,
  ...advancedListening,
]

export const frenchLessons: Lesson[] = [
  ...beginner,
  ...intermediate,
  ...advanced,
]
