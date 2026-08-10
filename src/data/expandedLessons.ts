import type { Lesson } from '../types'

type Pair = { fr: string; en: string }
type Template = { fr: (value: string) => string; en: (value: string) => string }

function expand(level: Lesson['level'], group: string, topics: string[], values: Pair[], templates: Template[]): Lesson[] {
  return templates.flatMap((template, templateIndex) => values.map((value, valueIndex) => {
    const number = templateIndex * values.length + valueIndex + 1
    return {
      id: `fr-${level}-${group}-${String(number).padStart(3, '0')}`,
      language: 'fr',
      level,
      sentence: template.fr(value.fr),
      english: template.en(value.en),
      audio: `/audio/fr/${level}/${group}-${String(number).padStart(3, '0')}.mp3`,
      notes: [],
      topics
    }
  }))
}

const beginnerActivities: Pair[] = [
  { fr: 'prendre un café', en: 'have a coffee' }, { fr: 'faire une promenade', en: 'go for a walk' },
  { fr: 'visiter le musée', en: 'visit the museum' }, { fr: 'regarder un film', en: 'watch a movie' },
  { fr: 'préparer le dîner', en: 'make dinner' }, { fr: 'écouter de la musique', en: 'listen to music' },
  { fr: 'acheter du pain', en: 'buy some bread' }, { fr: 'prendre le train', en: 'take the train' },
  { fr: 'appeler mes parents', en: 'call my parents' }, { fr: 'réserver une table', en: 'book a table' },
  { fr: 'apprendre le français', en: 'learn French' }, { fr: 'faire les courses', en: 'go grocery shopping' },
  { fr: 'rentrer à la maison', en: 'go home' }, { fr: 'déjeuner en terrasse', en: 'have lunch outside' },
  { fr: 'prendre une photo', en: 'take a picture' }
]
const beginnerItems: Pair[] = [
  { fr: "une bouteille d'eau", en: 'a bottle of water' }, { fr: 'un billet de train', en: 'a train ticket' },
  { fr: 'une carte de la ville', en: 'a map of the city' }, { fr: 'un parapluie', en: 'an umbrella' },
  { fr: 'du fromage', en: 'some cheese' }, { fr: 'un chargeur', en: 'a charger' },
  { fr: 'une chambre calme', en: 'a quiet room' }, { fr: 'deux croissants', en: 'two croissants' },
  { fr: 'un reçu', en: 'a receipt' }, { fr: 'une réservation', en: 'a reservation' },
  { fr: 'un taxi', en: 'a taxi' }, { fr: 'des timbres', en: 'some stamps' },
  { fr: 'une serviette propre', en: 'a clean towel' }, { fr: 'un peu de monnaie', en: 'some change' },
  { fr: 'une autre taille', en: 'another size' }
]
const beginnerDestinations: Pair[] = [
  { fr: 'au marché', en: 'to the market' }, { fr: 'à la bibliothèque', en: 'to the library' },
  { fr: 'au centre-ville', en: 'downtown' }, { fr: 'chez le médecin', en: "to the doctor's" },
  { fr: 'à la boulangerie', en: 'to the bakery' }, { fr: 'au parc', en: 'to the park' },
  { fr: 'à la piscine', en: 'to the swimming pool' }, { fr: 'au bureau', en: 'to the office' },
  { fr: 'à la gare', en: 'to the station' }, { fr: 'au restaurant', en: 'to the restaurant' },
  { fr: 'à la pharmacie', en: 'to the pharmacy' }, { fr: 'chez des amis', en: "to some friends' house" },
  { fr: "à l'aéroport", en: 'to the airport' }, { fr: 'au supermarché', en: 'to the supermarket' },
  { fr: 'à la plage', en: 'to the beach' }
]

