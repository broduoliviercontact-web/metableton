import { useState } from "react";
import {
  BLOCK_TYPE_LABELS,
  BLOCK_TYPES,
  DEFAULT_BLOCK_ALIGN,
  DEFAULT_IMAGE_POSITION,
  DEFAULT_MEDIA_WIDTH,
  DEFAULT_PRESENTATION_OPTION,
  extractTextFromBlock,
  getDefaultAspectRatio,
  parseYouTubeId,
} from "./editorUtils";
import {
  AlignmentFields,
  DisplayModeFields,
  Field,
  ImagePositionFields,
  ImageZoomField,
  TextInput,
  TextareaInput,
} from "./EditorFields";

const BLOCK_TYPE_COLORS = {
  heading:   "#6366f1",
  paragraph: "#737373",
  list:      "#0ea5e9",
  quote:     "#8b5cf6",
  callout:   "#f59e0b",
  divider:   "#a16207",
  columns:   "#0f766e",
  image:     "#10b981",
  gif:       "#14b8a6",
  youtube:   "#ef4444",
  link:      "#3b82f6",
  source:    "#f97316",
};

function getBlockPreview(block) {
  const text = extractTextFromBlock(block);
  if (text) return text.slice(0, 72).replace(/\n/g, " ").trim();
  if ((block.type === "image" || block.type === "gif") && block.src) {
    return block.src.split("/").pop() || null;
  }
  if (block.type === "youtube" && block.url) return block.url;
  return null;
}

const WIDTH_OPTIONS = [
  { value: "content", label: "Contenu" },
  { value: "wide", label: "Large" },
  { value: "full", label: "Pleine largeur" },
];

const RATIO_OPTIONS = [
  { value: "16/10", label: "16:10" },
  { value: "16/9", label: "16:9" },
  { value: "4/3", label: "4:3" },
  { value: "1/1", label: "Carré" },
  { value: "3/4", label: "Portrait" },
];

const RATIO_OPTIONS_YOUTUBE = [
  { value: "16/9", label: "16:9" },
  { value: "16/10", label: "16:10" },
  { value: "4/3", label: "4:3" },
  { value: "1/1", label: "Carré" },
  { value: "3/4", label: "Portrait" },
];

const TEXT_LAYOUT_TYPES = new Set(["heading", "paragraph", "list", "quote", "callout"]);
const TEXT_STYLE_TYPES = new Set(["heading", "paragraph", "list", "quote", "callout", "columns"]);

const TEXT_SIZE_OPTIONS = [
  { value: DEFAULT_PRESENTATION_OPTION, label: "Par défaut" },
  { value: "sm", label: "Petit" },
  { value: "md", label: "Moyen" },
  { value: "lg", label: "Grand" },
];

const HEADING_SIZE_OPTIONS = [
  { value: DEFAULT_PRESENTATION_OPTION, label: "Par défaut" },
  { value: "sm", label: "Petit" },
  { value: "md", label: "Moyen" },
  { value: "lg", label: "Grand" },
  { value: "xl", label: "Très grand" },
];

const TEXT_WIDTH_OPTIONS = [
  { value: DEFAULT_PRESENTATION_OPTION, label: "Par défaut" },
  { value: "content", label: "Contenu" },
  { value: "wide", label: "Large" },
  { value: "full", label: "Pleine largeur" },
];

const SPACING_OPTIONS = [
  { value: DEFAULT_PRESENTATION_OPTION, label: "Par défaut" },
  { value: "compact", label: "Serré" },
  { value: "relaxed", label: "Aéré" },
  { value: "section", label: "Section" },
];

const TONE_OPTIONS = [
  { value: DEFAULT_PRESENTATION_OPTION, label: "Par défaut" },
  { value: "muted", label: "Doux" },
  { value: "strong", label: "Fort" },
  { value: "accent", label: "Accent" },
];

