import EditorialTag from "./EditorialTag";

function renderInlineLinks(text) {
  if (!text) {
    return "";
  }

  const pattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    const [fullMatch, label, href] = match;
    const startIndex = match.index;

    if (startIndex > lastIndex) {
      parts.push(text.slice(lastIndex, startIndex));
    }

    const isExternal = /^https?:\/\//i.test(href);

    parts.push(
      <a
        key={`${href}-${startIndex}`}
        className="font-medium underline decoration-current decoration-[1.5px] underline-offset-[3px] transition-opacity hover:opacity-72"
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noreferrer" : undefined}
      >
        {label}
      </a>,
    );

    lastIndex = startIndex + fullMatch.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length ? parts : text;
}

function getObjectPosition(position) {
  return position || "50% 50%";
}

function getImageZoom(zoom) {
  const numericZoom = Number(zoom);

  if (Number.isNaN(numericZoom)) {
    return 1;
  }

  return Math.min(2, Math.max(1, numericZoom));
}

function getBlockAlign(align) {
  return align || "left";
}

function getTextAlignClass(align) {
  const resolvedAlign = getBlockAlign(align);

  if (resolvedAlign === "center") {
    return "text-center";
  }

  if (resolvedAlign === "right") {
    return "text-right";
  }

  return "text-left";
}

function getSelfAlignClass(align) {
  const resolvedAlign = getBlockAlign(align);

  if (resolvedAlign === "center") {
    return "justify-self-center";
  }

  if (resolvedAlign === "right") {
    return "justify-self-end";
  }

  return "justify-self-start";
}

function getFlexAlignClass(align) {
  const resolvedAlign = getBlockAlign(align);

  if (resolvedAlign === "center") {
    return "justify-center";
  }

  if (resolvedAlign === "right") {
    return "justify-end";
  }

  return "justify-start";
}

function getMediaWidthClass(width) {
  if (width === "full") {
    return "max-w-none";
  }

  if (width === "wide") {
    return "max-w-[760px]";
  }

  return "max-w-[640px]";
}

function getTextWidthClass(width) {
  if (width === "full") {
    return "max-w-none";
  }

  if (width === "wide") {
    return "max-w-[860px]";
  }

  if (width === "content") {
    return "max-w-[640px]";
  }

  return "max-w-[740px]";
}

function getHeadingSizeClass(fontSize) {
  if (fontSize === "sm") {
    return "text-[2rem] sm:text-[2.6rem]";
  }

  if (fontSize === "lg") {
    return "text-[2.6rem] sm:text-[3.4rem]";
  }

  if (fontSize === "xl") {
    return "text-[3rem] sm:text-[4rem]";
  }

  return "text-title-sm sm:text-title";
}

function getBodyTextSizeClass(fontSize) {
  if (fontSize === "sm") {
    return "text-[0.96rem] sm:text-[0.98rem]";
  }

  if (fontSize === "lg") {
    return "text-[1.08rem] sm:text-[1.16rem]";
  }

  return "text-body sm:text-base";
}

function getQuoteSizeClass(fontSize) {
  if (fontSize === "sm") {
    return "text-[1.2rem] sm:text-[1.45rem]";
  }

  if (fontSize === "lg") {
    return "text-[1.7rem] sm:text-[2.1rem]";
  }

  return "text-quote sm:text-quote-lg";
}

function getTextToneClass(type, tone) {
  if (tone === "muted") {
    return "text-[var(--text-muted)]";
  }

  if (tone === "strong") {
    return "text-[var(--text-primary)]";
  }

  if (tone === "accent") {
    return "text-[var(--text-accent)]";
  }

  if (type === "heading") {
    return "text-[var(--text-primary)]";
  }

  return "text-[var(--text-secondary)]";
}

function getCalloutBackgroundClass(background) {
  if (background === "subtle") {
    return "bg-[var(--panel-muted)]";
  }

  if (background === "warm") {
    return "bg-[var(--panel-warm)]";
  }

  if (background === "accent") {
    return "bg-[var(--panel-accent)]";
  }

  if (background === "contrast") {
    return "bg-[var(--panel-contrast)] border-transparent";
  }

  return "bg-[var(--panel-bg)]";
}

function getCalloutLabelToneClass(background) {
  return background === "contrast" ? "text-white/68" : "text-[var(--text-muted)]";
}

