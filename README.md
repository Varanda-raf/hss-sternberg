# Recherche en mémoire à court terme

Projet HSS « Approches expérimentales de la cognition », inspiré de la tâche de Sternberg. Nous étudions le temps de reconnaissance selon la longueur de la série. Deux tests séparés permettent d'examiner les performances avec des chiffres et avec des symboles abstraits.

## Lancer ou partager le test

- [Lien de passation](https://varanda-raf.github.io/hss-sternberg/) sur téléphone ou ordinateur.
- [Lien pour le pilote](https://varanda-raf.github.io/hss-sternberg/?pilot=1), qui suit le même parcours et marque le CSV `pilot`.

Chaque personne choisit une seule version, chiffres familiers ou symboles abstraits. Elle réalise 2 essais d’entraînement et 36 essais de test, avec des séries de 1 à 6 éléments. Le parcours chronométré dure environ 7 minutes si chaque délai de réponse est utilisé en entier. Il s’arrête dans tous les cas à la limite de 10 minutes après le démarrage.

Avec un lien d’invitation de collecte, le résultat est envoyé automatiquement à la fin du test et l’écran confirme sa réception. Le téléchargement d’une copie reste possible. Le lien pilote ci-dessus permet de vérifier le parcours et de télécharger le CSV pour un retour manuel. Si la limite est atteinte, le CSV reprend les essais déjà terminés et signale la session incomplète.

Le lien d’invitation demande le nom et l’e-mail avant le démarrage du test. Le collecteur enregistre les réponses et l’identification séparément, avec un identifiant de session aléatoire commun. Sur le poste du responsable, exécuter `./collecte/recuperar-csvs.ps1` dans PowerShell 7 pour rapatrier les CSV dans `data/piloto/` ou `data/coleta/` et les identifications dans `data/identificacao/participantes.tsv`. Le registre signale les adresses saisies plusieurs fois, indépendamment des majuscules. La commande utilise la configuration privée locale `data/.collector-local.json`.

Pour lancer la même version localement, exécuter depuis la racine du dépôt, avec Python 3 :

```sh
python -m http.server --bind 127.0.0.1 --directory docs 8000
```

Ouvrir ensuite [la page locale](http://127.0.0.1:8000/) pour une session en présentiel, ou [la page pilote locale](http://127.0.0.1:8000/?pilot=1) pour une vérification. Les sessions locales portent le code `presentiel` et les sessions sur le lien public, `distance`. La tâche ne requiert aucune bibliothèque JavaScript externe.

## Plan du pilote et de la collecte

1. Faire passer les deux versions sur ordinateur et téléphone avec le lien pilote. Chronométrer depuis la lecture des consignes jusqu’au téléchargement, vérifier les essais de six éléments et demander quels glyphes évoquent des symboles déjà connus.
2. Avec le lien d’invitation de collecte, vérifier la confirmation à l’écran et la récupération du CSV, puis figer les stimuli, les paramètres de passation et les critères d’exclusion. Si un paramètre expérimental change, incrémenter `protocol_version`.
3. Envoyer le lien de passation et suivre le nombre de sessions terminées par type de symbole et par modalité. Conserver les CSV dans `data/`, ignoré par Git.

Exemple d’invitation après le pilote

> Bonjour ! Je vous invite à faire un court test de mémoire pour un projet de cours. Choisissez une seule version et prévoyez jusqu’à 10 minutes pour le test. À la fin, téléchargez le fichier CSV et renvoyez-le dans cette conversation privée. Merci ! https://varanda-raf.github.io/hss-sternberg/

## Organisation

- [Protocole](protocole.md) — déroulement des essais, modalités de passation et pilote.
- [Plan d'analyse](analyse/plan.md) — mesures, comparaison des modalités et format des données.
- [Code de la tâche](docs/experiment.js) — chronométrage, décision et export.
- [Génération des essais](docs/trials.js) — stimuli et équilibre des essais.

GitHub Pages publie la version web depuis `docs/`. Les données individuelles de collecte sont conservées hors publication.
