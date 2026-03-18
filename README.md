# METABLETON

METABLETON est un site éditorial francophone autour d'Ableton Live, de la production musicale, de Max for Live et des freebies.

Le projet est construit avec une base volontairement simple :

- React
- JavaScript
- Vite
- CSS global sans framework UI
- routing manuel sans dependance supplementaire

L'intention visuelle est sobre, editoriale, minimaliste et inspiree par la logique de lecture de [patches.zone](https://www.patches.zone/), sans chercher a la copier.

## Apercu

Le site contient actuellement :

- une homepage avec hero carousel editorial
- une sidebar de navigation
- une route locale `/editor` pour rediger des articles
- 4 pages de section :
  - `Blog / News`
  - `Guides Ableton Live`
  - `Max for Live`
  - `Freebies`
- des pages article
- 3 pages secondaires :
  - `Cours / accompagnement`
  - `Portfolio`
  - `Contact / Reseaux sociaux`

## Stack

- `react`
- `react-dom`
- `vite`
- `@vitejs/plugin-react`

Pas de TypeScript.
Pas de framework CSS.
Pas de dependances de routing.

## Installation

```bash
npm install
```

## Lancer le projet

```bash
npm run dev
```

Par defaut, Vite demarre le site en local.

## Build de production

```bash
npm run build
```

## Preview locale du build

```bash
npm run preview
```

## Structure du projet

