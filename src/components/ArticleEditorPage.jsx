import { useEffect, useMemo, useRef, useState } from "react";
import { articleEntries, sections } from "../data/content";
import ArticlePage from "./ArticlePage";
import { BlockEditor } from "./editor/BlockEditor";
import { Field, ImagePositionFields, TextInput, TextareaInput } from "./editor/EditorFields";
import {
  BLOCK_TYPE_LABELS,
  BLOCK_TYPES,
  DEFAULT_IMAGE_POSITION,
  PLACEHOLDER_IMAGE,
  STORAGE_KEY,
  buildArticleObject,
  convertBlockType,
  createBlock,
  createEmptyArticle,
  createTemplateArticle,
  downloadTextFile,
  getValidation,
  loadInitialEditorState,
  normalizeEditorArticle,
  parseExtraSections,
  parseTags,
  slugify,
  ensureBlockIds,
} from "./editor/editorUtils";

function contentReducer(content, action) {
  switch (action.type) {
    case "update":
      return content.map((block, i) => (i === action.index ? action.block : block));
    case "move": {
      const next = action.index + action.direction;
      if (next < 0 || next >= content.length) return content;
      const blocks = [...content];
      [blocks[action.index], blocks[next]] = [blocks[next], blocks[action.index]];
      return blocks;
    }
    case "remove":
      return content.filter((_, i) => i !== action.index);
    case "duplicate": {
      const source = content[action.index];
      if (!source) return content;
      const blocks = [...content];
      const copy = { ...JSON.parse(JSON.stringify(source)), _id: `${Date.now()}-${Math.random().toString(36).slice(2)}` };
      blocks.splice(action.index + 1, 0, copy);
      return blocks;
    }
    case "changeType":
      return content.map((block, i) => (i === action.index ? convertBlockType(block, action.nextType) : block));
    case "add":
      return [...content, createBlock(action.blockType)];
    default:
      return content;
  }
}

