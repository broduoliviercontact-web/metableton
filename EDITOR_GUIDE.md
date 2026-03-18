# Guide `/editor`

Ce document explique comment utiliser la route locale `/editor` pour rediger un article METABLETON sans backend et sans CMS externe.

## A quoi sert `/editor`

La route `/editor` est un mini editeur maison integre directement dans l'application.

Elle permet de :

- remplir les metadonnees d'un article
- construire le tableau `content` bloc par bloc
- voir un apercu live du rendu via `ArticlePage`
- sauvegarder automatiquement un brouillon local
- exporter un objet compatible avec `src/data/content.js`

L'objectif est simple :

- preparer un article propre
- verifier son rendu
- copier l'objet final dans la base editoriale du projet

## Ou y acceder

En local, lance le projet puis ouvre :

```text
/editor
```

Exemple :

```text
http://localhost:5173/editor
```

## Ce que l'editeur sauvegarde

Le brouillon est sauvegarde automatiquement dans le navigateur avec la cle :

```text
metableton-article-editor-draft
```

Cela signifie :

- pas de backend
- pas de compte
- pas de synchro distante
- le brouillon reste local a ton navigateur

## Structure de la page

L'interface est divisee en 2 colonnes :

- gauche : edition
- droite : apercu live

### Colonne gauche

Tu y trouves :

- les metadonnees
- l'editeur de blocs
- la validation
- l'aide
- les actions d'export

### Colonne droite

Tu y trouves :

- un apercu live base sur le composant existant `ArticlePage.jsx`

L'idee est d'ecrire dans le meme format que celui du site, sans interpretation intermediaire.

## Metadonnees editees

L'editeur gere ces champs :

- `id`
- `slug`
- `section`
- `type`
- `label`
- `featured`
- `title`
- `summary`
- `heroImage`
- `heroImagePosition`
- `thumbnail`
- `thumbnailPosition`
- `imageAlt`
- `tags`
- `content`

## Regles de saisie

### `title`

Le titre est obligatoire.

### `slug`

Le slug se genere automatiquement depuis le titre tant que tu ne le modifies pas manuellement.

Exemple :

```text
Bien demarrer sur Ableton Live
```

devient :

```text
bien-demarrer-sur-ableton-live
```

### `id`

L'id suit la meme logique au debut, mais reste editable.

### `section`

La section est choisie via une liste basee sur les sections deja presentes dans `src/data/content.js`.

### `tags`

Les tags se saisissent dans un champ texte, separes par des virgules.

Exemple :

```text
ableton, workflow, live
```

L'editeur les convertit ensuite en :

```js
["ableton", "workflow", "live"]
```

Maximum :

- 3 tags

### `featured`

Case a cocher pour marquer un article comme vedette.

## Blocs de contenu supportes

L'editeur supporte les memes types que `ArticlePage.jsx` :

- `heading`
- `paragraph`
- `list`
- `quote`
- `callout`
- `image`
- `gif`
- `youtube`

## Comment remplir chaque type de bloc

### `heading`

Champ :

- `content`

### `paragraph`

Champ :

- `content`

Les liens hypertexte inline sont supportes avec la syntaxe :

```text
[texte du lien](https://exemple.com)
```

Exemple :

```text
Consulte [Ableton](https://www.ableton.com/) pour plus d'informations.
```

### `list`

Champ :

- un item par ligne

Le resultat est converti en :

```js
{
  type: "list",
  items: ["item 1", "item 2"]
}
```

### `quote`

Champ :

- `content`

### `callout`

Champs :

- `label`
- `content`

### `image`

Champs :

- `src`
- `alt`
- `caption`
- `position`

### `gif`

Champs :

- `src`
- `alt`
- `caption`
- `position`

### `youtube`

Champs :

- `url`
- `caption`

Formats supportes :

- `https://www.youtube.com/watch?v=...`
- `https://youtu.be/...`
- `https://www.youtube.com/shorts/...`
- `https://www.youtube.com/embed/...`

## Gestion des blocs

Chaque bloc peut etre :

- ajoute
- modifie
- supprime
- deplace vers le haut
- deplace vers le bas

