import { useEffect, useMemo, useState } from "react";
import { sections } from "../data/content";
import ArticlePage from "./ArticlePage";

const STORAGE_KEY = "metableton-article-editor-draft";
const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
      <rect width="1200" height="800" fill="#f4f2ec"/>
      <rect x="36" y="36" width="1128" height="728" rx="18" fill="#fcfbf8" stroke="#d6d3d1"/>
      <text x="80" y="120" fill="#7c7c7c" font-family="Arial, sans-serif" font-size="26">METABLETON</text>
      <text x="80" y="180" fill="#171717" font-family="Arial, sans-serif" font-size="52">Aperçu de l'image hero</text>
      <text x="80" y="228" fill="#5f6368" font-family="Arial, sans-serif" font-size="28">Ajoute un chemin d'image locale pour remplacer ce visuel</text>
    </svg>
  `);

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseTags(value) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 3);
}

function createBlock(type = "paragraph") {
  if (type === "list") {
    return { type, items: [""] };
  }

  if (type === "callout") {
    return { type, label: "Note", content: "" };
  }

  if (type === "youtube") {
    return { type, url: "", caption: "" };
  }

  if (type === "image" || type === "gif") {
    return { type, src: "", alt: "", caption: "" };
  }

  return { type, content: "" };
}

function createTemplateArticle() {
  return {
    id: "guide-nouvel-article",
    slug: "nouvel-article-ableton-live",
    section: "guides-ableton-live",
    type: "Guide",
    label: "Guide",
    featured: false,
    title: "Nouveau guide Ableton Live",
    summary: "Un résumé court et clair pour présenter rapidement le contenu de l’article.",
    heroImage: "/articles/guides-ableton/ableton-live-overview.jpg",
    thumbnail: "/articles/guides-ableton/ableton-live-overview.jpg",
    imageAlt: "Visuel d’article pour Ableton Live",
    tags: ["ableton", "workflow"],
    content: [
      {
        type: "paragraph",
        content: "Commence ici avec un premier paragraphe clair et concis.",
      },
    ],
  };
}

function createEmptyArticle() {
  return {
    id: "",
    slug: "",
    section: "",
    type: "Guide",
    label: "",
    featured: false,
    title: "",
    summary: "",
    heroImage: "",
    thumbnail: "",
    imageAlt: "",
    tags: [],
    content: [],
  };
}

function loadInitialEditorState() {
  const template = createTemplateArticle();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return {
        draftArticle: template,
        tagsInput: template.tags.join(", "),
        slugTouched: false,
        idTouched: false,
      };
    }

    const parsed = JSON.parse(raw);
    const draftArticle = parsed?.draftArticle ? { ...template, ...parsed.draftArticle } : template;

    return {
      draftArticle: {
        ...draftArticle,
        content: Array.isArray(draftArticle.content) ? draftArticle.content : template.content,
        tags: Array.isArray(draftArticle.tags) ? draftArticle.tags : template.tags,
      },
      tagsInput:
        typeof parsed?.tagsInput === "string"
          ? parsed.tagsInput
          : (draftArticle.tags || []).join(", "),
      slugTouched: Boolean(parsed?.slugTouched),
      idTouched: Boolean(parsed?.idTouched),
    };
  } catch {
    return {
      draftArticle: template,
      tagsInput: template.tags.join(", "),
      slugTouched: false,
      idTouched: false,
    };
  }
}

function sanitizeContent(content = []) {
  return content.reduce((accumulator, block) => {
    if (block.type === "list") {
      const items = (block.items || []).map((item) => item.trim()).filter(Boolean);

      if (items.length) {
        accumulator.push({ type: "list", items });
      }

      return accumulator;
    }

    if (block.type === "callout") {
      const nextBlock = {
        type: "callout",
        content: (block.content || "").trim(),
      };

      if (block.label?.trim()) {
        nextBlock.label = block.label.trim();
      }

      if (nextBlock.content || nextBlock.label) {
        accumulator.push(nextBlock);
      }

      return accumulator;
    }

    if (block.type === "image" || block.type === "gif") {
      const nextBlock = {
        type: block.type,
        src: (block.src || "").trim(),
        alt: (block.alt || "").trim(),
      };

      if (block.caption?.trim()) {
        nextBlock.caption = block.caption.trim();
      }

      if (nextBlock.src || nextBlock.alt || nextBlock.caption) {
        accumulator.push(nextBlock);
      }

      return accumulator;
    }

    if (block.type === "youtube") {
      const nextBlock = {
        type: "youtube",
        url: (block.url || "").trim(),
      };

      if (block.caption?.trim()) {
        nextBlock.caption = block.caption.trim();
      }

      if (nextBlock.url || nextBlock.caption) {
        accumulator.push(nextBlock);
      }

      return accumulator;
    }

    const contentValue = (block.content || "").trim();

    if (contentValue) {
      accumulator.push({
        type: block.type,
        content: contentValue,
      });
    }

    return accumulator;
  }, []);
}

function buildArticleObject(draftArticle, tagsInput) {
  const article = {
    id: draftArticle.id.trim(),
    slug: draftArticle.slug.trim(),
    section: draftArticle.section,
    type: draftArticle.type.trim(),
    label: draftArticle.label.trim(),
    title: draftArticle.title.trim(),
    summary: draftArticle.summary.trim(),
    heroImage: draftArticle.heroImage.trim(),
    thumbnail: draftArticle.thumbnail.trim(),
    imageAlt: draftArticle.imageAlt.trim(),
    tags: parseTags(tagsInput),
    content: sanitizeContent(draftArticle.content),
  };

  if (draftArticle.featured) {
    article.featured = true;
  }

  return article;
}

function getValidation(article) {
  const errors = [];
  const warnings = [];

  if (!article.title) {
    errors.push("Le titre est requis.");
  }

  if (!article.slug) {
    errors.push("Le slug est requis.");
  }

  if (!article.section) {
    errors.push("La section est requise.");
  }

  if (!article.content.length) {
    errors.push("Ajoute au moins un bloc de contenu.");
  }

  if (!article.heroImage) {
    warnings.push("heroImage est recommandé pour le rendu article.");
  }

  if (!article.thumbnail) {
    warnings.push("thumbnail est recommandé pour les listings.");
  }

  if (!article.imageAlt) {
    warnings.push("imageAlt est recommandé pour l’accessibilité.");
  }

  return { errors, warnings };
}

function downloadTextFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function Field({ label, help, children }) {
  return (
    <label className="grid gap-2">
      <span className="text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--text-muted)]">
        {label}
      </span>
      {children}
      {help ? <span className="text-[13px] leading-5 text-[var(--text-muted)]">{help}</span> : null}
    </label>
  );
}

function TextInput(props) {
  return (
    <input
      {...props}
      className="h-10 rounded-[10px] border border-[color:var(--border-soft)] bg-[var(--panel-bg)] px-3 text-[15px] text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[color:var(--border-strong)]"
    />
  );
}

function TextareaInput(props) {
  return (
    <textarea
      {...props}
      className="min-h-[104px] rounded-[10px] border border-[color:var(--border-soft)] bg-[var(--panel-bg)] px-3 py-3 text-[15px] leading-6 text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[color:var(--border-strong)]"
    />
  );
}

function BlockEditor({ block, index, onChange, onMoveUp, onMoveDown, onRemove }) {
  const handleListChange = (value) => {
    onChange(index, {
      ...block,
      items: value.split("\n"),
    });
  };

  const actionButtonClass =
    "inline-flex h-8 items-center rounded-[10px] border border-[color:var(--border-soft)] px-3 text-[13px] text-[var(--text-secondary)] transition-colors hover:border-[color:var(--border-strong)] hover:text-[var(--text-primary)]";

  return (
    <article className="grid gap-4 rounded-[10px] border border-[color:var(--border-soft)] bg-[var(--panel-bg)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--text-muted)]">
            Bloc {index + 1}
          </span>
          <span className="text-[14px] text-[var(--text-secondary)]">{block.type}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button className={actionButtonClass} onClick={() => onMoveUp(index)} type="button">
            Monter
          </button>
          <button className={actionButtonClass} onClick={() => onMoveDown(index)} type="button">
            Descendre
          </button>
          <button className={actionButtonClass} onClick={() => onRemove(index)} type="button">
            Supprimer
          </button>
        </div>
      </div>

      {(block.type === "heading" || block.type === "paragraph" || block.type === "quote") && (
        <Field label="Contenu">
          <TextareaInput
            value={block.content || ""}
            onChange={(event) => onChange(index, { ...block, content: event.target.value })}
          />
        </Field>
      )}

      {block.type === "list" && (
        <Field label="Items" help="Un item par ligne.">
          <TextareaInput
            value={(block.items || []).join("\n")}
            onChange={(event) => handleListChange(event.target.value)}
          />
        </Field>
      )}

      {block.type === "callout" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Label">
            <TextInput
              value={block.label || ""}
              onChange={(event) => onChange(index, { ...block, label: event.target.value })}
            />
          </Field>

          <div className="sm:col-span-2">
            <Field label="Contenu">
              <TextareaInput
                value={block.content || ""}
                onChange={(event) => onChange(index, { ...block, content: event.target.value })}
              />
            </Field>
          </div>
        </div>
      )}

      {(block.type === "image" || block.type === "gif") && (
        <div className="grid gap-4">
          <Field label="Source" help="Exemple : /articles/guides-ableton/mon-visuel.jpg">
            <TextInput
              value={block.src || ""}
              onChange={(event) => onChange(index, { ...block, src: event.target.value })}
            />
          </Field>

          <Field label="Alt">
            <TextInput
              value={block.alt || ""}
              onChange={(event) => onChange(index, { ...block, alt: event.target.value })}
            />
          </Field>

          <Field label="Caption">
            <TextareaInput
              value={block.caption || ""}
              onChange={(event) => onChange(index, { ...block, caption: event.target.value })}
            />
          </Field>
        </div>
      )}

      {block.type === "youtube" && (
        <div className="grid gap-4">
          <Field
            label="URL YouTube"
            help="Colle un lien YouTube classique, youtu.be, shorts ou embed."
          >
            <TextInput
              value={block.url || ""}
              onChange={(event) => onChange(index, { ...block, url: event.target.value })}
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </Field>

          <Field label="Caption">
            <TextareaInput
              value={block.caption || ""}
              onChange={(event) => onChange(index, { ...block, caption: event.target.value })}
            />
          </Field>
        </div>
      )}
    </article>
  );
}

function ArticleEditorPage() {
  const initialState = useMemo(() => loadInitialEditorState(), []);
  const [draftArticle, setDraftArticle] = useState(initialState.draftArticle);
  const [tagsInput, setTagsInput] = useState(initialState.tagsInput);
  const [slugTouched, setSlugTouched] = useState(initialState.slugTouched);
  const [idTouched, setIdTouched] = useState(initialState.idTouched);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        draftArticle,
        tagsInput,
        slugTouched,
        idTouched,
      }),
    );
  }, [draftArticle, tagsInput, slugTouched, idTouched]);

  useEffect(() => {
    if (!feedback) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setFeedback(""), 2400);
    return () => window.clearTimeout(timeoutId);
  }, [feedback]);

  const articleObject = useMemo(
    () => buildArticleObject(draftArticle, tagsInput),
    [draftArticle, tagsInput],
  );
  const validation = useMemo(() => getValidation(articleObject), [articleObject]);
  const sectionTitle =
    sections.find((section) => section.id === draftArticle.section)?.title || "Section";

  const previewArticle = useMemo(() => {
    const previewContent =
      articleObject.content.length > 0
        ? articleObject.content
        : [
            {
              type: "paragraph",
              content: "L’aperçu apparaîtra ici au fur et à mesure que tu ajoutes du contenu.",
            },
          ];

    return {
      ...articleObject,
      title: articleObject.title || "Titre d’article",
      summary: articleObject.summary || "Résumé de l’article pour l’aperçu.",
      heroImage: articleObject.heroImage || PLACEHOLDER_IMAGE,
      thumbnail: articleObject.thumbnail || articleObject.heroImage || PLACEHOLDER_IMAGE,
      imageAlt: articleObject.imageAlt || "Visuel d’article",
      content: previewContent,
      tags: articleObject.tags,
    };
  }, [articleObject]);

  const jsSnippet = `${JSON.stringify(articleObject, null, 2)},\n`;
  const jsonExport = `${JSON.stringify(articleObject, null, 2)}\n`;

  const handleTitleChange = (value) => {
    setDraftArticle((currentArticle) => {
      const nextArticle = {
        ...currentArticle,
        title: value,
      };

      if (!slugTouched) {
        nextArticle.slug = slugify(value);
      }

      if (!idTouched) {
        nextArticle.id = slugify(value);
      }

      return nextArticle;
    });
  };

  const updateField = (field, value) => {
    setDraftArticle((currentArticle) => ({
      ...currentArticle,
      [field]: value,
    }));
  };

  const updateBlock = (index, nextBlock) => {
    setDraftArticle((currentArticle) => ({
      ...currentArticle,
      content: currentArticle.content.map((block, blockIndex) =>
        blockIndex === index ? nextBlock : block,
      ),
    }));
  };

  const moveBlock = (index, direction) => {
    setDraftArticle((currentArticle) => {
      const nextIndex = index + direction;

      if (nextIndex < 0 || nextIndex >= currentArticle.content.length) {
        return currentArticle;
      }

      const nextBlocks = [...currentArticle.content];
      [nextBlocks[index], nextBlocks[nextIndex]] = [nextBlocks[nextIndex], nextBlocks[index]];

      return {
        ...currentArticle,
        content: nextBlocks,
      };
    });
  };

  const removeBlock = (index) => {
    setDraftArticle((currentArticle) => ({
      ...currentArticle,
      content: currentArticle.content.filter((_, blockIndex) => blockIndex !== index),
    }));
  };

  const addBlock = (type) => {
    setDraftArticle((currentArticle) => ({
      ...currentArticle,
      content: [...currentArticle.content, createBlock(type)],
    }));
  };

  const handleNewDraft = () => {
    const nextArticle = createEmptyArticle();
    setDraftArticle(nextArticle);
    setTagsInput("");
    setSlugTouched(false);
    setIdTouched(false);
    setFeedback("Nouveau brouillon prêt.");
  };

  const handleResetTemplate = () => {
    const nextArticle = createTemplateArticle();
    setDraftArticle(nextArticle);
    setTagsInput(nextArticle.tags.join(", "));
    setSlugTouched(false);
    setIdTouched(false);
    setFeedback("Brouillon réinitialisé.");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsSnippet);
      setFeedback("Snippet copié.");
    } catch {
      setFeedback("Copie impossible sur ce navigateur.");
    }
  };

  const panelClass = "rounded-[10px] border border-[color:var(--border-soft)] bg-[var(--panel-bg)] p-4";
  const sectionLabelClass =
    "text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--text-muted)]";
  const actionButtonClass =
    "inline-flex h-10 items-center rounded-[10px] border border-[color:var(--border-soft)] px-4 text-[14px] text-[var(--text-secondary)] transition-colors hover:border-[color:var(--border-strong)] hover:text-[var(--text-primary)]";

  return (
    <section className="mx-auto flex w-full max-w-[1400px] flex-col gap-6" aria-labelledby="editor-title">
      <header className="grid gap-4 rounded-[10px] border border-[color:var(--border-soft)] bg-[var(--panel-bg)] p-4 lg:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="grid gap-2">
            <p className={sectionLabelClass}>Éditeur local</p>
            <h1
              id="editor-title"
              className="font-[var(--font-display)] text-[36px] leading-[0.96] tracking-[-0.04em] text-[var(--text-primary)] sm:text-[48px]"
            >
              Article Editor
            </h1>
            <p className="max-w-[720px] text-[15px] leading-7 text-[var(--text-secondary)]">
              Outil local de rédaction pour construire un article au format exact attendu par
              `data/content.js`, avec aperçu live et export direct.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button className={actionButtonClass} onClick={handleNewDraft} type="button">
              Nouveau brouillon
            </button>
            <button className={actionButtonClass} onClick={handleResetTemplate} type="button">
              Réinitialiser
            </button>
            <button className={actionButtonClass} onClick={handleCopy} type="button">
              Copier le snippet JS
            </button>
            <button
              className={actionButtonClass}
              onClick={() =>
                downloadTextFile(
                  `${articleObject.slug || "article"}.json`,
                  jsonExport,
                  "application/json",
                )
              }
              type="button"
            >
              Télécharger JSON
            </button>
            <button
              className={actionButtonClass}
              onClick={() =>
                downloadTextFile(
                  `${articleObject.slug || "article"}.js`,
                  jsSnippet,
                  "text/javascript",
                )
              }
              type="button"
            >
              Télécharger JS
            </button>
          </div>
        </div>

        {feedback ? (
          <p className="text-[14px] text-[var(--text-secondary)]">{feedback}</p>
        ) : null}
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(420px,520px)_minmax(0,1fr)]">
        <div className="grid gap-6">
          <section className={panelClass}>
            <div className="mb-4 grid gap-1">
              <h2 className="text-[16px] font-medium text-[var(--text-primary)]">Métadonnées</h2>
              <p className="text-[14px] text-[var(--text-secondary)]">
                Renseigne les champs principaux de l’article. Le slug et l’id se génèrent depuis
                le titre tant qu’ils ne sont pas modifiés manuellement.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Title">
                <TextInput
                  value={draftArticle.title}
                  onChange={(event) => handleTitleChange(event.target.value)}
                  placeholder="Titre de l’article"
                />
              </Field>

              <Field label="Section">
                <select
                  className="h-10 rounded-[10px] border border-[color:var(--border-soft)] bg-[var(--panel-bg)] px-3 text-[15px] text-[var(--text-primary)] outline-none transition-colors focus:border-[color:var(--border-strong)]"
                  value={draftArticle.section}
                  onChange={(event) => updateField("section", event.target.value)}
                >
                  <option value="">Choisir une section</option>
                  {sections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.title}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Id">
                <TextInput
                  value={draftArticle.id}
                  onChange={(event) => {
                    setIdTouched(true);
                    updateField("id", event.target.value);
                  }}
                  placeholder="id-technique-article"
                />
              </Field>

              <Field label="Slug">
                <TextInput
                  value={draftArticle.slug}
                  onChange={(event) => {
                    setSlugTouched(true);
                    updateField("slug", slugify(event.target.value) || event.target.value);
                  }}
                  placeholder="slug-article"
                />
              </Field>

              <Field label="Type">
                <TextInput
                  value={draftArticle.type}
                  onChange={(event) => updateField("type", event.target.value)}
                  placeholder="Guide"
                />
              </Field>

              <Field label="Label">
                <TextInput
                  value={draftArticle.label}
                  onChange={(event) => updateField("label", event.target.value)}
                  placeholder="Guide"
                />
              </Field>

              <div className="sm:col-span-2">
                <Field label="Summary">
                  <TextareaInput
                    value={draftArticle.summary}
                    onChange={(event) => updateField("summary", event.target.value)}
                    placeholder="Résumé de l’article"
                  />
                </Field>
              </div>

              <Field
                label="Hero Image"
                help="Exemple : /articles/guides-ableton/mon-image.jpg"
              >
                <TextInput
                  value={draftArticle.heroImage}
                  onChange={(event) => updateField("heroImage", event.target.value)}
                  placeholder="/articles/guides-ableton/hero.jpg"
                />
              </Field>

              <Field label="Thumbnail" help="Souvent identique à heroImage dans ce projet.">
                <TextInput
                  value={draftArticle.thumbnail}
                  onChange={(event) => updateField("thumbnail", event.target.value)}
                  placeholder="/articles/guides-ableton/hero.jpg"
                />
              </Field>

              <Field label="Image Alt">
                <TextInput
                  value={draftArticle.imageAlt}
                  onChange={(event) => updateField("imageAlt", event.target.value)}
                  placeholder="Description de l’image"
                />
              </Field>

              <Field label="Tags" help="Sépare les tags par des virgules, maximum 3.">
                <TextInput
                  value={tagsInput}
                  onChange={(event) => {
                    setTagsInput(event.target.value);
                    updateField("tags", parseTags(event.target.value));
                  }}
                  placeholder="ableton, workflow, live"
                />
              </Field>

              <label className="inline-flex items-center gap-3 pt-7 text-[15px] text-[var(--text-secondary)]">
                <input
                  type="checkbox"
                  checked={draftArticle.featured}
                  onChange={(event) => updateField("featured", event.target.checked)}
                />
                Article vedette homepage
              </label>
            </div>
          </section>

          <section className={panelClass}>
            <div className="mb-4 grid gap-1">
              <h2 className="text-[16px] font-medium text-[var(--text-primary)]">Contenu</h2>
              <p className="text-[14px] text-[var(--text-secondary)]">
                Ajoute, réordonne et modifie les blocs dans le format exact attendu par le site.
              </p>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {["heading", "paragraph", "list", "quote", "callout", "image", "gif", "youtube"].map((type) => (
                <button
                  key={type}
                  className="inline-flex h-9 items-center rounded-[10px] border border-[color:var(--border-soft)] px-3 text-[13px] text-[var(--text-secondary)] transition-colors hover:border-[color:var(--border-strong)] hover:text-[var(--text-primary)]"
                  onClick={() => addBlock(type)}
                  type="button"
                >
                  + {type}
                </button>
              ))}
            </div>

            <div className="grid gap-4">
              {draftArticle.content.length ? (
                draftArticle.content.map((block, index) => (
                  <BlockEditor
                    key={`${block.type}-${index}`}
                    block={block}
                    index={index}
                    onChange={updateBlock}
                    onMoveUp={(blockIndex) => moveBlock(blockIndex, -1)}
                    onMoveDown={(blockIndex) => moveBlock(blockIndex, 1)}
                    onRemove={removeBlock}
                  />
                ))
              ) : (
                <div className="rounded-[10px] border border-dashed border-[color:var(--border-soft)] px-4 py-6 text-[14px] leading-6 text-[var(--text-secondary)]">
                  Aucun bloc pour le moment. Utilise les boutons ci-dessus pour commencer.
                </div>
              )}
            </div>
          </section>

          <section className={panelClass}>
            <div className="grid gap-3">
              <h2 className="text-[16px] font-medium text-[var(--text-primary)]">Validation</h2>

              {validation.errors.length ? (
                <div className="grid gap-2 rounded-[10px] border border-[color:var(--border-strong)] px-4 py-4">
                  <p className={sectionLabelClass}>Erreurs</p>
                  <ul className="grid gap-1 text-[14px] text-[var(--text-secondary)]">
                    {validation.errors.map((error) => (
                      <li key={error}>{error}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="rounded-[10px] border border-[color:var(--border-soft)] px-4 py-4 text-[14px] text-[var(--text-secondary)]">
                  Aucun blocage détecté.
                </div>
              )}

              {validation.warnings.length ? (
                <div className="grid gap-2 rounded-[10px] border border-[color:var(--border-soft)] px-4 py-4">
                  <p className={sectionLabelClass}>Avertissements</p>
                  <ul className="grid gap-1 text-[14px] text-[var(--text-secondary)]">
                    {validation.warnings.map((warning) => (
                      <li key={warning}>{warning}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </section>

          <section className={panelClass}>
            <div className="grid gap-3">
              <h2 className="text-[16px] font-medium text-[var(--text-primary)]">Aide</h2>
              <ul className="grid gap-2 text-[14px] leading-6 text-[var(--text-secondary)]">
                <li>Utilise des chemins locaux du type `/articles/guides-ableton/mon-image.jpg`.</li>
                <li>`heroImage` et `thumbnail` sont souvent identiques dans ce projet.</li>
                <li>Le snippet JS téléchargé ou copié peut être collé directement dans `data/content.js`.</li>
                <li>La route `/editor` est un outil local de rédaction, sans backend ni CMS.</li>
              </ul>
            </div>
          </section>
        </div>

        <section className="grid gap-4 xl:sticky xl:top-8 xl:h-fit">
          <div className={panelClass}>
            <div className="grid gap-2">
              <p className={sectionLabelClass}>Aperçu live</p>
              <p className="text-[14px] text-[var(--text-secondary)]">
                Le rendu de droite réutilise directement `ArticlePage.jsx`.
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-[10px] border border-[color:var(--border-soft)] bg-[var(--panel-bg)] p-4 lg:p-6">
            <ArticlePage article={previewArticle} sectionTitle={sectionTitle} />
          </div>
        </section>
      </div>
    </section>
  );
}

export default ArticleEditorPage;
