# Plan d'analyse

## Mesures et comparaisons

1. Pour chaque participant, type de symbole et taille de série, calculer le taux de décisions correctes et le temps de décision médian sur les essais corrects et valides. Présenter les résultats des six longueurs.
2. Pour les chiffres, conserver la comparaison principale **6 − 2**. Calculer la différence de médianes par participant, puis sa moyenne et son intervalle de confiance à 95 %.
3. Calculer le même contraste pour les symboles abstraits et comparer les deux groupes de façon descriptive si chacun choisit son test. Le choix du test, la similarité visuelle et la facilité à nommer les éléments peuvent influer sur la comparaison.
4. Pour la comparaison présentiel-distance, comparer le contraste **6 − 2** des chiffres entre les groupes et montrer les observations individuelles. Les résultats portent sur les conditions observées, qui peuvent différer par le matériel, l'environnement et le recrutement.

L'unité d'analyse est le participant. Écarter la démonstration et les futurs essais d'entraînement des analyses principales. Définir après le pilote, avant la collecte, les critères d'exclusion pour les sessions incomplètes, les réponses trop précoces et les pertes de focus. Compter les omissions et rapporter les exclusions par modalité.

## CSV des sessions

Une ligne correspond à un essai. Les valeurs de `mode` sont `presentiel` et `distance`. Chaque CSV contient un seul type de stimulus.

| Colonne | Valeur |
| --- | --- |
| `session_id`, `session_type`, `protocol_version`, `mode` | Identifiant aléatoire, session `demo`, version et modalité |
| `stimulus_type` | `digits` ou `symbols` |
| `trial`, `set_size`, `sequence`, `probe` | Numéro d'essai, longueur, suite présentée et symbole de test |
| `target_present`, `response`, `correct` | Présence de la cible, réponse « oui » ou « non » et exactitude |
| `rt_ms`, `focus_lost` | Temps de décision et perte de focus avant ou au moment de la décision |
| `response_input` | Type d'entrée rapporté lors de l'activation du bouton |
| `viewport_width`, `viewport_height`, `browser` | Taille de la fenêtre et description du navigateur |

Une décision absente est codée `timeout`, avec un temps de réponse vide. Les identifiants `s01` à `s10` renvoient aux tracés de [trials.js](../docs/trials.js). Les CSV des prototypes précédents peuvent avoir d'autres colonnes. Les résultats publiés seront agrégés. Garder les fichiers individuels dans `data/`.
