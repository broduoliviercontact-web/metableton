export const STORAGE_KEY = "metableton-article-editor-draft";

export const PLACEHOLDER_IMAGE =
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

export const DEFAULT_IMAGE_POSITION = "50% 50%";
export const DEFAULT_BLOCK_ALIGN = "left";
export const DEFAULT_IMAGE_ZOOM = 1;
export const DEFAULT_MEDIA_WIDTH = "content";
export const DEFAULT_PRESENTATION_OPTION = "default";

export const BLOCK_TYPE_LABELS = {
  heading:   "Titre",
  paragraph: "Paragraphe",
  list:      "Liste",
  quote:     "Citation",
  callout:   "Note",
  divider:   "Séparateur",
  columns:   "Colonnes",
  image:     "Image",
  gif:       "GIF",
  youtube:   "YouTube",
  link:      "Lien",
  source:    "Source",
};

export const BLOCK_TYPES = [
  "heading",
  "paragraph",
  "list",
  "quote",
  "callout",
  "divider",
  "columns",
  "image",
  "gif",
  "youtube",
  "link",
  "source",
];

export function getDefaultAspectRatio(type) {
  return type === "youtube" ? "16/9" : "16/10";
}

export function parseYouTubeId(input) {
  if (!input) return null;
  const str = input.trim();
  // Already a bare ID (11 chars alphanumeric + - _)
  if (/^[A-Za-z0-9_-]{11}$/.test(str)) return str;
  try {
    const url = new URL(str);
    // youtu.be/ID
    if (url.hostname === "youtu.be") return url.pathname.slice(1).split(/[?&#]/)[0] || null;
    // youtube.com/shorts/ID
    const shortsMatch = url.pathname.match(/\/shorts\/([A-Za-z0-9_-]{11})/);
    if (shortsMatch) return shortsMatch[1];
    // youtube.com/embed/ID
    const embedMatch = url.pathname.match(/\/embed\/([A-Za-z0-9_-]{11})/);
    if (embedMatch) return embedMatch[1];
    // youtube.com/watch?v=ID
    const v = url.searchParams.get("v");
    if (v && /^[A-Za-z0-9_-]{11}$/.test(v)) return v;
  } catch {
    // not a valid URL
  }
  return null;
}

export function clampPercentage(value) {
  return Math.min(100, Math.max(0, Number(value) || 0));
}

export function formatImagePosition(x, y) {
  return `${clampPercentage(x)}% ${clampPercentage(y)}%`;
}

export function parseImagePosition(position = DEFAULT_IMAGE_POSITION) {
  const [rawX = "50", rawY = "50"] = String(position).split(" ");
  return {
    x: clampPercentage(rawX.replace("%", "")),
    y: clampPercentage(rawY.replace("%", "")),
  };
}

export function clampZoom(value) {
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return DEFAULT_IMAGE_ZOOM;
  return Math.min(2, Math.max(1, numericValue));
}

export function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseTags(value) {
  return value.split(",").map((tag) => tag.trim()).filter(Boolean);
}

export function parseExtraSections(value, primarySection = "") {
  return [...new Set(
    value
      .split(",")
      .map((section) => section.trim())
      .filter(Boolean)
      .filter((section) => section !== primarySection),
  )];
}

export function normalizeAssetPath(value = "") {
  const trimmedValue = String(value).trim().replace(/^['"]|['"]$/g, "");

  if (!trimmedValue) return "";
  if (
    trimmedValue.startsWith("/") ||
    /^[a-z]+:/i.test(trimmedValue) ||
    trimmedValue.startsWith("//")
  ) {
    if (trimmedValue.startsWith("/")) {
      const publicDirectoryMarker = "/public/";
      const publicDirectoryIndex = trimmedValue.indexOf(publicDirectoryMarker);

      if (publicDirectoryIndex >= 0) {
        return trimmedValue.slice(publicDirectoryIndex + publicDirectoryMarker.length - 1);
      }
    }

    return trimmedValue;
  }

  if (trimmedValue.startsWith("public/")) {
    return `/${trimmedValue.slice("public/".length)}`;
  }

  return trimmedValue;
}

function genBlockId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function createBlock(type = "paragraph") {
  const _id = genBlockId();
  if (type === "list") return { _id, type, items: [""], align: DEFAULT_BLOCK_ALIGN };
  if (type === "callout") return { _id, type, label: "Note", content: "", align: DEFAULT_BLOCK_ALIGN };
  if (type === "divider") return { _id, type, label: "", style: "line", width: "content", spacing: "section", align: DEFAULT_BLOCK_ALIGN };
  if (type === "columns") {
    return {
      _id,
      type,
      leftType: "text",
      leftContent: "",
      leftImageSrc: "",
      leftImageAlt: "",
      leftImageCaption: "",
      leftImagePosition: DEFAULT_IMAGE_POSITION,
      leftImageZoom: DEFAULT_IMAGE_ZOOM,
      rightType: "text",
      rightContent: "",
      rightImageSrc: "",
      rightImageAlt: "",
      rightImageCaption: "",
      rightImagePosition: DEFAULT_IMAGE_POSITION,
      rightImageZoom: DEFAULT_IMAGE_ZOOM,
      ratio: "equal",
      mediaAspectRatio: "4/3",
      width: "wide",
      spacing: DEFAULT_PRESENTATION_OPTION,
      fontSize: DEFAULT_PRESENTATION_OPTION,
      tone: DEFAULT_PRESENTATION_OPTION,
      align: DEFAULT_BLOCK_ALIGN,
    };
  }
  if (type === "youtube") {
    return { _id, type, url: "", caption: "", width: DEFAULT_MEDIA_WIDTH, aspectRatio: getDefaultAspectRatio(type), align: DEFAULT_BLOCK_ALIGN };
  }
  if (type === "link") {
    return { _id, type, url: "", label: "", description: "", width: DEFAULT_MEDIA_WIDTH, align: DEFAULT_BLOCK_ALIGN };
  }
  if (type === "source") {
    return { _id, type, title: "", url: "", details: "", width: DEFAULT_MEDIA_WIDTH, align: DEFAULT_BLOCK_ALIGN };
  }
  if (type === "image" || type === "gif") {
    return { _id, type, src: "", alt: "", caption: "", position: DEFAULT_IMAGE_POSITION, zoom: DEFAULT_IMAGE_ZOOM, width: DEFAULT_MEDIA_WIDTH, aspectRatio: getDefaultAspectRatio(type), align: DEFAULT_BLOCK_ALIGN };
  }
  return { _id, type, content: "", align: DEFAULT_BLOCK_ALIGN };
}

function applySpacingOption(nextBlock, block) {
  if (block?.spacing && block.spacing !== DEFAULT_PRESENTATION_OPTION) {
    nextBlock.spacing = block.spacing;
  }
}

function applyTextPresentationOptions(nextBlock, block) {
  if (block?.fontSize && block.fontSize !== DEFAULT_PRESENTATION_OPTION) {
    nextBlock.fontSize = block.fontSize;
  }

  if (block?.tone && block.tone !== DEFAULT_PRESENTATION_OPTION) {
    nextBlock.tone = block.tone;
  }

  if (block?.width && block.width !== DEFAULT_PRESENTATION_OPTION) {
    nextBlock.width = block.width;
  }

  applySpacingOption(nextBlock, block);
}

export function extractTextFromBlock(block) {
  if (!block) return "";
  if (typeof block.content === "string" && block.content.trim()) return block.content;
  if (typeof block.leftContent === "string" || typeof block.rightContent === "string") {
    const leftPreview = block.leftType === "image"
      ? block.leftImageCaption || block.leftImageSrc
      : block.leftContent;
    const rightPreview = block.rightType === "image"
      ? block.rightImageCaption || block.rightImageSrc
      : block.rightContent;
    return [leftPreview, rightPreview].filter(Boolean).join(" / ");
  }
  if (Array.isArray(block.items) && block.items.length) return block.items.join("\n");
  return block.caption || block.description || block.details || block.label || block.title || "";
}

export function convertBlockType(block, nextType) {
  const nextBlock = createBlock(nextType);
  const align = block?.align || DEFAULT_BLOCK_ALIGN;
  const textContent = extractTextFromBlock(block);
  nextBlock.align = align;

  if (nextType === "heading" || nextType === "paragraph" || nextType === "quote") {
    nextBlock.content = textContent;
    applyTextPresentationOptions(nextBlock, block);
    return nextBlock;
  }
  if (nextType === "list") {
    nextBlock.items = Array.isArray(block?.items) ? block.items : textContent ? textContent.split("\n") : [""];
    applyTextPresentationOptions(nextBlock, block);
    return nextBlock;
  }
  if (nextType === "callout") {
    nextBlock.label = block?.label || block?.title || "Note";
    nextBlock.content = textContent;
    if (block?.background && block.background !== DEFAULT_PRESENTATION_OPTION) {
      nextBlock.background = block.background;
    }
    applyTextPresentationOptions(nextBlock, block);
    return nextBlock;
  }
  if (nextType === "divider") {
    nextBlock.label = block?.label || "";
    nextBlock.style = block?.style || "line";
    nextBlock.width = block?.width || "content";
    applySpacingOption(nextBlock, block);
    return nextBlock;
  }
  if (nextType === "columns") {
    if (block?.src) {
      nextBlock.leftType = "image";
      nextBlock.leftImageSrc = block.src;
      nextBlock.leftImageAlt = block.alt || "";
      nextBlock.leftImageCaption = block.caption || "";
      nextBlock.leftImagePosition = block.position || DEFAULT_IMAGE_POSITION;
      nextBlock.leftImageZoom = typeof block?.zoom !== "undefined" ? clampZoom(block.zoom) : DEFAULT_IMAGE_ZOOM;
      nextBlock.mediaAspectRatio = block?.aspectRatio || "4/3";
    } else {
      nextBlock.leftType = block?.leftType || "text";
      nextBlock.leftContent = block?.leftContent || block?.content || "";
      nextBlock.leftImageSrc = block?.leftImageSrc || "";
      nextBlock.leftImageAlt = block?.leftImageAlt || "";
      nextBlock.leftImageCaption = block?.leftImageCaption || "";
      nextBlock.leftImagePosition = block?.leftImagePosition || DEFAULT_IMAGE_POSITION;
      nextBlock.leftImageZoom = typeof block?.leftImageZoom !== "undefined" ? clampZoom(block.leftImageZoom) : DEFAULT_IMAGE_ZOOM;
      nextBlock.mediaAspectRatio = block?.mediaAspectRatio || "4/3";
    }
    nextBlock.rightType = block?.rightType || "text";
    nextBlock.rightContent = block?.rightContent || "";
    nextBlock.rightImageSrc = block?.rightImageSrc || "";
    nextBlock.rightImageAlt = block?.rightImageAlt || "";
    nextBlock.rightImageCaption = block?.rightImageCaption || "";
    nextBlock.rightImagePosition = block?.rightImagePosition || DEFAULT_IMAGE_POSITION;
    nextBlock.rightImageZoom = typeof block?.rightImageZoom !== "undefined" ? clampZoom(block.rightImageZoom) : DEFAULT_IMAGE_ZOOM;
    nextBlock.ratio = block?.ratio || "equal";
    applyTextPresentationOptions(nextBlock, block);
    return nextBlock;
  }
  if (nextType === "image" || nextType === "gif") {
    nextBlock.src = block?.src || "";
    nextBlock.alt = block?.alt || block?.label || block?.title || "";
    nextBlock.caption = block?.caption || block?.description || block?.details || "";
    nextBlock.position = block?.position || DEFAULT_IMAGE_POSITION;
    nextBlock.zoom = typeof block?.zoom !== "undefined" ? clampZoom(block.zoom) : DEFAULT_IMAGE_ZOOM;
    nextBlock.width = block?.width || DEFAULT_MEDIA_WIDTH;
    nextBlock.aspectRatio = block?.aspectRatio || getDefaultAspectRatio(nextType);
    applySpacingOption(nextBlock, block);
    return nextBlock;
  }
  if (nextType === "youtube") {
    nextBlock.url = block?.url || "";
    nextBlock.caption = block?.caption || block?.description || block?.details || "";
    nextBlock.width = block?.width || DEFAULT_MEDIA_WIDTH;
    nextBlock.aspectRatio = block?.aspectRatio || getDefaultAspectRatio(nextType);
    applySpacingOption(nextBlock, block);
    return nextBlock;
  }
  if (nextType === "link") {
    nextBlock.url = block?.url || "";
    nextBlock.label = block?.label || block?.title || textContent;
    nextBlock.description = block?.description || block?.details || block?.caption || "";
    nextBlock.width = block?.width || DEFAULT_MEDIA_WIDTH;
    applySpacingOption(nextBlock, block);
    return nextBlock;
  }
  if (nextType === "source") {
    nextBlock.title = block?.title || block?.label || textContent;
    nextBlock.url = block?.url || "";
    nextBlock.details = block?.details || block?.description || block?.caption || "";
    nextBlock.width = block?.width || DEFAULT_MEDIA_WIDTH;
    applySpacingOption(nextBlock, block);
    return nextBlock;
  }
  return nextBlock;
}

export function createTemplateArticle() {
  const firstBlock = createBlock("paragraph");
  firstBlock.content = "Commence ici avec un premier paragraphe clair et concis.";

  return {
    id: "guide-nouvel-article",
    slug: "nouvel-article-ableton-live",
    section: "guides-ableton-live",
    extraSections: [],
    type: "Guide",
    label: "Guide",
    featured: false,
    title: "Nouveau guide Ableton Live",
    summary: "Un résumé court et clair pour présenter rapidement le contenu de l'article.",
    heroImage: "/articles/guides-ableton/ableton-live-overview.jpg",
    heroImagePosition: DEFAULT_IMAGE_POSITION,
    thumbnail: "/articles/guides-ableton/ableton-live-overview.jpg",
    thumbnailPosition: DEFAULT_IMAGE_POSITION,
    imageAlt: "Visuel d'article pour Ableton Live",
    tags: ["ableton", "workflow"],
    content: [firstBlock],
  };
}

export function ensureBlockIds(blocks = []) {
  return blocks.map((block) =>
    block._id ? block : { ...block, _id: genBlockId() }
  );
}

export function createEmptyArticle() {
  return {
    id: "", slug: "", section: "", extraSections: [], type: "Guide", label: "", featured: false,
    title: "", summary: "", heroImage: "", heroImagePosition: DEFAULT_IMAGE_POSITION,
    thumbnail: "", thumbnailPosition: DEFAULT_IMAGE_POSITION, imageAlt: "", tags: [], content: [],
  };
}

export function normalizeEditorArticle(article = {}) {
  const template = createEmptyArticle();
  return {
    ...template,
    ...article,
    extraSections: Array.isArray(article.extraSections) ? article.extraSections : [],
    tags: Array.isArray(article.tags) ? article.tags : [],
    content: ensureBlockIds(Array.isArray(article.content) ? article.content : []),
    heroImagePosition: article.heroImagePosition || DEFAULT_IMAGE_POSITION,
    thumbnailPosition: article.thumbnailPosition || DEFAULT_IMAGE_POSITION,
  };
}

export function loadInitialEditorState() {
  const template = createTemplateArticle();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { draftArticle: template, tagsInput: template.tags.join(", "), slugTouched: false, idTouched: false };
    }
    const parsed = JSON.parse(raw);
    const draftArticle = parsed?.draftArticle
      ? normalizeEditorArticle({ ...template, ...parsed.draftArticle })
      : template;
    return {
      draftArticle: {
        ...draftArticle,
        content: Array.isArray(draftArticle.content) ? draftArticle.content : template.content,
        tags: Array.isArray(draftArticle.tags) ? draftArticle.tags : template.tags,
      },
      tagsInput: typeof parsed?.tagsInput === "string" ? parsed.tagsInput : (draftArticle.tags || []).join(", "),
      slugTouched: Boolean(parsed?.slugTouched),
      idTouched: Boolean(parsed?.idTouched),
    };
  } catch {
    return { draftArticle: template, tagsInput: template.tags.join(", "), slugTouched: false, idTouched: false };
  }
}

export function sanitizeContent(content = []) {
  return content.reduce((accumulator, block) => {
    if (block.type === "list") {
      const items = (block.items || []).map((item) => item.trim()).filter(Boolean);
      if (items.length) {
        const nextBlock = { type: "list", items };
        if (block.align && block.align !== DEFAULT_BLOCK_ALIGN) nextBlock.align = block.align;
        if (block.fontSize?.trim() && block.fontSize !== DEFAULT_PRESENTATION_OPTION) nextBlock.fontSize = block.fontSize.trim();
        if (block.tone?.trim() && block.tone !== DEFAULT_PRESENTATION_OPTION) nextBlock.tone = block.tone.trim();
        if (block.width?.trim() && block.width !== DEFAULT_PRESENTATION_OPTION) nextBlock.width = block.width.trim();
        if (block.spacing?.trim() && block.spacing !== DEFAULT_PRESENTATION_OPTION) nextBlock.spacing = block.spacing.trim();
        accumulator.push(nextBlock);
      }
      return accumulator;
    }
    if (block.type === "callout") {
      const nextBlock = { type: "callout", content: (block.content || "").trim() };
      if (block.label?.trim()) nextBlock.label = block.label.trim();
      if (block.align && block.align !== DEFAULT_BLOCK_ALIGN) nextBlock.align = block.align;
      if (block.fontSize?.trim() && block.fontSize !== DEFAULT_PRESENTATION_OPTION) nextBlock.fontSize = block.fontSize.trim();
      if (block.tone?.trim() && block.tone !== DEFAULT_PRESENTATION_OPTION) nextBlock.tone = block.tone.trim();
      if (block.background?.trim() && block.background !== DEFAULT_PRESENTATION_OPTION) nextBlock.background = block.background.trim();
      if (block.width?.trim() && block.width !== DEFAULT_PRESENTATION_OPTION) nextBlock.width = block.width.trim();
      if (block.spacing?.trim() && block.spacing !== DEFAULT_PRESENTATION_OPTION) nextBlock.spacing = block.spacing.trim();
      if (nextBlock.content || nextBlock.label) accumulator.push(nextBlock);
      return accumulator;
    }
    if (block.type === "divider") {
      const nextBlock = { type: "divider" };
      if (block.label?.trim()) nextBlock.label = block.label.trim();
      if (block.style?.trim() && block.style !== "line") nextBlock.style = block.style.trim();
      if (block.width?.trim() && block.width !== DEFAULT_PRESENTATION_OPTION) nextBlock.width = block.width.trim();
      if (block.spacing?.trim() && block.spacing !== DEFAULT_PRESENTATION_OPTION) nextBlock.spacing = block.spacing.trim();
      accumulator.push(nextBlock);
      return accumulator;
    }
    if (block.type === "columns") {
      const leftType = block.leftType === "image" ? "image" : "text";
      const rightType = block.rightType === "image" ? "image" : "text";
      const leftContent = (block.leftContent || "").trim();
      const rightContent = (block.rightContent || "").trim();
      const leftImageSrc = normalizeAssetPath(block.leftImageSrc);
      const rightImageSrc = normalizeAssetPath(block.rightImageSrc);

      if (leftContent || rightContent || leftImageSrc || rightImageSrc) {
        const nextBlock = { type: "columns", leftType, rightType };
        if (block.ratio?.trim() && block.ratio !== "equal") nextBlock.ratio = block.ratio.trim();
        if (block.mediaAspectRatio?.trim() && block.mediaAspectRatio !== "4/3") nextBlock.mediaAspectRatio = block.mediaAspectRatio.trim();
        if (block.align && block.align !== DEFAULT_BLOCK_ALIGN) nextBlock.align = block.align;
        if (block.fontSize?.trim() && block.fontSize !== DEFAULT_PRESENTATION_OPTION) nextBlock.fontSize = block.fontSize.trim();
        if (block.tone?.trim() && block.tone !== DEFAULT_PRESENTATION_OPTION) nextBlock.tone = block.tone.trim();
        if (block.width?.trim() && block.width !== DEFAULT_PRESENTATION_OPTION) nextBlock.width = block.width.trim();
        if (block.spacing?.trim() && block.spacing !== DEFAULT_PRESENTATION_OPTION) nextBlock.spacing = block.spacing.trim();
        if (leftType === "text") {
          nextBlock.leftContent = leftContent;
        } else {
          nextBlock.leftImageSrc = leftImageSrc;
          if ((block.leftImageAlt || "").trim()) nextBlock.leftImageAlt = block.leftImageAlt.trim();
          if ((block.leftImageCaption || "").trim()) nextBlock.leftImageCaption = block.leftImageCaption.trim();
          if ((block.leftImagePosition || "").trim() && block.leftImagePosition !== DEFAULT_IMAGE_POSITION) nextBlock.leftImagePosition = block.leftImagePosition.trim();
          if (typeof block.leftImageZoom !== "undefined" && clampZoom(block.leftImageZoom) !== DEFAULT_IMAGE_ZOOM) nextBlock.leftImageZoom = clampZoom(block.leftImageZoom);
        }
        if (rightType === "text") {
          nextBlock.rightContent = rightContent;
        } else {
          nextBlock.rightImageSrc = rightImageSrc;
          if ((block.rightImageAlt || "").trim()) nextBlock.rightImageAlt = block.rightImageAlt.trim();
          if ((block.rightImageCaption || "").trim()) nextBlock.rightImageCaption = block.rightImageCaption.trim();
          if ((block.rightImagePosition || "").trim() && block.rightImagePosition !== DEFAULT_IMAGE_POSITION) nextBlock.rightImagePosition = block.rightImagePosition.trim();
          if (typeof block.rightImageZoom !== "undefined" && clampZoom(block.rightImageZoom) !== DEFAULT_IMAGE_ZOOM) nextBlock.rightImageZoom = clampZoom(block.rightImageZoom);
        }
        accumulator.push(nextBlock);
      }
      return accumulator;
    }
    if (block.type === "image" || block.type === "gif") {
      const nextBlock = { type: block.type, src: normalizeAssetPath(block.src), alt: (block.alt || "").trim() };
      if (block.caption?.trim()) nextBlock.caption = block.caption.trim();
      if (block.position?.trim()) nextBlock.position = block.position.trim();
      if (typeof block.zoom !== "undefined" && clampZoom(block.zoom) !== DEFAULT_IMAGE_ZOOM) nextBlock.zoom = clampZoom(block.zoom);
      if (block.width?.trim() && block.width !== DEFAULT_MEDIA_WIDTH) nextBlock.width = block.width.trim();
      if (block.aspectRatio?.trim() && block.aspectRatio !== getDefaultAspectRatio(block.type)) nextBlock.aspectRatio = block.aspectRatio.trim();
      if (block.align && block.align !== DEFAULT_BLOCK_ALIGN) nextBlock.align = block.align;
      if (block.spacing?.trim() && block.spacing !== DEFAULT_PRESENTATION_OPTION) nextBlock.spacing = block.spacing.trim();
      if (nextBlock.src || nextBlock.alt || nextBlock.caption) accumulator.push(nextBlock);
      return accumulator;
    }
    if (block.type === "youtube") {
      const nextBlock = { type: "youtube", url: (block.url || "").trim() };
      if (block.caption?.trim()) nextBlock.caption = block.caption.trim();
      if (block.width?.trim() && block.width !== DEFAULT_MEDIA_WIDTH) nextBlock.width = block.width.trim();
      if (block.aspectRatio?.trim() && block.aspectRatio !== getDefaultAspectRatio(block.type)) nextBlock.aspectRatio = block.aspectRatio.trim();
      if (block.align && block.align !== DEFAULT_BLOCK_ALIGN) nextBlock.align = block.align;
      if (block.spacing?.trim() && block.spacing !== DEFAULT_PRESENTATION_OPTION) nextBlock.spacing = block.spacing.trim();
      if (nextBlock.url || nextBlock.caption) accumulator.push(nextBlock);
      return accumulator;
    }
    if (block.type === "link") {
      const nextBlock = { type: "link", url: (block.url || "").trim() };
      if (block.label?.trim()) nextBlock.label = block.label.trim();
      if (block.description?.trim()) nextBlock.description = block.description.trim();
      if (block.width?.trim() && block.width !== DEFAULT_MEDIA_WIDTH) nextBlock.width = block.width.trim();
      if (block.align && block.align !== DEFAULT_BLOCK_ALIGN) nextBlock.align = block.align;
      if (block.spacing?.trim() && block.spacing !== DEFAULT_PRESENTATION_OPTION) nextBlock.spacing = block.spacing.trim();
      if (nextBlock.url || nextBlock.label || nextBlock.description) accumulator.push(nextBlock);
      return accumulator;
    }
    if (block.type === "source") {
      const nextBlock = { type: "source" };
      if (block.title?.trim()) nextBlock.title = block.title.trim();
      if (block.url?.trim()) nextBlock.url = block.url.trim();
      if (block.details?.trim()) nextBlock.details = block.details.trim();
      if (block.width?.trim() && block.width !== DEFAULT_MEDIA_WIDTH) nextBlock.width = block.width.trim();
      if (block.align && block.align !== DEFAULT_BLOCK_ALIGN) nextBlock.align = block.align;
      if (block.spacing?.trim() && block.spacing !== DEFAULT_PRESENTATION_OPTION) nextBlock.spacing = block.spacing.trim();
      if (nextBlock.title || nextBlock.url || nextBlock.details) accumulator.push(nextBlock);
      return accumulator;
    }
    const contentValue = (block.content || "").trim();
    if (contentValue) {
      const nextBlock = { type: block.type, content: contentValue };
      if (block.align && block.align !== DEFAULT_BLOCK_ALIGN) nextBlock.align = block.align;
      if (block.fontSize?.trim() && block.fontSize !== DEFAULT_PRESENTATION_OPTION) nextBlock.fontSize = block.fontSize.trim();
      if (block.tone?.trim() && block.tone !== DEFAULT_PRESENTATION_OPTION) nextBlock.tone = block.tone.trim();
      if (block.width?.trim() && block.width !== DEFAULT_PRESENTATION_OPTION) nextBlock.width = block.width.trim();
      if (block.spacing?.trim() && block.spacing !== DEFAULT_PRESENTATION_OPTION) nextBlock.spacing = block.spacing.trim();
      accumulator.push(nextBlock);
    }
    return accumulator;
  }, []);
}

export function buildArticleObject(draftArticle, tagsInput) {
  const article = {
    id: draftArticle.id.trim(),
    slug: draftArticle.slug.trim(),
    section: draftArticle.section,
    type: draftArticle.type.trim(),
    label: draftArticle.label.trim(),
    title: draftArticle.title.trim(),
    summary: draftArticle.summary.trim(),
    heroImage: normalizeAssetPath(draftArticle.heroImage),
    heroImagePosition: draftArticle.heroImagePosition || DEFAULT_IMAGE_POSITION,
    thumbnail: normalizeAssetPath(draftArticle.thumbnail),
    thumbnailPosition: draftArticle.thumbnailPosition || DEFAULT_IMAGE_POSITION,
    imageAlt: draftArticle.imageAlt.trim(),
    tags: parseTags(tagsInput),
    content: sanitizeContent(draftArticle.content),
  };
  const extraSections = parseExtraSections(
    Array.isArray(draftArticle.extraSections) ? draftArticle.extraSections.join(", ") : "",
    article.section,
  );
  if (extraSections.length) article.extraSections = extraSections;
  if (draftArticle.featured) article.featured = true;
  return article;
}

export function getValidation(article) {
  const errors = [];
  const warnings = [];
  if (!article.title) errors.push("Le titre est requis.");
  if (!article.slug) errors.push("Le slug est requis.");
  if (!article.section) errors.push("La section est requise.");
  if (!article.content.length) errors.push("Ajoute au moins un bloc de contenu.");
  if (!article.heroImage) warnings.push("heroImage est recommandé pour le rendu article.");
  if (!article.thumbnail) warnings.push("thumbnail est recommandé pour les listings.");
  if (!article.imageAlt) warnings.push("imageAlt est recommandé pour l'accessibilité.");
  return { errors, warnings };
}

export function downloadTextFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