function ArticleEditorPage() {
  const initialState = useMemo(() => loadInitialEditorState(), []);
  const existingArticles = useMemo(
    () => articleEntries.map((article) => ({ id: article.id, title: article.title, section: article.section })),
    [],
  );

  const [draftArticle, setDraftArticle] = useState(initialState.draftArticle);
  const [tagsInput, setTagsInput] = useState(initialState.tagsInput);
  const [slugTouched, setSlugTouched] = useState(initialState.slugTouched);
  const [idTouched, setIdTouched] = useState(initialState.idTouched);
  const [selectedExistingArticleId, setSelectedExistingArticleId] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [highlightedBlockIndex, setHighlightedBlockIndex] = useState(null);
  const blockRefs = useRef({});

  const saveTimerRef = useRef(null);
  useEffect(() => {
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ draftArticle, tagsInput, slugTouched, idTouched }));
    }, 500);
    return () => clearTimeout(saveTimerRef.current);
  }, [draftArticle, tagsInput, slugTouched, idTouched]);

  useEffect(() => {
    if (!feedback) return undefined;
    const timeoutId = window.setTimeout(() => setFeedback(null), 3500);
    return () => window.clearTimeout(timeoutId);
  }, [feedback]);

  const articleObject = useMemo(() => buildArticleObject(draftArticle, tagsInput), [draftArticle, tagsInput]);
  const validation = useMemo(() => getValidation(articleObject), [articleObject]);
  const sectionTitle = sections.find((section) => section.id === draftArticle.section)?.title || "Section";

  const previewArticle = useMemo(() => {
    const previewContent = articleObject.content.length > 0
      ? articleObject.content
      : [{ type: "paragraph", content: "L'aperçu apparaîtra ici au fur et à mesure que tu ajoutes du contenu." }];
    return {
      ...articleObject,
      title: articleObject.title || "Titre d'article",
      summary: articleObject.summary || "Résumé de l'article pour l'aperçu.",
      heroImage: articleObject.heroImage || PLACEHOLDER_IMAGE,
      thumbnail: articleObject.thumbnail || articleObject.heroImage || PLACEHOLDER_IMAGE,
      imageAlt: articleObject.imageAlt || "Visuel d'article",
      content: previewContent,
      tags: articleObject.tags,
    };
  }, [articleObject]);

  const jsSnippet = useMemo(() => `${JSON.stringify(articleObject, null, 2)},\n`, [articleObject]);
  const jsonExport = useMemo(() => `${JSON.stringify(articleObject, null, 2)}\n`, [articleObject]);

  const updateField = (field, value) => setDraftArticle((current) => ({ ...current, [field]: value }));

  const handleTitleChange = (value) => {
    setDraftArticle((current) => {
      const next = { ...current, title: value };
      if (!slugTouched) next.slug = slugify(value);
      if (!idTouched) next.id = slugify(value);
      return next;
    });
  };

  const updateContent = (action) => {
    setDraftArticle((current) => ({ ...current, content: contentReducer(current.content, action) }));
  };

  const updateBlock = (index, block) => updateContent({ type: "update", index, block });
  const moveBlock = (index, direction) => updateContent({ type: "move", index, direction });
  const removeBlock = (index) => updateContent({ type: "remove", index });
  const duplicateBlock = (index) => updateContent({ type: "duplicate", index });
  const changeBlockType = (index, nextType) => updateContent({ type: "changeType", index, nextType });
  const addBlock = (blockType) => updateContent({ type: "add", blockType });

  const handleNewDraft = () => {
    setDraftArticle(createEmptyArticle());
    setTagsInput("");
    setSlugTouched(false);
    setIdTouched(false);
    setFeedback({ message: "Nouveau brouillon prêt.", type: "success" });
  };

  const handleResetTemplate = () => {
    const next = createTemplateArticle();
    setDraftArticle(next);
    setTagsInput(next.tags.join(", "));
    setSlugTouched(false);
    setIdTouched(false);
    setFeedback({ message: "Brouillon réinitialisé.", type: "info" });
  };

  const handleLoadExistingArticle = () => {
    if (!selectedExistingArticleId) { setFeedback({ message: "Choisis un article à charger.", type: "warning" }); return; }
    const selected = articleEntries.find((article) => article.id === selectedExistingArticleId);
    if (!selected) { setFeedback({ message: "Article introuvable.", type: "error" }); return; }
    const normalized = normalizeEditorArticle(selected);
    setDraftArticle(normalized);
    setTagsInput((normalized.tags || []).join(", "));
    setSlugTouched(true);
    setIdTouched(true);
    setFeedback({ message: "Article chargé dans l'éditeur.", type: "success" });
  };

  const handleBlockClick = (index) => {
    setHighlightedBlockIndex(index);
    const el = blockRefs.current[index];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => setHighlightedBlockIndex(null), 1800);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsSnippet);
      setFeedback({ message: "Snippet copié.", type: "success" });
    } catch {
      setFeedback({ message: "Copie impossible sur ce navigateur.", type: "error" });
    }
  };

  const panelClass = "min-w-0 rounded-card bg-[var(--panel-bg)] p-5";
  const sectionLabelClass = "text-label font-medium uppercase tracking-caps-wide text-[var(--text-muted)]";
  const actionButtonClass = "inline-flex h-9 items-center rounded-card border border-[color:var(--border-soft)] px-4 text-sm text-[var(--text-secondary)] transition-colors hover:border-[color:var(--border-strong)] hover:text-[var(--text-primary)]";

  return (
    <section
      className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 xl:h-[calc(100vh-4rem)] xl:overflow-hidden"
      aria-labelledby="editor-title"
    >
      {/* Header */}
      <header className="grid gap-4 rounded-card bg-[var(--panel-bg)] p-5 lg:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="grid gap-2">
            <p className={sectionLabelClass}>Éditeur local</p>
            <h1
              id="editor-title"
              className="font-[var(--font-display)] text-[36px] leading-[0.96] tracking-display text-[var(--text-primary)] sm:text-[48px]"
            >
              Article Editor
            </h1>
            <p className="max-w-[720px] text-body leading-7 text-[var(--text-secondary)]">
              Outil local de rédaction pour construire un article au format exact attendu par
              `data/content.js`, avec aperçu live et export direct.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button className={actionButtonClass} onClick={handleNewDraft} type="button">Nouveau brouillon</button>
            <button className={actionButtonClass} onClick={handleResetTemplate} type="button">Réinitialiser</button>
            <button className={actionButtonClass} onClick={handleCopy} type="button">Copier le snippet JS</button>
            <button className={actionButtonClass} onClick={() => downloadTextFile(`${articleObject.slug || "article"}.json`, jsonExport, "application/json")} type="button">
              Télécharger JSON
            </button>
            <button className={actionButtonClass} onClick={() => downloadTextFile(`${articleObject.slug || "article"}.js`, jsSnippet, "text/javascript")} type="button">
              Télécharger JS
            </button>
          </div>
        </div>

      </header>

      <div className="grid gap-6 xl:h-full xl:min-h-0 xl:flex-1 xl:grid-cols-[minmax(420px,520px)_minmax(0,1fr)]">
        <div className="min-w-0 grid gap-6 xl:h-full xl:min-h-0 xl:content-start xl:overflow-x-hidden xl:overflow-y-auto xl:overscroll-contain xl:pr-3">
          {/* Existing articles loader */}
          <section className={panelClass}>
            <div className="mb-5">
              <h2 className="text-body font-semibold text-[var(--text-primary)]">Articles existants</h2>
              <p className="mt-1 text-ui text-[var(--text-muted)]">
                Charge un article présent dans `content.js` pour le modifier dans l'éditeur.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <Field label="Choisir un article">
                <select
                  className="h-10 w-full min-w-0 rounded-card border border-[color:var(--border-soft)] bg-[var(--panel-bg)] px-3 text-body text-[var(--text-primary)] outline-none transition-colors focus:border-[color:var(--border-strong)]"
                  value={selectedExistingArticleId}
                  onChange={(event) => setSelectedExistingArticleId(event.target.value)}
                >
                  <option value="">Choisir un article existant</option>
                  {existingArticles.map((article) => {
                    const title = sections.find((s) => s.id === article.section)?.title || article.section;
                    return (
                      <option key={article.id} value={article.id}>
                        {article.title} · {title}
                      </option>
                    );
                  })}
                </select>
              </Field>

              <div>
                <button className={`${actionButtonClass} w-full justify-center lg:w-auto`} onClick={handleLoadExistingArticle} type="button">
                  Charger
                </button>
              </div>
            </div>
          </section>

          {/* Metadata */}
          <section className={panelClass}>
            <div className="mb-5">
              <h2 className="text-body font-semibold text-[var(--text-primary)]">Métadonnées</h2>
              <p className="mt-1 text-ui text-[var(--text-muted)]">
                Renseigne les champs principaux de l'article. Le slug et l'id se génèrent depuis
                le titre tant qu'ils ne sont pas modifiés manuellement.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Title">
                <TextInput value={draftArticle.title} onChange={(event) => handleTitleChange(event.target.value)} placeholder="Titre de l'article" />
              </Field>

              <Field label="Section">
                <select
                  className="h-10 w-full min-w-0 rounded-card border border-[color:var(--border-soft)] bg-[var(--panel-bg)] px-3 text-body text-[var(--text-primary)] outline-none transition-colors focus:border-[color:var(--border-strong)]"
                  value={draftArticle.section}
                  onChange={(event) => updateField("section", event.target.value)}
                >
                  <option value="">Choisir une section</option>
                  {sections.map((section) => (
                    <option key={section.id} value={section.id}>{section.title}</option>
                  ))}
                </select>
              </Field>

              <Field label="Sections supplémentaires" help="Optionnel. Sépare les ids par des virgules, par exemple : blog-news, freebies">
                <TextInput
                  value={(draftArticle.extraSections || []).join(", ")}
                  onChange={(event) => updateField("extraSections", parseExtraSections(event.target.value, draftArticle.section))}
                  placeholder="blog-news, freebies"
                />
              </Field>

              <Field label="Id">
                <TextInput
                  value={draftArticle.id}
                  onChange={(event) => { setIdTouched(true); updateField("id", event.target.value); }}
                  placeholder="id-technique-article"
                />
              </Field>

              <Field label="Slug">
                <TextInput
                  value={draftArticle.slug}
                  onChange={(event) => { setSlugTouched(true); updateField("slug", slugify(event.target.value) || event.target.value); }}
                  placeholder="slug-article"
                />
              </Field>

              <Field label="Type">
                <TextInput value={draftArticle.type} onChange={(event) => updateField("type", event.target.value)} placeholder="Guide" />
              </Field>

              <Field label="Label">
                <TextInput value={draftArticle.label} onChange={(event) => updateField("label", event.target.value)} placeholder="Guide" />
              </Field>

              <div className="sm:col-span-2">
                <Field label="Summary">
                  <TextareaInput value={draftArticle.summary} onChange={(event) => updateField("summary", event.target.value)} placeholder="Résumé de l'article" />
                </Field>
              </div>

              <Field label="Hero Image" help="Exemple : /articles/guides-ableton/mon-image.jpg ou un chemin .../public/articles/...">
                <TextInput value={draftArticle.heroImage} onChange={(event) => updateField("heroImage", event.target.value)} placeholder="/articles/guides-ableton/hero.jpg" />
              </Field>

              <ImagePositionFields
                label="Recadrage hero"
                position={draftArticle.heroImagePosition || DEFAULT_IMAGE_POSITION}
                onChange={(nextPosition) => updateField("heroImagePosition", nextPosition)}
              />

              <Field label="Thumbnail" help="Souvent identique à heroImage dans ce projet.">
                <TextInput value={draftArticle.thumbnail} onChange={(event) => updateField("thumbnail", event.target.value)} placeholder="/articles/guides-ableton/hero.jpg" />
              </Field>

              <ImagePositionFields
                label="Recadrage vignette"
                position={draftArticle.thumbnailPosition || DEFAULT_IMAGE_POSITION}
                onChange={(nextPosition) => updateField("thumbnailPosition", nextPosition)}
              />

              <Field label="Image Alt">
                <TextInput value={draftArticle.imageAlt} onChange={(event) => updateField("imageAlt", event.target.value)} placeholder="Description de l'image" />
              </Field>

              <Field label="Tags" help="Sépare les tags par des virgules. Les listings de section n'en affichent que 3.">
                <TextInput
                  value={tagsInput}
                  onChange={(event) => { setTagsInput(event.target.value); updateField("tags", parseTags(event.target.value)); }}
                  placeholder="ableton, workflow, live"
                />
              </Field>

              <label className="inline-flex items-center gap-3 pt-7 text-body text-[var(--text-secondary)]">
                <input type="checkbox" checked={draftArticle.featured} onChange={(event) => updateField("featured", event.target.checked)} />
                Article vedette homepage
              </label>
            </div>
          </section>

          {/* Content blocks */}
          <section className={panelClass}>
            <div className="mb-5 flex items-baseline justify-between gap-4">
              <div>
                <h2 className="text-body font-semibold text-[var(--text-primary)]">Contenu</h2>
                <p className="mt-1 text-ui text-[var(--text-muted)]">
                  Ajoute, réordonne et modifie les blocs dans le format exact attendu par le site.
                </p>
              </div>
              {draftArticle.content.length > 0 && (
                <span className="shrink-0 text-label font-medium uppercase tracking-caps-wide text-[var(--text-muted)]">
                  {draftArticle.content.length} bloc{draftArticle.content.length > 1 ? "s" : ""}
                </span>
              )}
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {BLOCK_TYPES.map((type) => (
                <button
                  key={type}
                  className="inline-flex h-9 items-center rounded-card border border-[color:var(--border-soft)] px-3 text-ui text-[var(--text-secondary)] transition-colors hover:border-[color:var(--border-strong)] hover:text-[var(--text-primary)]"
                  onClick={() => addBlock(type)}
                  type="button"
                >
                  + {BLOCK_TYPE_LABELS[type] || type}
                </button>
              ))}
            </div>

            <div className="grid gap-4">
              {draftArticle.content.length ? (
                draftArticle.content.map((block, index) => (
                  <div key={block._id || `${block.type}-${index}`} ref={(el) => { blockRefs.current[index] = el; }}>
                    <BlockEditor
                      block={block}
                      index={index}
                      onChange={updateBlock}
                      onDuplicate={duplicateBlock}
                      onTypeChange={changeBlockType}
                      onMoveUp={(i) => moveBlock(i, -1)}
                      onMoveDown={(i) => moveBlock(i, 1)}
                      onRemove={removeBlock}
                      isHighlighted={highlightedBlockIndex === index}
                    />
                  </div>
                ))
              ) : (
                <div className="rounded-card border border-dashed border-[color:var(--border-soft)] px-4 py-6 text-sm leading-6 text-[var(--text-secondary)]">
                  Aucun bloc pour le moment. Utilise les boutons ci-dessus pour commencer.
                </div>
              )}
            </div>
          </section>

          {/* Validation */}
          <section className={panelClass}>
            <div className="grid gap-3">
              <div className="mb-1">
                <h2 className="text-body font-semibold text-[var(--text-primary)]">Validation</h2>
                <p className="mt-1 text-ui text-[var(--text-muted)]">
                  Les erreurs bloquent la copie du snippet. Les avertissements sont optionnels.
                </p>
              </div>

              {validation.errors.length ? (
                <div className="grid gap-2 rounded-card border-l-2 border-l-red-500 border-y border-r border-[color:var(--border-soft)] px-4 py-4">
                  <p className={sectionLabelClass}>Erreurs</p>
                  <ul className="grid gap-1 text-ui text-[var(--text-secondary)]">
                    {validation.errors.map((error) => <li key={error}>{error}</li>)}
                  </ul>
                </div>
              ) : (
                <div className="rounded-card border border-[color:var(--border-soft)] px-4 py-4 text-ui text-[var(--text-muted)]">
                  Aucun blocage détecté.
                </div>
              )}

              {validation.warnings.length ? (
                <div className="grid gap-2 rounded-card border-l-2 border-l-amber-400 border-y border-r border-[color:var(--border-soft)] px-4 py-4">
                  <p className={sectionLabelClass}>Avertissements</p>
                  <ul className="grid gap-1 text-ui text-[var(--text-secondary)]">
                    {validation.warnings.map((warning) => <li key={warning}>{warning}</li>)}
                  </ul>
                </div>
              ) : null}
            </div>
          </section>

          {/* Help */}
          <section className={panelClass}>
            <div className="grid gap-3">
              <div className="mb-1">
                <h2 className="text-body font-semibold text-[var(--text-primary)]">Aide</h2>
              </div>
              <ul className="grid gap-2 text-ui leading-6 text-[var(--text-muted)]">
                <li>Tu peux utiliser `/articles/...` ou coller un chemin disque situé dans `public`, il sera converti automatiquement.</li>
                <li>`heroImage` et `thumbnail` sont souvent identiques dans ce projet.</li>
                <li>Le recadrage fonctionne avec un point focal simple : horizontal + vertical.</li>
                <li>Le snippet JS téléchargé ou copié peut être collé directement dans `data/content.js`.</li>
                <li>La route `/editor` est un outil local de rédaction, sans backend ni CMS.</li>
              </ul>
            </div>
          </section>
        </div>

        {/* Live preview */}
        <section className="min-w-0 grid gap-4 xl:h-full xl:min-h-0 xl:grid-rows-[auto_minmax(0,1fr)] xl:border-l xl:border-[color:var(--border-strong)] xl:pl-6">
          <div className={`${panelClass} xl:shrink-0`}>
            <div className="grid gap-2">
              <p className={sectionLabelClass}>Aperçu live</p>
              <p className="text-ui text-[var(--text-muted)]">
                Le rendu de droite réutilise directement `ArticlePage.jsx`.
              </p>
            </div>
          </div>

          <div className="min-h-0 overflow-x-hidden overflow-y-auto overscroll-contain rounded-card bg-[var(--panel-bg)] p-4 lg:p-6">
            <ArticlePage article={previewArticle} sectionTitle={sectionTitle} embedded onBlockClick={handleBlockClick} />
          </div>
        </section>
      </div>

      {/* Toast notification */}
      {feedback ? (
        <div
          key={feedback.message}
          role="status"
          aria-live="polite"
          className="toast-enter pointer-events-none fixed bottom-6 right-6 z-50 flex max-w-[340px] items-start gap-3 rounded-card border bg-[var(--panel-bg)] px-4 py-3"
          style={{
            borderColor:
              feedback.type === "error"   ? "#ef4444" :
              feedback.type === "warning" ? "#f59e0b" :
              feedback.type === "info"    ? "#6b7280" : "#10b981",
            borderLeftWidth: "3px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
          }}
        >
          <span
            className="mt-[3px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
            style={{
              backgroundColor:
                feedback.type === "error"   ? "#ef4444" :
                feedback.type === "warning" ? "#f59e0b" :
                feedback.type === "info"    ? "#6b7280" : "#10b981",
            }}
            aria-hidden="true"
          >
            {feedback.type === "error" || feedback.type === "warning" ? (
              <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 10 10" fill="none">
                <path d="M3 3l4 4M7 3L3 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 10 10" fill="none">
                <path d="M2 5.5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </span>
          <p className="text-sm leading-6 text-[var(--text-primary)]">{feedback.message}</p>
        </div>
      ) : null}
    </section>
  );
}

export default ArticleEditorPage;
