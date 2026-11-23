# Plan d'analyse

## Mesures et comparaisons

1. Pour chaque participant et chaque taille de liste, calculer le taux de bonnes réponses et le temps de réponse médian sur les essais corrects et valides.
2. Pour chaque participant, soustraire sa médiane à **2 chiffres** de sa médiane à **6 chiffres**. Résumer la différence moyenne et son intervalle de confiance à 95 %. Tracer les médianes individuelles pour 2, 4 et 6 chiffres et présenter les taux de réussite correspondants.
3. Pour comparer les modalités, estimer l'écart entre le contraste moyen **6 − 2** à distance et le même contraste en présentiel. Montrer aussi les observations individuelles. Les résultats portent sur les conditions observées, qui peuvent différer par le matériel, l'environnement et le recrutement.

L'unité d'analyse est le participant. Définir après le pilote, avant la collecte, les critères d'exclusion pour les sessions incomplètes, les réponses trop précoces et les pertes de focus. Compter les omissions et rapporter les exclusions par modalité.

## CSV de la démonstration

Une ligne correspond à un essai. Les valeurs de `mode` sont `presentiel` et `distance`. Le champ `session_type` distingue les fichiers de démonstration des futures sessions d'étude.

| Colonne | Valeur |
| --- | --- |
| `session_id`, `session_type`, `mode` | Identifiant aléatoire, type de session et modalité |
| `trial`, `set_size`, `digits`, `probe` | Numéro d'essai, taille, chiffres de la liste, chiffre de test |
| `target_present`, `response`, `correct` | Présence de la cible, réponse « oui » ou « non » et exactitude |
| `rt_ms`, `focus_lost` | Temps de réponse et indication d'une perte de focus pendant l'essai |
| `browser` | Chaîne de description fournie par le navigateur |

Une réponse absente est codée `timeout`, avec un temps de réponse vide. Les résultats publiés seront agrégés. Garder les fichiers individuels dans `data/`.
