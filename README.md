# Recherche en mémoire à court terme

Projet HSS « Approches expérimentales de la cognition », inspiré de la tâche de Sternberg. Nous étudions le temps de reconnaissance selon la longueur de la série. Deux tests séparés permettent d'examiner les performances avec des chiffres et avec des symboles abstraits.

## Essayer ou partager la démonstration

[Ouvrir la démonstration](https://varanda-raf.github.io/hss-sternberg/?v=4) sur téléphone ou ordinateur.

Chaque personne choisit un test de 6 essais, avec des séries de 1 à 6 éléments. Elle répond avec les boutons « Oui » et « Non ». Le site public enregistre la modalité à distance automatiquement.

Envoyer le lien par message privé et indiquer dans l'invitation que la personne doit télécharger le CSV à la fin et le renvoyer dans la même conversation. Le site génère le fichier dans le navigateur. Les réponses restent dans le navigateur jusqu'au téléchargement.

Pour lancer la même version localement, exécuter depuis la racine du dépôt, avec Python 3 :

```sh
python -m http.server --bind 127.0.0.1 --directory docs 8000
```

Ouvrir ensuite [la page locale](http://127.0.0.1:8000/) pour une passation en présentiel. La tâche ne requiert aucune bibliothèque JavaScript externe.

## Organisation

- [Protocole](protocole.md) — déroulement des essais, modalités de passation et pilote.
- [Plan d'analyse](analyse/plan.md) — mesures, comparaison des modalités et format des données.
- [Code de la tâche](docs/experiment.js) — chronométrage, décision et export.
- [Génération des essais](docs/trials.js) — stimuli et équilibre des essais.

Le protocole et le plan d'analyse sont des versions de travail à finaliser après le pilote. Les fichiers individuels de collecte seront conservés hors publication dans `data/`, ignoré par Git.
