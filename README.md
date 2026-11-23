# Recherche en mémoire à court terme

Projet HSS « Approches expérimentales de la cognition », inspiré de la tâche de Sternberg. Nous étudions comment le nombre de chiffres à mémoriser modifie le temps nécessaire pour décider si un chiffre figurait dans une liste. La même tâche sera utilisée en présentiel et à distance.

## Essayer la démonstration

[Ouvrir la démonstration sur GitHub Pages](https://varanda-raf.github.io/hss-sternberg/).

La démonstration propose six essais sur ordinateur avec un clavier physique. Elle sert à vérifier le déroulement de la tâche et l'export CSV. Les réponses restent dans le navigateur jusqu'au téléchargement et aucun envoi automatique n'est effectué.

Pour lancer la même version localement, exécuter depuis la racine du dépôt, avec Python 3 :

```sh
python -m http.server --bind 127.0.0.1 --directory docs 8000
```

Ouvrir ensuite [la page locale](http://127.0.0.1:8000/). La tâche ne requiert aucune bibliothèque JavaScript externe.

## Organisation

- [Protocole](protocole.md) — déroulement des essais, modalités de passation et pilote.
- [Plan d'analyse](analyse/plan.md) — mesures, comparaison des modalités et format des données.
- [Code de la démonstration](docs/experiment.js) — chronométrage, réponses et export.

Le protocole et le plan d'analyse sont des versions de travail à finaliser après le pilote. Les fichiers individuels de collecte seront conservés hors publication dans `data/`, ignoré par Git.