const beginner = [
  ...expand('beginner', 'activities', ['daily life'], beginnerActivities, [
    { fr: (v) => `Je veux ${v}.`, en: (v) => `I want to ${v}.` },
    { fr: (v) => `Je vais ${v} demain.`, en: (v) => `I'm going to ${v} tomorrow.` },
    { fr: (v) => `Est-ce que tu veux ${v} avec moi ?`, en: (v) => `Do you want to ${v} with me?` }
  ]),
  ...expand('beginner', 'items', ['shopping'], beginnerItems, [
    { fr: (v) => `Je voudrais ${v}, s'il vous plaît.`, en: (v) => `I would like ${v}, please.` },
    { fr: (v) => `Où est-ce que je peux acheter ${v} ?`, en: (v) => `Where can I buy ${v}?` },
    { fr: (v) => `Il me faut ${v}.`, en: (v) => `I need ${v}.` }
  ]),
  ...expand('beginner', 'places', ['places'], beginnerDestinations, [
    { fr: (v) => `Je vais ${v}.`, en: (v) => `I'm going ${v}.` },
    { fr: (v) => `On peut se retrouver ${v}.`, en: (v) => `We can meet ${v}.` },
    { fr: (v) => `Tu vas souvent ${v} ?`, en: (v) => `Do you often go ${v}?` }
  ])
]

const intermediatePlans: Pair[] = [
  { fr: 'changer de travail', en: 'change jobs' }, { fr: 'partir quelques jours', en: 'go away for a few days' },
  { fr: 'déménager en septembre', en: 'move in September' }, { fr: 'suivre un cours du soir', en: 'take an evening class' },
  { fr: 'inviter nos voisins', en: 'invite our neighbors' }, { fr: 'louer une voiture', en: 'rent a car' },
  { fr: 'reporter la réunion', en: 'postpone the meeting' }, { fr: 'repeindre la cuisine', en: 'repaint the kitchen' },
  { fr: 'passer le week-end à Lyon', en: 'spend the weekend in Lyon' }, { fr: 'travailler à distance', en: 'work remotely' },
  { fr: 'prendre quelques jours de congé', en: 'take a few days off' }, { fr: 'organiser une fête', en: 'organize a party' },
  { fr: 'commencer plus tôt', en: 'start earlier' }, { fr: 'essayer ce nouveau restaurant', en: 'try this new restaurant' },
  { fr: 'faire réparer le vélo', en: 'have the bike repaired' }
]
const intermediateFacts: Pair[] = [
  { fr: 'le magasin a changé de propriétaire', en: 'the shop has changed owners' },
  { fr: 'le train partira avec du retard', en: 'the train will leave late' },
  { fr: 'ils ont annulé le concert', en: 'they canceled the concert' },
  { fr: 'ce quartier devient de plus en plus cher', en: 'this neighborhood is getting more and more expensive' },
  { fr: 'la route est fermée pour travaux', en: 'the road is closed for construction' },
  { fr: 'Marie cherche un nouvel appartement', en: 'Marie is looking for a new apartment' },
  { fr: 'le menu change chaque semaine', en: 'the menu changes every week' },
  { fr: 'nous devons réserver à l’avance', en: 'we need to book in advance' },
  { fr: 'la météo va s’améliorer demain', en: 'the weather will improve tomorrow' },
  { fr: 'Paul connaît bien la région', en: 'Paul knows the area well' },
  { fr: 'le musée est gratuit le dimanche', en: 'the museum is free on Sundays' },
  { fr: 'notre vol a été déplacé', en: 'our flight has been rescheduled' },
  { fr: 'elle travaille désormais à son compte', en: 'she now works for herself' },
  { fr: 'ce modèle existe en plusieurs couleurs', en: 'this model comes in several colors' },
  { fr: 'la réservation peut être modifiée', en: 'the reservation can be changed' }
]
const intermediateChallenges: Pair[] = [
  { fr: 'me concentrer quand il y a du bruit', en: 'concentrate when it is noisy' },
  { fr: 'comprendre les annonces à la gare', en: 'understand the announcements at the station' },
  { fr: 'trouver du temps pour faire du sport', en: 'find time to exercise' },
  { fr: 'me lever tôt le week-end', en: 'get up early on weekends' },
  { fr: 'choisir entre les deux options', en: 'choose between the two options' },
  { fr: 'retenir les nouveaux mots', en: 'remember new words' },
  { fr: 'suivre une conversation rapide', en: 'follow a fast conversation' },
  { fr: 'terminer ce travail avant lundi', en: 'finish this work before Monday' },
  { fr: 'dire non sans me sentir coupable', en: 'say no without feeling guilty' },
  { fr: 'garder mon calme dans les embouteillages', en: 'stay calm in traffic' },
  { fr: 'prendre une décision aussi vite', en: 'make a decision this quickly' },
  { fr: 'expliquer clairement ce qui s’est passé', en: 'clearly explain what happened' },
  { fr: 'm’habituer à ce nouvel horaire', en: 'get used to this new schedule' },
  { fr: 'faire confiance à cette information', en: 'trust this information' },
  { fr: 'résoudre le problème tout seul', en: 'solve the problem on my own' }
]

