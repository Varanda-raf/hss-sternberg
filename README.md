# Recherche en mémoire à court terme

Projet HSS « Approches expérimentales de la cognition », inspiré de la tâche de Sternberg. Nous étudions comment la longueur d'une série et le type de symbole, chiffre ou lettre, modifient le temps de reconnaissance et le rappel en ordre. La même tâche sera utilisée en présentiel et à distance.

## Essayer la démonstration

[Ouvrir la démonstration sur GitHub Pages](https://varanda-raf.github.io/hss-sternberg/).

La démonstration propose 12 essais. Le mode pilote comprend 144 essais et quatre essais d'entraînement. Les deux modes présentent des séries de 1 à 6 symboles et demandent un rappel écrit après chaque décision. Utiliser un ordinateur avec un clavier physique. Le CSV est téléchargeable à la fin de la session.

Pour lancer la même version localement, exécuter depuis la racine du dépôt, avec Python 3 :

```sh
python -m http.server --bind 127.0.0.1 --directory docs 8000
```

Ouvrir ensuite [la page locale](http://127.0.0.1:8000/). La tâche ne requiert aucune bibliothèque JavaScript externe.

## Organisation

- [Protocole](protocole.md) — déroulement des essais, modalités de passation et pilote.
- [Plan d'analyse](analyse/plan.md) — mesures, comparaison des modalités et format des données.
- [Code de la tâche](docs/experiment.js) — chronométrage, décision, rappel et export.
- [Génération des essais](docs/trials.js) — stimuli, ordre des conditions et équilibre des essais.

Le protocole et le plan d'analyse sont des versions de travail à finaliser après le pilote. Les fichiers individuels de collecte seront conservés hors publication dans `data/`, ignoré par Git.
