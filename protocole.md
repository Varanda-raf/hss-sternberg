# Protocole de l'expérience

## Question et hypothèses

Le temps de décision augmente-t-il avec le nombre d'éléments à mémoriser ? Nous prévoyons un temps de réponse plus long pour les séries de six chiffres que pour celles de deux chiffres. Nous examinerons aussi si cette augmentation diffère entre les tests de chiffres et de symboles abstraits, ainsi qu'entre les passations en présentiel et à distance.

## Déroulement d'un essai

La version 5 reprend les deux durées publiées pour l'expérience 1. La condition chiffres utilise les stimuli d'origine. La condition symboles abstraits étend la tâche aux formes inventées. [Sternberg, 1966, expérience 1, p. 652](https://doi.org/10.1126/science.153.3736.652)

| Étape | Sternberg, expérience 1 | Version web (protocole 5) |
| --- | --- | --- |
| Croix de fixation | — | 500 ms |
| Série de 1 à 6 éléments distincts | 1 200 ms par chiffre, de 0 à 9 | 1 200 ms par chiffre ou symbole abstrait |
| Attente après le dernier élément | 2 000 ms | 2 000 ms |
| Signal d'avertissement | Signal avant l’élément de test | Point pendant 250 ms |
| Décision | Deux leviers | Boutons « Oui » et « Non », délai de 4 000 ms |
| Après la décision | Voyant d’exactitude, puis rappel de la série dans l’ordre | Retour pendant l’entraînement. Dans le bloc de test, la décision termine l’essai. |
| Essais par personne | 24 d’entraînement et 144 de test | 2 d’entraînement et 36 de test |

Le temps de décision part de l'affichage du symbole de test et s'arrête à l'activation d'un bouton. Le mode de réponse est enregistré. Dans l’expérience 1, le rappel dans l’ordre servait à faire conserver la série et son ordre jusqu’à la décision. Pour 144 essais répartis également sur les six longueurs, la présentation et l’attente seules prendraient environ 15 minutes. [Sternberg, 1969, Exp. 1](https://web.stanford.edu/class/psych205/papers/Sternberg-1969.pdf)

L’entraînement web comprend 2 essais, avec une cible présente pour une série de 2 et une cible absente pour une série de 4, dans un ordre aléatoire. Le retour est affiché pendant 1 200 ms après chaque essai d’entraînement. Une transition de 3 000 ms précède le test. Les essais du test s’enchaînent sans pause programmée et sans retour sur l’exactitude.

## Plan de collecte

- **Deux tests séparés.** Chaque personne choisit les chiffres de 0 à 9 ou dix glyphes abstraits inventés. Les deux tests ont les mêmes longueurs et durées.
- **Nombre d'essais.** Le test comporte 36 essais, répartis en trois blocs de 12. Chaque longueur apparaît six fois, dont trois avec une cible présente et trois avec une cible absente. Les positions des cibles présentes sont réparties sur l’ensemble du test. L’ordre des essais est mélangé dans chaque bloc.
- **Durée.** Si tous les délais de réponse sont utilisés, les durées programmées totalisent 7 minutes et 0,3 seconde, auxquelles s’ajoute le temps de rendu du navigateur. Au bout de 10 minutes après le démarrage, le test s’arrête et conserve les essais déjà terminés pour l’export.
- **Modalité.** Le site public enregistre une session à distance et la version lancée sur la machine de l'expérimentateur via localhost enregistre une session en présentiel. L'appareil et la modalité peuvent varier ensemble.
- **Mêmes conditions logicielles.** Les mêmes boutons et instructions sont disponibles sur téléphone et ordinateur. Le CSV consigne le mode de réponse, le navigateur, la taille de la fenêtre et les pertes de focus. Pour comparer les modalités, privilégier les contrastes de temps mesurés avec un type d'appareil et de réponse comparable.
- **Effectif.** Le minimum du cours est de dix participants au total. Pour comparer les modalités, viser dix sessions valides par modalité si le recrutement le permet et suivre la répartition entre les deux tests. Une comparaison entre les tests reste exploratoire puisque les participants choisissent eux-mêmes leur test.

## Pilote

Essayer les deux tests dans les deux modalités avec le paramètre `?pilot=1`. Vérifier que les glyphes sont distincts et demander aux personnes du pilote si certains leur rappellent un symbole connu. Vérifier aussi la compréhension des consignes, les boutons sur téléphone, le téléchargement du fichier et l'exactitude des réponses pour les séries de six éléments. Mesurer la durée et tester la remise des fichiers à distance. Figer ensuite les stimuli, les temps, le nombre d'essais et les critères de validité avant la collecte principale.

Pour les essais à distance avec enregistrement automatique, envoyer le lien d’invitation de collecte par message privé. À la fin, l’écran confirme la réception et propose de télécharger une copie du CSV. Les liens publics du [README](README.md) permettent aussi une passation avec export manuel.
