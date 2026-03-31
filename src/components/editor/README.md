# Refactoring — ArticleEditorPage

## Contexte

`ArticleEditorPage.jsx` était un fichier monolithique de **1646 lignes** mélangeant constantes,
logique métier, composants UI réutilisables et état React dans un seul endroit.

Ce refactoring le découpe en **4 fichiers à responsabilité unique** sans changer aucun comportement.

---

## Structure après refactoring

```
src/components/
├── ArticleEditorPage.jsx       ~280 lignes  (état + rendu principal)
└── editor/
    ├── editorUtils.js          ~230 lignes  (constantes + fonctions pures)
    ├── EditorFields.jsx        ~155 lignes  (composants de formulaire)
    └── BlockEditor.jsx         ~175 lignes  (éditeur de bloc de contenu)
```

---

## Description des fichiers

### `editorUtils.js`
Toutes les **constantes** et **fonctions pures** — aucun JSX, aucun état React.

Exports :
- **Constantes** — `STORAGE_KEY`, `PLACEHOLDER_IMAGE`, `DEFAULT_IMAGE_POSITION`, `DEFAULT_BLOCK_ALIGN`, `DEFAULT_IMAGE_ZOOM`, `DEFAULT_MEDIA_WIDTH`, `BLOCK_TYPES`
- **Utilitaires image** — `clampPercentage`, `formatImagePosition`, `parseImagePosition`, `clampZoom`
- **Utilitaires texte** — `slugify`, `parseTags`, `parseExtraSections`
- **Factories de blocs** — `createBlock`, `extractTextFromBlock`, `convertBlockType`
- **Factories d'articles** — `createTemplateArticle`, `createEmptyArticle`, `normalizeEditorArticle`, `loadInitialEditorState`
- **Logique métier** — `sanitizeContent`, `buildArticleObject`, `getValidation`
- **Utilitaire fichier** — `downloadTextFile`

---

### `EditorFields.jsx`
Composants de formulaire **réutilisables et sans état**.

Exports :
| Composant | Description |
|---|---|
| `Field` | Wrapper label + aide pour chaque champ |
| `TextInput` | Input texte stylisé |
| `TextareaInput` | Textarea stylisée |
| `ImagePositionFields` | Double slider horizontal/vertical pour le recadrage |
| `ImageZoomField` | Slider de zoom (1× → 2×) |
| `AlignmentFields` | Boutons gauche / centre / droite |
| `DisplayModeFields` | Groupe de boutons générique (largeur, format, etc.) |

---

### `BlockEditor.jsx`
Composant qui gère l'édition d'un **bloc de contenu individuel** (heading, paragraph, image, youtube, etc.).

Props :
| Prop | Type | Description |
|---|---|---|
| `block` | object | Données du bloc |
| `index` | number | Position dans la liste |
| `onChange` | function | Mise à jour du bloc |
| `onMoveUp` | function | Déplacer vers le haut |
| `onMoveDown` | function | Déplacer vers le bas |
| `onRemove` | function | Supprimer le bloc |
| `onDuplicate` | function | Dupliquer le bloc |
| `onTypeChange` | function | Changer le type du bloc |

Gère tous les types : `heading`, `paragraph`, `list`, `quote`, `callout`, `image`, `gif`, `youtube`, `link`, `source`.

---

### `ArticleEditorPage.jsx`
Composant principal. Contient uniquement :
- L'**état React** (`draftArticle`, `tagsInput`, `slugTouched`, `idTouched`, `feedback`)
- La **persistance** localStorage
- Les **handlers** (`updateField`, `handleTitleChange`, `addBlock`, `moveBlock`, etc.)
- Le **rendu** des panneaux (Métadonnées, Contenu, Validation, Aide, Aperçu live)

---

## Ce qui n'a pas changé

- Aucun comportement modifié
- Aucun style modifié
- Aucune dépendance ajoutée
- Le build Vite passe sans erreur ni warning