const CALLOUT_BACKGROUND_OPTIONS = [
  { value: DEFAULT_PRESENTATION_OPTION, label: "Par défaut" },
  { value: "subtle", label: "Subtil" },
  { value: "warm", label: "Chaleureux" },
  { value: "accent", label: "Accent" },
  { value: "contrast", label: "Contraste" },
];

const DIVIDER_STYLE_OPTIONS = [
  { value: "line", label: "Ligne" },
  { value: "fade", label: "Fondu" },
  { value: "accent", label: "Accent" },
];

const COLUMN_RATIO_OPTIONS = [
  { value: "equal", label: "50 / 50" },
  { value: "left", label: "60 / 40" },
  { value: "right", label: "40 / 60" },
];

const COLUMN_CONTENT_TYPE_OPTIONS = [
  { value: "text", label: "Texte" },
  { value: "image", label: "Image" },
];

const actionButtonClass =
  "inline-flex h-9 items-center rounded-card border border-[color:var(--border-soft)] px-3 text-ui text-[var(--text-secondary)] transition-colors hover:border-[color:var(--border-strong)] hover:text-[var(--text-primary)]";

function YoutubeBlockFields({ block, update }) {
  const youtubeId = parseYouTubeId(block.url);
  const hasUrl = (block.url || "").trim().length > 0;

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <label className="grid gap-2">
          <span className="text-label font-medium uppercase tracking-caps-wide text-[var(--text-muted)]">URL YouTube</span>
          <TextInput
            value={block.url || ""}
            onChange={(event) => update({ url: event.target.value })}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </label>
        {hasUrl ? (
          youtubeId ? (
            <span className="text-ui text-emerald-600">ID détecté : {youtubeId}</span>
          ) : (
            <span className="text-ui text-red-500">URL non reconnue. Formats acceptés : watch?v=, youtu.be, shorts/, embed/</span>
          )
        ) : (
          <span className="text-ui leading-5 text-[var(--text-muted)]">Colle un lien YouTube classique, youtu.be, shorts ou embed.</span>
        )}
      </div>
      <Field label="Caption">
        <TextareaInput value={block.caption || ""} onChange={(event) => update({ caption: event.target.value })} />
      </Field>
      <DisplayModeFields
        label="Largeur"
        value={block.width || DEFAULT_MEDIA_WIDTH}
        onChange={(nextWidth) => update({ width: nextWidth })}
        options={WIDTH_OPTIONS}
      />
      <DisplayModeFields
        label="Format"
        value={block.aspectRatio || getDefaultAspectRatio(block.type)}
        onChange={(nextRatio) => update({ aspectRatio: nextRatio })}
        options={RATIO_OPTIONS_YOUTUBE}
      />
    </div>
  );
}