```text
METABLETON FINAL/
├── public/
│   ├── articles/
│   │   ├── blog-news/
│   │   ├── freebies/
│   │   ├── guides-ableton/
│   │   └── max-for-live/
│   └── logos/
├── src/
│   ├── components/
│   │   ├── AppLink.jsx
│   │   ├── ArticleEditorPage.jsx
│   │   ├── ArticlePage.jsx
│   │   ├── HeroFeature.jsx
│   │   ├── SecondaryPage.jsx
│   │   ├── SectionPage.jsx
│   │   └── Sidebar.jsx
│   ├── data/
│   │   └── content.js
│   ├── styles/
│   │   └── global.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## Architecture

### `src/App.jsx`

Point d'entree principal du site.

Il gere :

- le routing manuel via `window.history.pushState`
- la homepage
- les pages de section
- les pages article
- les pages secondaires

Le projet n'utilise pas `react-router`.

### `src/data/content.js`

Fichier central du contenu editorial.

Il contient :

- les sections principales
- les articles
- les groupes de navigation
- les pages de section derivees
- les articles routes
- l'article vedette de la homepage
- la liste des slides du hero carousel
- les pages secondaires

C'est le fichier principal a modifier pour faire vivre le site.

### `src/components/HeroFeature.jsx`

Composant du hero carousel de la homepage.

Fonctionnalites actuelles :

- plusieurs slides bases sur de vrais articles
- clic vers la page article
- navigation precedente / suivante
- indicateurs
- autoplay toutes les 10 secondes

### `src/components/SectionPage.jsx`

Affiche les pages de section sous forme de liste editoriale verticale.

### `src/components/ArticlePage.jsx`

Template d'article avec rendu par blocs.

Types de blocs actuellement supportes :

- `heading`
- `paragraph`
- `list`
- `image`
- `gif`
- `quote`
- `callout`

### `src/components/ArticleEditorPage.jsx`

Editeur local pour creer ou preparer un article directement dans l'application.

Fonctionnalites principales :

- route locale `/editor`
- edition des metadonnees
- edition bloc par bloc du `content`
- apercu live via `ArticlePage`
- autosave dans `localStorage`
- export JSON
- export JS pret a coller dans `src/data/content.js`

### `src/components/SecondaryPage.jsx`

Template simple pour :

- `Cours / accompagnement`
- `Portfolio`
- `Contact / Reseaux sociaux`

## Contenus et zones a modifier

### Utiliser l'editeur local `/editor`

Route :

- `/editor`

L'editeur sert a :

- rediger un article au bon format
- preparer ses blocs `content`
- verifier le rendu avant collage
- exporter un objet compatible avec `src/data/content.js`

Le brouillon est sauve automatiquement dans le navigateur via :

- `metableton-article-editor-draft`

Guide detaille :

- [`EDITOR_GUIDE.md`](./EDITOR_GUIDE.md)

### Modifier les articles

Fichier :

- [`src/data/content.js`](./src/data/content.js)

Chaque article peut contenir par exemple :

- `id`
- `slug`
- `section`
- `type`
- `label`
- `title`
- `summary`
- `heroImage`
- `thumbnail`
- `imageAlt`
- `content`

### Modifier l'article vedette de la homepage

Toujours dans :

- [`src/data/content.js`](./src/data/content.js)

L'article vedette est determine par :

- `featured: true` sur un article

Le premier article avec `featured: true` devient le hero editorial principal.

### Modifier les slides du hero carousel

Toujours dans :

- [`src/data/content.js`](./src/data/content.js)

Regarder :

- `heroCarouselSlugs`

L'ordre de ce tableau definit l'ordre des slides.

### Modifier les pages secondaires

Toujours dans :

- [`src/data/content.js`](./src/data/content.js)

Regarder :

- `secondaryPageEntries`

Tu peux y modifier :

- les titres
- les intros
- les blocs de contenu
- les liens de contact

### Modifier la navigation de sidebar

Toujours dans :

- [`src/data/content.js`](./src/data/content.js)

Regarder :

- `navigationGroups.primary`
- `navigationGroups.secondary`

## Images et assets

### Logos

Dossier :

- [`public/logos`](./public/logos)

Assets disponibles :

- `metableton-logo-circle.svg`
- `metableton-logo-full.svg`
- `metableton-symbol.svg`

### Images d'articles

Dossier :

- [`public/articles`](./public/articles)

Organisation actuelle :

- `public/articles/blog-news/`
- `public/articles/guides-ableton/`
- `public/articles/max-for-live/`
- `public/articles/freebies/`

Les chemins d'images sont references dans :

- [`src/data/content.js`](./src/data/content.js)

## Direction visuelle

Le projet suit une logique :

- fond clair
- palette noire / blanc casse / gris doux
- beaucoup d'air
- hierarchie editoriale forte
- pas de style startup
- pas de framework UI
- pas d'effets gadgets

Le gros du style vit dans :

- [`src/styles/global.css`](./src/styles/global.css)

## Ajouter une nouvelle page de section

1. Ajouter une section dans `sections` dans [`src/data/content.js`](./src/data/content.js)
2. Ajouter les articles relies a cette section
3. La page de section sera derivee automatiquement

## Ajouter un nouvel article

1. Ajouter un objet article dans `articles` dans [`src/data/content.js`](./src/data/content.js)
2. Lui donner :
   - une `section`
   - un `slug`
   - un `title`
   - un `summary`
   - une image
   - un `content`
3. La route article sera creee automatiquement
4. La page de section l'affichera automatiquement

### Workflow recommande avec `/editor`

1. Ouvrir `/editor`
2. Remplir :
   - `title`
   - `section`
   - `summary`
   - `heroImage`
   - `thumbnail`
   - `imageAlt`
3. Ajouter les blocs de contenu necessaires
4. Verifier l'apercu live a droite
5. Copier le snippet JS ou telecharger le `.js`
6. Coller l'objet dans le tableau `articles` de [`src/data/content.js`](./src/data/content.js)
7. Si besoin, ajouter `featured: true` pour en faire l'article vedette

### Champs geres par `/editor`

L'editeur prend en charge :

- `id`
- `slug`
- `section`
- `type`
- `label`
- `featured`
- `title`
- `summary`
- `heroImage`
- `thumbnail`
- `imageAlt`
- `tags`
- `content`

Types de blocs supportes dans l'editeur :

- `heading`
- `paragraph`
- `list`
- `quote`
- `callout`
- `image`
- `gif`

Notes utiles :

- `slug` se genere automatiquement depuis le titre tant qu'il n'a pas ete modifie a la main
- `id` suit la meme logique au depart
- `tags` se saisissent separes par des virgules
- `list` est converti en `items: []`
- `image` et `gif` utilisent `src`, `alt`, `caption`
- `callout` accepte `label` et `content`

## Ajouter un GIF dans un article

Dans le `content` d'un article, utiliser un bloc comme :

```js
{
  type: "gif",
  src: "/articles/guides-ableton/mon-gif.gif",
  alt: "Description du GIF",
  caption: "Caption optionnel"
}
```

Puis placer le fichier dans `public/articles/...`.

## Notes de maintenance

- le projet contient un dossier `dist/` genere apres build
- le projet contient aussi `node_modules/` localement
- le routing est intentionnellement simple et sans dependance externe
- la plupart des evolutions passent par `content.js` et `global.css`
- la route `/editor` est un outil local de travail, sans backend ni CMS

## Scripts disponibles

```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

## Etat actuel

Le projet compile avec succes via :

```bash
npm run build
```

## Suite logique possible

Pistes naturelles pour les prochaines iterations :

- enrichir le contenu editorial reel des articles
- remplacer les placeholders visuels par des assets definitifs
- ajouter des liens reels pour la page contact
- affiner encore le hero carousel
- preparer un deploiement Vercel, Netlify ou GitHub Pages
