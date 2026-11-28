# Protocole de l'expérience

## Question et hypothèses

Le temps de décision augmente-t-il avec le nombre d'éléments à mémoriser ? Nous prévoyons un temps de réponse plus long pour les séries de six chiffres que pour celles de deux chiffres. Nous examinerons aussi si cette augmentation diffère entre les tests de chiffres et de symboles abstraits, ainsi qu'entre les passations en présentiel et à distance.

## Déroulement d'un essai

Dans l'expérience 1 de Sternberg, chaque série comprenait **de 1 à 6 chiffres distincts** tirés parmi **0 à 9**. Les chiffres étaient présentés un à un, à raison de **1 200 ms par chiffre**. La liste était suivie d'une attente de **2 000 ms**, puis d'un signal d'avertissement et du chiffre de test. Après la décision et le retour sur l'exactitude de celle-ci, le participant tentait de rappeler la série dans l'ordre. L'étude comportait 24 essais d'entraînement et 144 essais de test par personne. [Sternberg, 1966, expérience 1, p. 652](https://doi.org/10.1126/science.153.3736.652)

| Étape | Paramètre de la version 5 |
| --- | --- |
| Croix de fixation | 500 ms |
| Série de 1 à 6 symboles distincts | 1 200 ms par symbole |
| Écran vide après le dernier symbole | 2 000 ms |
| Signal d'avertissement visuel | 250 ms |
| Symbole de test | Jusqu'à la réponse, avec une limite de 4 000 ms |
| Réponse | Boutons « Oui » et « Non » à l'écran |

Le temps de décision part de l'affichage du symbole de test et s'arrête à l'activation d'un bouton. Le mode de réponse est enregistré. L’entraînement comprend 2 essais, avec une cible présente pour une série de 2 et une cible absente pour une série de 4, dans un ordre aléatoire. Le retour est affiché pendant 1 200 ms après chaque essai d’entraînement. Une transition de 3 000 ms précède le test. Les essais du test s’enchaînent sans pause programmée et sans retour sur l’exactitude.

## Plan de collecte

- **Deux tests séparés.** Chaque personne choisit les chiffres de 0 à 9 ou dix glyphes abstraits inventés. Les deux tests ont les mêmes longueurs et durées.
- **Nombre d'essais.** Le test comporte 36 essais, répartis en trois blocs de 12. Chaque longueur apparaît six fois, dont trois avec une cible présente et trois avec une cible absente. Les positions des cibles présentes sont réparties sur l’ensemble du test. L’ordre des essais est mélangé dans chaque bloc.
- **Durée.** Si tous les délais de réponse sont utilisés, les durées programmées totalisent 7 minutes et 0,3 seconde, auxquelles s’ajoute le temps de rendu du navigateur. Au bout de 10 minutes après le démarrage, le test s’arrête et conserve les essais déjà terminés pour l’export.
- **Modalité.** Le site public enregistre une session à distance et la version lancée sur la machine de l'expérimentateur via localhost enregistre une session en présentiel. L'appareil et la modalité peuvent varier ensemble.
- **Mêmes conditions logicielles.** Les mêmes boutons et instructions sont disponibles sur téléphone et ordinateur. Le CSV consigne le mode de réponse, le navigateur, la taille de la fenêtre et les pertes de focus. Pour comparer les modalités, privilégier les contrastes de temps mesurés avec un type d'appareil et de réponse comparable.
- **Effectif.** Le minimum du cours est de dix participants au total. Pour comparer les modalités, viser dix sessions valides par modalité si le recrutement le permet et suivre la répartition entre les deux tests. Une comparaison entre les tests reste exploratoire puisque les participants choisissent eux-mêmes leur test.

## Pilote

Essayer les deux tests dans les deux modalités avec le paramètre `?pilot=1`. Vérifier que les glyphes sont distincts et demander aux personnes du pilote si certains leur rappellent un symbole connu. Vérifier aussi la compréhension des consignes, les boutons sur téléphone, le téléchargement du fichier et l'exactitude des réponses pour les séries de six éléments. Mesurer la durée et tester la remise des fichiers à distance. Figer ensuite les stimuli, les temps, le nombre d'essais et les critères de validité avant la collecte principale.

Pour les essais à distance, envoyer le lien pilote ou le lien de passation depuis le [README](README.md) par message privé. À la fin, la personne peut télécharger son CSV et le renvoyer dans la même conversation privée.