function ColumnsBlockFields({ block, update }) {
  const renderColumnSideFields = (side) => {
    const prefix = side === "left" ? "left" : "right";
    const isImage = (block[`${prefix}Type`] || "text") === "image";

    return (
      <div className="grid gap-4 rounded-card border border-[color:var(--border-soft)] bg-[var(--panel-muted)] p-4">
        <DisplayModeFields
          label={side === "left" ? "Type colonne gauche" : "Type colonne droite"}
          value={block[`${prefix}Type`] || "text"}
          onChange={(nextType) => update({ [`${prefix}Type`]: nextType })}
          options={COLUMN_CONTENT_TYPE_OPTIONS}
        />

        {isImage ? (
          <div className="grid gap-4">
            <Field label="Source">
              <TextInput
                value={block[`${prefix}ImageSrc`] || ""}
                onChange={(event) => update({ [`${prefix}ImageSrc`]: event.target.value })}
                placeholder="/articles/guides-ableton/visuel.jpg"
              />
            </Field>
            <Field label="Alt">
              <TextInput
                value={block[`${prefix}ImageAlt`] || ""}
                onChange={(event) => update({ [`${prefix}ImageAlt`]: event.target.value })}
              />
            </Field>
            <Field label="Caption">
              <TextareaInput
                value={block[`${prefix}ImageCaption`] || ""}
                onChange={(event) => update({ [`${prefix}ImageCaption`]: event.target.value })}
              />
            </Field>
            <ImagePositionFields
              label="Recadrage visuel"
              position={block[`${prefix}ImagePosition`] || DEFAULT_IMAGE_POSITION}
              onChange={(nextPosition) => update({ [`${prefix}ImagePosition`]: nextPosition })}
            />
            <ImageZoomField
              value={block[`${prefix}ImageZoom`]}
              onChange={(nextZoom) => update({ [`${prefix}ImageZoom`]: nextZoom })}
            />
          </div>
        ) : (
          <Field label={side === "left" ? "Contenu gauche" : "Contenu droit"}>
            <TextareaInput
              value={block[`${prefix}Content`] || ""}
              onChange={(event) => update({ [`${prefix}Content`]: event.target.value })}
              placeholder={side === "left" ? "Texte de la colonne gauche" : "Texte de la colonne droite"}
            />
          </Field>
        )}
      </div>
    );
  };

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {renderColumnSideFields("left")}
        {renderColumnSideFields("right")}
      </div>
      <DisplayModeFields
        label="Ratio"
        value={block.ratio || "equal"}
        onChange={(nextRatio) => update({ ratio: nextRatio })}
        options={COLUMN_RATIO_OPTIONS}
      />
      <DisplayModeFields
        label="Format image"
        value={block.mediaAspectRatio || "4/3"}
        onChange={(nextRatio) => update({ mediaAspectRatio: nextRatio })}
        options={RATIO_OPTIONS}
      />
      <p className="text-ui leading-5 text-[var(--text-muted)]">
        Saut de ligne vide = nouveau paragraphe dans une colonne texte.
      </p>
    </div>
  );
}