function getCalloutTextToneClass(background, tone) {
  if (background === "contrast" && (!tone || tone === "default")) {
    return "text-white";
  }

  return getTextToneClass("callout", tone);
}

function getDividerLineClass(style) {
  if (style === "fade") {
    return "bg-gradient-to-r from-transparent via-[var(--border-strong)] to-transparent";
  }

  if (style === "accent") {
    return "bg-[var(--text-accent)]";
  }

  return "bg-[color:var(--border-soft)]";
}

function getColumnsGridClass(ratio) {
  if (ratio === "left") {
    return "lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.9fr)]";
  }

  if (ratio === "right") {
    return "lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.35fr)]";
  }

  return "lg:grid-cols-2";
}

function getBlockSpacingClass(type, spacing) {
  const defaultSpacing =
    type === "heading" ? "pt-4" :
    type === "divider" ? "py-5" :
    type === "columns" ? "py-3" :
    type === "image" || type === "gif" || type === "youtube" || type === "link" || type === "source" ? "py-2" :
    "";

  if (spacing === "compact") {
    return type === "image" || type === "gif" || type === "youtube" || type === "link" || type === "source"
      ? "py-1"
      : type === "divider" || type === "columns"
        ? "py-2"
      : "pt-1";
  }

  if (spacing === "relaxed") {
    return type === "image" || type === "gif" || type === "youtube" || type === "link" || type === "source"
      ? "py-4"
      : type === "divider" || type === "columns"
        ? "py-6"
      : "pt-5";
  }

  if (spacing === "section") {
    return type === "image" || type === "gif" || type === "youtube" || type === "link" || type === "source"
      ? "py-8"
      : type === "divider" || type === "columns"
        ? "py-10"
      : "pt-10";
  }

  return defaultSpacing;
}

function getAspectRatioClass(aspectRatio, fallback = "16/10") {
  const resolvedRatio = aspectRatio || fallback;

  if (resolvedRatio === "16/9") {
    return "aspect-video";
  }

  if (resolvedRatio === "4/3") {
    return "aspect-[4/3]";
  }

  if (resolvedRatio === "1/1") {
    return "aspect-square";
  }

  if (resolvedRatio === "3/4") {
    return "aspect-[3/4]";
  }

  return "aspect-[16/10]";
}

function getYouTubeEmbedUrl(url) {
  if (!url) {
    return "";
  }

  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname.includes("youtu.be")) {
      const id = parsedUrl.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }

    if (parsedUrl.hostname.includes("youtube.com")) {
      if (parsedUrl.pathname === "/watch") {
        const id = parsedUrl.searchParams.get("v");
        return id ? `https://www.youtube.com/embed/${id}` : "";
      }

      if (parsedUrl.pathname.startsWith("/shorts/")) {
        const id = parsedUrl.pathname.split("/shorts/")[1];
        return id ? `https://www.youtube.com/embed/${id}` : "";
      }

      if (parsedUrl.pathname.startsWith("/embed/")) {
        return url;
      }
    }
  } catch {
    return "";
  }

  return "";
}

function renderTextParagraphs(text, className) {
  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph, index) => (
      <p key={`${paragraph.slice(0, 24)}-${index}`} className={className}>
        {renderInlineLinks(paragraph)}
      </p>
    ));
}

function renderColumnPane(block, side, textClass) {
  const prefix = side === "left" ? "left" : "right";
  const type = block[`${prefix}Type`] || "text";

  if (type === "image") {
    const src = block[`${prefix}ImageSrc`] || "";
    const alt = block[`${prefix}ImageAlt`] || "";
    const caption = block[`${prefix}ImageCaption`] || "";
    const objectPosition = getObjectPosition(block[`${prefix}ImagePosition`]);
    const imageZoom = getImageZoom(block[`${prefix}ImageZoom`]);
    const aspectRatioClass = getAspectRatioClass(block.mediaAspectRatio, "4/3");

    if (!src) {
      return (
        <div className="flex min-h-[220px] items-center justify-center rounded-card border border-dashed border-[color:var(--border-soft)] bg-[color:var(--panel-bg)] px-4 text-ui text-[var(--text-muted)]">
          Image manquante
        </div>
      );
    }

    return (
      <figure className="grid gap-3">
        <div className="overflow-hidden rounded-card border border-[color:var(--border-soft)] bg-[var(--panel-bg)]">
          <div className={`relative w-full ${aspectRatioClass}`}>
            <img
              className="absolute inset-0 h-full w-full object-cover"
              src={src}
              alt={alt}
              style={{
                objectPosition,
                transform: `scale(${imageZoom})`,
                transformOrigin: objectPosition,
              }}
              loading="lazy"
            />
          </div>
        </div>
        {caption ? (
          <figcaption className="text-ui leading-6 text-[var(--text-muted)]">{caption}</figcaption>
        ) : null}
      </figure>
    );
  }

  return renderTextParagraphs(block[`${prefix}Content`] || "", textClass);
}

