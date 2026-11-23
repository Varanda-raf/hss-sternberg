# Recherche en mémoire à court terme

Projet HSS « Approches expérimentales de la cognition », inspiré de la tâche de Sternberg. Nous étudions le temps de reconnaissance et le rappel en ordre selon la longueur de la série. Deux tests séparés permettent d'examiner les performances avec des chiffres et avec des symboles abstraits. Chaque test est accessible en présentiel et à distance.

## Essayer la démonstration

[Ouvrir la démonstration sur GitHub Pages](https://varanda-raf.github.io/hss-sternberg/).

Choisir le test de chiffres ou de symboles abstraits avant de commencer. Pour le test choisi, la démonstration propose 6 essais et le mode pilote comprend 72 essais et deux essais d'entraînement. Les deux tests présentent des séries de 1 à 6 éléments. Après chaque décision, une grille permet de reconstituer la série dans l'ordre. Utiliser un ordinateur avec un clavier physique. Le CSV est téléchargeable à la fin de la session.

Pour lancer la même version localement, exécuter depuis la racine du dépôt, avec Python 3 :

```sh
python -m http.server --bind 127.0.0.1 --directory docs 8000
```

Ouvrir ensuite [la page locale](http://127.0.0.1:8000/). La tâche ne requiert aucune bibliothèque JavaScript externe.

## Organisation

- [Protocole](protocole.md) — déroulement des essais, modalités de passation et pilote.
- [Plan d'analyse](analyse/plan.md) — mesures, comparaison des modalités et format des données.
- [Code de la tâche](docs/experiment.js) — chronométrage, décision, rappel et export.
- [Génération des essais](docs/trials.js) — stimuli et équilibre des essais.

Le protocole et le plan d'analyse sont des versions de travail à finaliser après le pilote. Les fichiers individuels de collecte seront conservés hors publication dans `data/`, ignoré par Git.