const intermediate = [
  ...expand('intermediate', 'plans', ['plans'], intermediatePlans, [
    { fr: (v) => `J'envisage de ${v}.`, en: (v) => `I'm thinking about whether to ${v}.` },
    { fr: (v) => `On a finalement décidé de ${v}.`, en: (v) => `We finally decided to ${v}.` },
    { fr: (v) => `Ça te dirait de ${v} ?`, en: (v) => `Would you like to ${v}?` }
  ]),
  ...expand('intermediate', 'reports', ['news'], intermediateFacts, [
    { fr: (v) => `Je ne savais pas que ${v}.`, en: (v) => `I didn't know that ${v}.` },
    { fr: (v) => `Il paraît que ${v}.`, en: (v) => `Apparently, ${v}.` },
    { fr: (v) => `Tu es sûr que ${v} ?`, en: (v) => `Are you sure that ${v}?` }
  ]),
  ...expand('intermediate', 'challenges', ['daily life'], intermediateChallenges, [
    { fr: (v) => `J'ai du mal à ${v}.`, en: (v) => `It is difficult for me to ${v}.` },
    { fr: (v) => `J'essaie de ${v}.`, en: (v) => `I'm trying to ${v}.` },
    { fr: (v) => `Je devrais réussir à ${v}.`, en: (v) => `I should manage to ${v}.` }
  ])
]