function ArticleBlock({ block }) {
  const textAlignClass = getTextAlignClass(block.align);
  const selfAlignClass = getSelfAlignClass(block.align);
  const flexAlignClass = getFlexAlignClass(block.align);

  if (block.type === "heading") {
    return (
      <div className={`${selfAlignClass} w-full ${getBlockSpacingClass(block.type, block.spacing)}`}>
        <div className={getTextWidthClass(block.width)}>
        <h2
          className={`font-[var(--font-display)] leading-[1.05] tracking-display-xs ${getHeadingSizeClass(block.fontSize)} ${getTextToneClass(block.type, block.tone)} ${textAlignClass}`}
        >
          {block.content}
        </h2>
        </div>
      </div>
    );
  }

  if (block.type === "paragraph") {
    return (
      <div className={`${selfAlignClass} w-full ${getBlockSpacingClass(block.type, block.spacing)}`}>
        <div className={getTextWidthClass(block.width)}>
          <p className={`leading-7 ${getBodyTextSizeClass(block.fontSize)} ${getTextToneClass(block.type, block.tone)} ${textAlignClass}`}>
            {renderInlineLinks(block.content)}
          </p>
        </div>
      </div>
    );
  }

  if (block.type === "list") {
    return (
      <div className={`${selfAlignClass} w-full ${getBlockSpacingClass(block.type, block.spacing)}`}>
        <div className={getTextWidthClass(block.width)}>
          <ul
            className={`grid gap-2 pl-5 leading-7 ${getBodyTextSizeClass(block.fontSize)} ${getTextToneClass(block.type, block.tone)} ${textAlignClass}`}
          >
            {block.items.map((item) => (
              <li key={item}>{renderInlineLinks(item)}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  if (block.type === "quote") {
    const quoteAlign = getBlockAlign(block.align);
    const quoteSideClass =
      quoteAlign === "right"
        ? "border-r pr-4 text-right"
        : "border-l pl-4";

    return (
      <div className={`${selfAlignClass} w-full ${getBlockSpacingClass(block.type, block.spacing)}`}>
        <blockquote
          className={`${quoteSideClass} ${getTextWidthClass(block.width)} border-[color:var(--border-strong)] font-[var(--font-display)] leading-8 tracking-display-2xs ${getQuoteSizeClass(block.fontSize)} ${getTextToneClass(block.type, block.tone)}`}
        >
          <p className={textAlignClass}>{renderInlineLinks(block.content)}</p>
        </blockquote>
      </div>
    );
  }

  if (block.type === "callout") {
    return (
      <div className={`${selfAlignClass} w-full ${getBlockSpacingClass(block.type, block.spacing)}`}>
        <aside
          className={`${getTextWidthClass(block.width)} rounded-card border border-[color:var(--border-soft)] ${getCalloutBackgroundClass(block.background)} px-4 py-4 ${textAlignClass}`}
          aria-label={block.label || "Note"}
        >
          {block.label ? (
            <p className={`mb-2 text-2xs font-medium uppercase tracking-caps ${getCalloutLabelToneClass(block.background)}`}>
              {block.label}
            </p>
          ) : null}
          <p className={`leading-[1.8] ${getBodyTextSizeClass(block.fontSize)} ${getCalloutTextToneClass(block.background, block.tone)}`}>
            {renderInlineLinks(block.content)}
          </p>
        </aside>
      </div>
    );
  }

  if (block.type === "divider") {
    return (
      <div className={`flex w-full ${flexAlignClass} ${getBlockSpacingClass(block.type, block.spacing)}`}>
        <div className={`grid w-full ${getTextWidthClass(block.width)} gap-3`}>
          <div className="relative flex items-center justify-center">
            <span className={`block h-px w-full ${getDividerLineClass(block.style)}`} aria-hidden="true" />
            {block.label ? (
              <span className="absolute rounded-full bg-[var(--panel-bg)] px-3 text-label uppercase tracking-caps-wide text-[var(--text-muted)]">
                {block.label}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  if (block.type === "columns") {
    const textClass = `leading-7 ${getBodyTextSizeClass(block.fontSize)} ${getTextToneClass(block.type, block.tone)}`;

    return (
      <div className={`${selfAlignClass} w-full ${getBlockSpacingClass(block.type, block.spacing)}`}>
        <div className={`${getTextWidthClass(block.width)} grid gap-6 ${getColumnsGridClass(block.ratio)}`}>
          <div className="grid gap-4 rounded-card border border-[color:var(--border-soft)] bg-[color:var(--panel-muted)] p-4">
            {renderColumnPane(block, "left", textClass)}
          </div>
          <div className="grid gap-4 rounded-card border border-[color:var(--border-soft)] bg-[color:var(--panel-muted)] p-4">
            {renderColumnPane(block, "right", textClass)}
          </div>
        </div>
      </div>
    );
  }

  if (block.type === "image" || block.type === "gif") {
    const objectPosition = getObjectPosition(block.position);
    const imageZoom = getImageZoom(block.zoom);
    const mediaWidthClass = getMediaWidthClass(block.width);
    const aspectRatioClass = getAspectRatioClass(block.aspectRatio, "16/10");

    return (
      <div className={`flex w-full ${flexAlignClass} ${getBlockSpacingClass(block.type, block.spacing)}`}>
        <figure className={`grid w-full ${mediaWidthClass} gap-3 py-2 ${textAlignClass}`}>
          <div className="overflow-hidden rounded-card border border-[color:var(--border-soft)] bg-[var(--panel-bg)]">
            <div className={`relative w-full ${aspectRatioClass}`}>
              <img
                className="absolute inset-0 h-full w-full object-cover"
                src={block.src}
                alt={block.alt}
                style={{
                  objectPosition,
                  transform: `scale(${imageZoom})`,
                  transformOrigin: objectPosition,
                }}
                loading="lazy"
              />
            </div>
          </div>
          {block.caption ? (
            <figcaption className="text-ui leading-6 text-[var(--text-muted)]">{block.caption}</figcaption>
          ) : null}
        </figure>
      </div>
    );
  }

  if (block.type === "youtube") {
    const embedUrl = getYouTubeEmbedUrl(block.url);
    const mediaWidthClass = getMediaWidthClass(block.width);
    const aspectRatioClass = getAspectRatioClass(block.aspectRatio, "16/9");

    return (
      <div className={`flex w-full ${flexAlignClass} ${getBlockSpacingClass(block.type, block.spacing)}`}>
        <figure className={`grid w-full ${mediaWidthClass} gap-3 py-2 ${textAlignClass}`}>
          {embedUrl ? (
            <div className="overflow-hidden rounded-card border border-[color:var(--border-soft)] bg-[var(--panel-bg)]">
              <div className={`w-full ${aspectRatioClass}`}>
                <iframe
                  className="h-full w-full"
                  src={embedUrl}
                  title={block.caption || "Vidéo YouTube"}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          ) : (
            <a
              className="inline-flex w-fit rounded-card border border-[color:var(--border-soft)] px-4 py-3 text-body text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              href={block.url}
              target="_blank"
              rel="noreferrer"
            >
              Ouvrir la vidéo YouTube
            </a>
          )}
          {block.caption ? (
            <figcaption className="text-ui leading-6 text-[var(--text-muted)]">{block.caption}</figcaption>
          ) : null}
        </figure>
      </div>
    );
  }

  if (block.type === "link") {
    const href = block.url || "#";
    const isExternal = /^https?:\/\//i.test(href);
    const mediaWidthClass = getMediaWidthClass(block.width);

    return (
      <div className={`flex w-full ${flexAlignClass} ${getBlockSpacingClass(block.type, block.spacing)}`}>
        <div className={`grid w-full ${mediaWidthClass} gap-3 py-2 ${textAlignClass}`}>
          <a
            className="grid gap-2 rounded-card border border-[color:var(--border-soft)] bg-[var(--panel-bg)] px-4 py-4 transition-colors hover:border-[color:var(--border-strong)]"
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noreferrer" : undefined}
          >
            <span className="text-body font-medium leading-6 text-[var(--text-primary)]">
              {block.label || block.url || "Lien"}
            </span>
            {block.description ? (
              <span className="text-[14px] leading-6 text-[var(--text-secondary)]">
                {block.description}
              </span>
            ) : null}
            {block.url ? (
              <span className="text-[12px] leading-5 text-[var(--text-muted)]">
                {block.url}
              </span>
            ) : null}
          </a>
        </div>
      </div>
    );
  }

  if (block.type === "source") {
    const href = block.url || "";
    const isExternal = /^https?:\/\//i.test(href);
    const mediaWidthClass = getMediaWidthClass(block.width);

    return (
      <div className={`flex w-full ${flexAlignClass} ${getBlockSpacingClass(block.type, block.spacing)}`}>
        <div className={`grid w-full ${mediaWidthClass} gap-3 py-2 ${textAlignClass}`}>
          <div className="grid gap-2 rounded-card border border-[color:var(--border-soft)] bg-[var(--panel-bg)] px-4 py-4">
            <span className="text-2xs font-medium uppercase tracking-caps text-[var(--text-muted)]">
              Source
            </span>

            {href ? (
              <a
                className="text-body font-medium leading-6 text-[var(--text-primary)] underline decoration-[color:var(--border-strong)] underline-offset-4 transition-colors hover:text-[var(--text-secondary)]"
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noreferrer" : undefined}
              >
                {block.title || block.url}
              </a>
            ) : (
              <span className="text-body font-medium leading-6 text-[var(--text-primary)]">
                {block.title || "Source"}
              </span>
            )}

            {block.details ? (
              <p className="text-ui leading-6 text-[var(--text-secondary)]">{block.details}</p>
            ) : null}

            {block.url ? (
              <span className="text-label leading-5 text-[var(--text-muted)]">{block.url}</span>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function ArticlePage({ article, sectionTitle, embedded = false, onBlockClick }) {
  return (
    <article
      className={`flex w-full max-w-[960px] flex-col gap-8 lg:gap-10 ${embedded ? "mx-0" : "mx-auto"}`}
      aria-labelledby="article-title"
    >
      <div className="overflow-hidden rounded-card border border-[color:var(--border-soft)] bg-[var(--panel-muted)] p-2">
        <img
          className="min-h-[280px] w-full rounded-tag border border-[color:var(--border-soft)] object-cover object-center sm:min-h-[352px] lg:min-h-[512px]"
          src={article.heroImage}
          alt={article.imageAlt}
          style={{ objectPosition: getObjectPosition(article.heroImagePosition) }}
        />
      </div>

      <header className="max-w-[720px] border-b border-[color:var(--border-soft)] pb-6 lg:pb-8">
        <div className="grid gap-3">
          <p className="text-2xs font-medium uppercase tracking-caps text-[var(--text-muted)]">
            {sectionTitle}
          </p>
          <h1
            className="max-w-[13ch] font-[var(--font-display)] text-display-sm leading-[0.96] tracking-display-md text-[var(--text-primary)] sm:text-display lg:text-display-xl"
            id="article-title"
          >
            {article.title}
          </h1>
          <p className="max-w-[600px] text-body leading-[1.8] text-[var(--text-secondary)] sm:text-base">
            {article.summary}
          </p>
          {article.tags?.length ? (
            <div className="flex flex-wrap gap-2 pt-1" aria-label="Tags de l'article">
              {article.tags.map((tag) => (
                <EditorialTag key={tag}>{tag}</EditorialTag>
              ))}
            </div>
          ) : null}
        </div>
      </header>

      <div className="grid gap-7">
        {article.content.map((block, index) => (
          onBlockClick ? (
            <div
              key={`${block.type}-${index}`}
              onClick={() => onBlockClick(index)}
              className="group relative cursor-pointer rounded-sm outline-none transition-colors hover:ring-2 hover:ring-[color:var(--border-strong)] hover:ring-offset-2"
              title="Cliquer pour sélectionner ce bloc dans l'éditeur"
            >
              <ArticleBlock block={block} />
            </div>
          ) : (
            <ArticleBlock block={block} key={`${block.type}-${index}`} />
          )
        ))}
      </div>
    </article>
  );
}

export default ArticlePage;
