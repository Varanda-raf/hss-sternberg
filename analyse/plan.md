# Plan d'analyse

## Mesures et comparaisons

1. Pour chaque participant, type de symbole et taille de série, calculer le taux de décisions correctes et le temps de décision médian sur les essais corrects et valides. Présenter les résultats des six longueurs.
2. Pour les chiffres, conserver la comparaison principale **6 − 2**. Calculer la différence de médianes par participant, puis sa moyenne et son intervalle de confiance à 95 %.
3. Calculer le même contraste pour les lettres et comparer les deux contrastes au sein de chaque participant. Examiner aussi le taux de séries intégralement rappelées dans l'ordre et la proportion d'éléments rappelés à la bonne position pour chaque longueur et chaque type.
4. Pour la comparaison présentiel-distance, comparer le contraste **6 − 2** des chiffres entre les groupes et montrer les observations individuelles. Les résultats portent sur les conditions observées, qui peuvent différer par le matériel, l'environnement et le recrutement.

L'unité d'analyse est le participant. Écarter la démonstration et les essais d'entraînement des analyses principales. Définir après le pilote, avant la collecte, les critères d'exclusion pour les sessions incomplètes, les réponses trop précoces, les pertes de focus et les rappels incomplets. Compter les omissions et rapporter les exclusions par modalité.

## CSV des sessions

Une ligne correspond à un essai. Les valeurs de `mode` sont `presentiel` et `distance`. Le champ `session_type` distingue `demo` et `pilot`.

| Colonne | Valeur |
| --- | --- |
| `session_id`, `session_type`, `mode` | Identifiant aléatoire, type de session et modalité |
| `condition_order`, `block`, `phase`, `stimulus_type` | Ordre des conditions, numéro du bloc, entraînement ou test, chiffres ou lettres |
| `trial`, `set_size`, `sequence`, `probe` | Numéro d'essai, longueur, suite présentée et symbole de test |
| `target_present`, `response`, `correct` | Présence de la cible, réponse « oui » ou « non » et exactitude |
| `rt_ms`, `focus_lost` | Temps de décision et perte de focus avant ou au moment de la décision |
| `recall_sequence`, `recall_correct`, `recall_positions_correct`, `recall_focus_lost` | Suite saisie, exactitude du rappel complet, nombre de positions justes et perte de focus pendant le rappel |
| `browser` | Chaîne de description fournie par le navigateur |

Une décision absente est codée `timeout`, avec un temps de réponse vide. Un rappel vide comporte zéro position correcte. Dans la première version de démonstration, la colonne `digits` contenait la suite présentée. Les résultats publiés seront agrégés. Garder les fichiers individuels dans `data/`.