const advancedActions: Pair[] = [
  { fr: 'revoir entièrement notre stratégie', en: 'completely rethink our strategy' },
  { fr: 'consulter toutes les personnes concernées', en: 'consult everyone involved' },
  { fr: 'prévoir une solution de repli', en: 'plan a fallback solution' },
  { fr: 'tenir compte des conséquences à long terme', en: 'consider the long-term consequences' },
  { fr: 'clarifier les responsabilités de chacun', en: "clarify everyone's responsibilities" },
  { fr: 'remettre en question certaines hypothèses', en: 'question certain assumptions' },
  { fr: 'chercher un compromis acceptable', en: 'look for an acceptable compromise' },
  { fr: 'vérifier la fiabilité de ces données', en: 'check the reliability of this data' },
  { fr: 'anticiper les objections les plus probables', en: 'anticipate the most likely objections' },
  { fr: 'reconnaître ouvertement notre erreur', en: 'openly acknowledge our mistake' },
  { fr: 'définir des objectifs plus réalistes', en: 'set more realistic goals' },
  { fr: 'faire appel à un expert indépendant', en: 'bring in an independent expert' },
  { fr: 'examiner la question sous un autre angle', en: 'look at the issue from another angle' },
  { fr: 'prendre du recul avant de répondre', en: 'step back before responding' },
  { fr: 'renégocier les conditions du contrat', en: 'renegotiate the terms of the contract' }
]
const advancedClaims: Pair[] = [
  { fr: 'la situation continuera d’évoluer', en: 'the situation will continue to evolve' },
  { fr: 'les résultats ont été largement surestimés', en: 'the results were greatly overestimated' },
  { fr: 'cette mesure aura des effets inattendus', en: 'this measure will have unexpected effects' },
  { fr: 'le débat est loin d’être terminé', en: 'the debate is far from over' },
  { fr: 'plusieurs facteurs ont été négligés', en: 'several factors were overlooked' },
  { fr: 'la demande dépassera bientôt l’offre', en: 'demand will soon exceed supply' },
  { fr: 'leur décision était motivée par la prudence', en: 'their decision was motivated by caution' },
  { fr: 'les deux phénomènes sont étroitement liés', en: 'the two phenomena are closely linked' },
  { fr: 'le calendrier devra être revu', en: 'the schedule will need to be revised' },
  { fr: 'les apparences peuvent être trompeuses', en: 'appearances can be deceptive' },
  { fr: 'aucune solution ne fera l’unanimité', en: 'no solution will be unanimously accepted' },
  { fr: 'le coût réel reste difficile à évaluer', en: 'the real cost remains difficult to assess' },
  { fr: 'cette tendance finira par s’inverser', en: 'this trend will eventually reverse' },
  { fr: 'les priorités ont profondément changé', en: 'the priorities have changed profoundly' },
  { fr: 'un simple retard pourrait tout compromettre', en: 'a simple delay could jeopardize everything' }
]
const advancedDecisions: Pair[] = [
  { fr: 'modifier les règles en cours de route', en: 'change the rules halfway through' },
  { fr: 'tirer des conclusions trop hâtives', en: 'jump to conclusions' },
  { fr: 'écarter cette possibilité sans l’étudier', en: 'dismiss this possibility without examining it' },
  { fr: 's’engager sur un délai irréaliste', en: 'commit to an unrealistic deadline' },
  { fr: 'privilégier la rapidité au détriment de la qualité', en: 'favor speed at the expense of quality' },
  { fr: 'ignorer les avertissements répétés', en: 'ignore the repeated warnings' },
  { fr: 'généraliser à partir d’un seul exemple', en: 'generalize from a single example' },
  { fr: 'bouleverser une organisation qui fonctionne', en: 'disrupt an organization that works' },
  { fr: 'présenter une estimation comme une certitude', en: 'present an estimate as a certainty' },
  { fr: 'reporter indéfiniment la décision', en: 'postpone the decision indefinitely' },
  { fr: 'minimiser les difficultés rencontrées', en: 'downplay the difficulties encountered' },
  { fr: 'confondre corrélation et causalité', en: 'confuse correlation with causation' },
  { fr: 'imposer une solution toute faite', en: 'impose a ready-made solution' },
  { fr: 'négliger les besoins des utilisateurs', en: 'neglect users’ needs' },
  { fr: 'promettre des résultats impossibles à garantir', en: 'promise results that cannot be guaranteed' }
]

const advanced = [
  ...expand('advanced', 'strategy', ['work', 'decisions'], advancedActions, [
    { fr: (v) => `Il aurait mieux valu ${v}.`, en: (v) => `It would have been better to ${v}.` },
    { fr: (v) => `Rien ne nous empêche de ${v}.`, en: (v) => `Nothing prevents us from choosing to ${v}.` },
    { fr: (v) => `On aurait tout intérêt à ${v}.`, en: (v) => `It would be in our best interest to ${v}.` }
  ]),
  ...expand('advanced', 'analysis', ['analysis'], advancedClaims, [
    { fr: (v) => `Il ne fait aucun doute que ${v}.`, en: (v) => `There is no doubt that ${v}.` },
    { fr: (v) => `On aurait tort de prétendre que ${v}.`, en: (v) => `It would be wrong to claim that ${v}.` },
    { fr: (v) => `Tout porte à croire que ${v}.`, en: (v) => `Everything suggests that ${v}.` }
  ]),
  ...expand('advanced', 'judgment', ['decisions'], advancedDecisions, [
    { fr: (v) => `Avant de ${v}, il faudrait en mesurer les conséquences.`, en: (v) => `Before we ${v}, we should assess the consequences.` },
    { fr: (v) => `Plutôt que de ${v}, nous devrions chercher une autre solution.`, en: (v) => `Rather than ${v}, we should look for another solution.` },
    { fr: (v) => `Le simple fait de ${v} ne garantit pas le résultat.`, en: (v) => `Simply choosing to ${v} does not guarantee the result.` }
  ])
]

export const expandedLessons: Lesson[] = [...beginner, ...intermediate, ...advanced]