Il n'y a pas de drag and drop volontairement.
Le systeme reste simple et robuste.

## Images locales

Dans ce projet, les images sont referencees avec des chemins publics.

Exemple :

```text
/articles/guides-ableton/mon-image.jpg
```

Conseils :

- `heroImage` et `thumbnail` sont souvent identiques
- `imageAlt` doit decrire clairement le visuel
- les blocs `image` et `gif` utilisent aussi des chemins publics

Organisation actuelle des visuels :

- `public/articles/blog-news/`
- `public/articles/guides-ableton/`
- `public/articles/max-for-live/`
- `public/articles/freebies/`

## Recadrage des images

L'editeur propose un recadrage simple par point focal.

Tu peux regler :

- le recadrage du hero
- le recadrage de la thumbnail
- le recadrage des blocs `image`
- le recadrage des blocs `gif`

Le systeme ne decoupe pas physiquement le fichier.
Il regle seulement la zone visible avec `object-position`.

### Format stocke

Le format exporte est :

```text
50% 50%
```

Exemples :

```js
heroImagePosition: "50% 30%",
thumbnailPosition: "40% 50%",
```

Pour un bloc image :

```js
{
  type: "image",
  src: "/articles/guides-ableton/mon-image.jpg",
  alt: "Description image",
  caption: "Legende optionnelle",
  position: "50% 20%"
}
```

### Comment l'utiliser

Dans `/editor`, le recadrage se fait avec deux sliders :

- horizontal
- vertical

Le resultat est visible dans l'apercu live.

## Validation

L'editeur affiche :

- des erreurs
- des avertissements

### Erreurs

Bloquants editoriaux :

- `title` vide
- `slug` vide
- `section` vide
- aucun bloc dans `content`

### Avertissements

Recommandations :

- `heroImage` manquant
- `thumbnail` manquant
- `imageAlt` manquant

L'interface ne bloque pas brutalement la saisie.

## Exports disponibles

L'editeur propose :

- copie du snippet JS
- telechargement `.json`
- telechargement `.js`

### Export `.json`

Utile pour :

- archiver un brouillon
- partager une base de contenu
- relire la structure

### Export `.js`

Utile pour :

- coller directement l'objet dans le tableau `articles` de `src/data/content.js`

## Exemple de workflow recommande

1. Ouvre `/editor`
2. Renseigne `title`
3. Choisis la `section`
4. Complete `summary`
5. Ajoute `heroImage`, `thumbnail`, `imageAlt`
6. Regle le point focal si l'image doit etre recadree
7. Saisis les `tags`
8. Ajoute les blocs de contenu
9. Si besoin, ajoute des liens inline ou un bloc `youtube`
10. Verifie l'apercu live
11. Clique sur `Copier le snippet JS`
12. Colle l'objet dans `src/data/content.js`

## Exemple d'objet produit

```js
{
  id: "guide-nouveau",
  slug: "guide-nouveau",
  section: "guides-ableton-live",
  type: "Guide",
  label: "Guide",
  title: "Guide nouveau",
  summary: "Resume...",
  heroImage: "/articles/guides-ableton/hero.jpg",
  heroImagePosition: "50% 50%",
  thumbnail: "/articles/guides-ableton/hero.jpg",
  thumbnailPosition: "50% 50%",
  imageAlt: "Description image",
  tags: ["ableton", "workflow"],
  content: [
    {
      type: "paragraph",
      content: "Texte avec un [lien](https://exemple.com)..."
    }
  ]
}
```

## Points importants a retenir

- `/editor` est un outil local de redaction
- il ne remplace pas `src/data/content.js`
- il prepare des objets compatibles avec le format actuel
- le rendu de preview repose sur `ArticlePage.jsx`
- le routeur du projet reste le routeur maison de `App.jsx`
- les liens inline, les blocs YouTube et le point focal restent compatibles avec le format actuel des articles

## Fichiers lies a `/editor`

- `src/App.jsx`
- `src/components/ArticleEditorPage.jsx`
- `src/components/ArticlePage.jsx`
- `src/data/content.js`
