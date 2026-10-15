# Orthopédie Avicenne

Site indépendant de présentation du service de chirurgie orthopédique et traumatologique de l’Hôpital Avicenne, à Bobigny.

## Prévisualisation locale

Le site est servi par un serveur Node.js, sans dépendance d’exécution :

```bash
npm start
```

Puis ouvrez `http://localhost:4173`. Le port peut être remplacé avec la variable `PORT`.

## Déploiement Render

Le Blueprint `render.yaml` décrit un service web Node.js avec contrôle de santé sur `/healthz`. Le déploiement automatique est désactivé : le service ne sera pas publié sans action explicite dans Render.

## Structure

- `index.html` — contenu et structure de la page
- `styles.css` — direction artistique et responsive
- `script.js` — navigation mobile et sélection interactive du parcours
- `server.js` — serveur Node.js et endpoint de santé
- `assets/` — photographies et ressources visuelles

## Sources éditoriales

Les informations médicales et pratiques sont issues des pages officielles du service et de l’hôpital, liées depuis le site. Le site est indépendant et ne constitue pas une page institutionnelle officielle. Le visuel anatomique est une illustration, pas une imagerie clinique.