export function BlockEditor({ block, index, onChange, onMoveUp, onMoveDown, onRemove, onDuplicate, onTypeChange, isHighlighted = false }) {
  const update = (patch) => onChange(index, { ...block, ...patch });
  const preview = getBlockPreview(block);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleRemove = () => {
    if (confirmDelete) {
      onRemove(index);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <article
      className="grid gap-4 rounded-card border bg-[var(--panel-bg)] p-4 transition-all duration-300"
      style={{
        borderColor: isHighlighted ? BLOCK_TYPE_COLORS[block.type] || "var(--border-strong)" : "var(--border-soft)",
        boxShadow: isHighlighted ? `0 0 0 3px ${BLOCK_TYPE_COLORS[block.type] || "#737373"}30` : "none",
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="shrink-0 text-label font-medium uppercase tracking-caps-wide text-[var(--text-muted)]">
            {index + 1}
          </span>
          <span
            className="shrink-0 rounded-tag px-2 py-0.5 text-label font-medium"
            style={{
              backgroundColor: `${BLOCK_TYPE_COLORS[block.type] || "#737373"}20`,
              color: BLOCK_TYPE_COLORS[block.type] || "var(--text-muted)",
            }}
          >
            {BLOCK_TYPE_LABELS[block.type] || block.type}
          </span>
          {preview ? (
            <span className="truncate text-ui text-[var(--text-muted)]">{preview}</span>
          ) : (
            <span className="text-ui italic text-[var(--text-muted)] opacity-40">Vide</span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button className={actionButtonClass} onClick={() => onDuplicate(index)} type="button" aria-label={`Dupliquer le bloc ${index + 1}`}>Copier</button>
          <button className={actionButtonClass} onClick={() => onMoveUp(index)} type="button" aria-label={`Monter le bloc ${index + 1}`}>Monter</button>
          <button className={actionButtonClass} onClick={() => onMoveDown(index)} type="button" aria-label={`Descendre le bloc ${index + 1}`}>Descendre</button>
          <button
            className={`${actionButtonClass} ${confirmDelete ? "border-red-400 text-red-500 hover:border-red-500 hover:text-red-600" : ""}`}
            onClick={handleRemove}
            type="button"
            aria-label={confirmDelete ? `Confirmer la suppression du bloc ${index + 1}` : `Supprimer le bloc ${index + 1}`}
          >
            {confirmDelete ? "Confirmer ?" : "Supprimer"}
          </button>
        </div>
      </div>

      <Field label="Type">
        <select
          className="h-10 w-full min-w-0 rounded-card border border-[color:var(--border-soft)] bg-[var(--panel-bg)] px-3 text-body text-[var(--text-primary)] outline-none transition-colors focus:border-[color:var(--border-strong)]"
          value={block.type}
          onChange={(event) => onTypeChange(index, event.target.value)}
        >
          {BLOCK_TYPES.map((type) => (
            <option key={type} value={type}>{BLOCK_TYPE_LABELS[type] || type}</option>
          ))}
        </select>
      </Field>

      <AlignmentFields
        value={block.align || DEFAULT_BLOCK_ALIGN}
        onChange={(nextAlign) => update({ align: nextAlign })}
      />

      {TEXT_STYLE_TYPES.has(block.type) ? (
        <div className="grid gap-4 xl:grid-cols-4">
          <DisplayModeFields
            label="Taille"
            value={block.fontSize || DEFAULT_PRESENTATION_OPTION}
            onChange={(nextFontSize) => update({ fontSize: nextFontSize })}
            options={block.type === "heading" ? HEADING_SIZE_OPTIONS : TEXT_SIZE_OPTIONS}
          />
          <DisplayModeFields
            label="Largeur"
            value={block.width || DEFAULT_PRESENTATION_OPTION}
            onChange={(nextWidth) => update({ width: nextWidth })}
            options={TEXT_WIDTH_OPTIONS}
          />
          <DisplayModeFields
            label="Couleur"
            value={block.tone || DEFAULT_PRESENTATION_OPTION}
            onChange={(nextTone) => update({ tone: nextTone })}
            options={TONE_OPTIONS}
          />
          <DisplayModeFields
            label="Espace avant"
            value={block.spacing || DEFAULT_PRESENTATION_OPTION}
            onChange={(nextSpacing) => update({ spacing: nextSpacing })}
            options={SPACING_OPTIONS}
          />
        </div>
      ) : block.type === "divider" ? (
        <div className="grid gap-4 xl:grid-cols-3">
          <DisplayModeFields
            label="Style"
            value={block.style || "line"}
            onChange={(nextStyle) => update({ style: nextStyle })}
            options={DIVIDER_STYLE_OPTIONS}
          />
          <DisplayModeFields
            label="Largeur"
            value={block.width || "content"}
            onChange={(nextWidth) => update({ width: nextWidth })}
            options={WIDTH_OPTIONS}
          />
          <DisplayModeFields
            label="Espace avant"
            value={block.spacing || DEFAULT_PRESENTATION_OPTION}
            onChange={(nextSpacing) => update({ spacing: nextSpacing })}
            options={SPACING_OPTIONS}
          />
        </div>
      ) : (
        <DisplayModeFields
          label="Espace avant"
          value={block.spacing || DEFAULT_PRESENTATION_OPTION}
          onChange={(nextSpacing) => update({ spacing: nextSpacing })}
          options={SPACING_OPTIONS}
        />
      )}

      <div key={block.type} className="block-fields-enter grid gap-4">

      {(block.type === "heading" || block.type === "paragraph" || block.type === "quote") && (
        <Field label="Contenu">
          <TextareaInput
            value={block.content || ""}
            onChange={(event) => update({ content: event.target.value })}
          />
        </Field>
      )}

      {block.type === "list" && (
        <Field label="Items" help="Un item par ligne.">
          <TextareaInput
            value={(block.items || []).join("\n")}
            onChange={(event) => update({ items: event.target.value.split("\n") })}
          />
        </Field>
      )}

      {block.type === "callout" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Label">
            <TextInput
              value={block.label || ""}
              onChange={(event) => update({ label: event.target.value })}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Contenu">
              <TextareaInput
                value={block.content || ""}
                onChange={(event) => update({ content: event.target.value })}
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <DisplayModeFields
              label="Fond"
              value={block.background || DEFAULT_PRESENTATION_OPTION}
              onChange={(nextBackground) => update({ background: nextBackground })}
              options={CALLOUT_BACKGROUND_OPTIONS}
            />
          </div>
        </div>
      )}

      {block.type === "divider" && (
        <Field label="Label" help="Optionnel. Un mot ou une courte légende au centre du séparateur.">
          <TextInput
            value={block.label || ""}
            onChange={(event) => update({ label: event.target.value })}
            placeholder="Ex. Process, Notes, Références"
          />
        </Field>
      )}

      {block.type === "columns" && (
        <ColumnsBlockFields block={block} update={update} />
      )}

      {(block.type === "image" || block.type === "gif") && (
        <div className="grid gap-4">
          <Field label="Source" help="Exemple : /articles/guides-ableton/mon-visuel.jpg ou un chemin .../public/articles/...">
            <TextInput value={block.src || ""} onChange={(event) => update({ src: event.target.value })} />
          </Field>
          <Field label="Alt">
            <TextInput value={block.alt || ""} onChange={(event) => update({ alt: event.target.value })} />
          </Field>
          <Field label="Caption">
            <TextareaInput value={block.caption || ""} onChange={(event) => update({ caption: event.target.value })} />
          </Field>
          <ImagePositionFields
            label="Recadrage visuel"
            position={block.position || DEFAULT_IMAGE_POSITION}
            onChange={(nextPosition) => update({ position: nextPosition })}
          />
          <ImageZoomField value={block.zoom} onChange={(nextZoom) => update({ zoom: nextZoom })} />
          <DisplayModeFields
            label="Largeur"
            value={block.width || DEFAULT_MEDIA_WIDTH}
            onChange={(nextWidth) => update({ width: nextWidth })}
            options={WIDTH_OPTIONS}
          />
          <DisplayModeFields
            label="Format"
            value={block.aspectRatio || getDefaultAspectRatio(block.type)}
            onChange={(nextRatio) => update({ aspectRatio: nextRatio })}
            options={RATIO_OPTIONS}
          />
        </div>
      )}

      {block.type === "youtube" && (
        <YoutubeBlockFields block={block} update={update} />
      )}

      {block.type === "link" && (
        <div className="grid gap-4">
          <Field label="URL" help="Exemple : https://www.ableton.com/">
            <TextInput value={block.url || ""} onChange={(event) => update({ url: event.target.value })} placeholder="https://..." />
          </Field>
          <Field label="Libellé">
            <TextInput value={block.label || ""} onChange={(event) => update({ label: event.target.value })} placeholder="Nom du lien" />
          </Field>
          <Field label="Description">
            <TextareaInput value={block.description || ""} onChange={(event) => update({ description: event.target.value })} placeholder="Texte optionnel sous le lien" />
          </Field>
          <DisplayModeFields
            label="Largeur"
            value={block.width || DEFAULT_MEDIA_WIDTH}
            onChange={(nextWidth) => update({ width: nextWidth })}
            options={WIDTH_OPTIONS}
          />
        </div>
      )}

      {block.type === "source" && (
        <div className="grid gap-4">
          <Field label="Titre de la source">
            <TextInput value={block.title || ""} onChange={(event) => update({ title: event.target.value })} placeholder="Nom de l'article, du site ou du document" />
          </Field>
          <Field label="URL">
            <TextInput value={block.url || ""} onChange={(event) => update({ url: event.target.value })} placeholder="https://..." />
          </Field>
          <Field label="Détails">
            <TextareaInput value={block.details || ""} onChange={(event) => update({ details: event.target.value })} placeholder="Auteur, date, note ou contexte optionnel" />
          </Field>
          <DisplayModeFields
            label="Largeur"
            value={block.width || DEFAULT_MEDIA_WIDTH}
            onChange={(nextWidth) => update({ width: nextWidth })}
            options={WIDTH_OPTIONS}
          />
        </div>
      )}

      </div>
    </article>
  );
}
