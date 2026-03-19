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
        className="font-medium text-[var(--text-primary)] underline decoration-[color:var(--text-primary)] decoration-[1.5px] underline-offset-[3px] transition-colors hover:text-[var(--text-secondary)]"
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

function ArticleBlock({ block }) {
  const textAlignClass = getTextAlignClass(block.align);
  const selfAlignClass = getSelfAlignClass(block.align);
  const flexAlignClass = getFlexAlignClass(block.align);

  if (block.type === "heading") {
    return (
      <div className={selfAlignClass}>
        <h2
          className={`pt-4 font-[var(--font-display)] text-[28px] leading-[1.05] tracking-[-0.03em] text-[var(--text-primary)] sm:text-[34px] ${textAlignClass}`}
        >
          {block.content}
        </h2>
      </div>
    );
  }

  if (block.type === "paragraph") {
    return (
      <p className={`text-[15px] leading-7 text-[var(--text-secondary)] sm:text-base ${textAlignClass}`}>
        {renderInlineLinks(block.content)}
      </p>
    );
  }

  if (block.type === "list") {
    const listAlignmentClass =
      getBlockAlign(block.align) === "center"
        ? "mx-auto w-fit"
        : getBlockAlign(block.align) === "right"
          ? "ml-auto w-fit"
          : "";

    return (
      <ul
        className={`grid gap-2 pl-5 text-[15px] leading-7 text-[var(--text-secondary)] sm:text-base ${listAlignmentClass}`}
      >
        {block.items.map((item) => (
          <li key={item}>{renderInlineLinks(item)}</li>
        ))}
      </ul>
    );
  }

  if (block.type === "quote") {
    const quoteAlign = getBlockAlign(block.align);
    const quoteSideClass =
      quoteAlign === "right"
        ? "border-r pr-4 text-right"
        : "border-l pl-4";

    return (
      <blockquote
        className={`${selfAlignClass} ${quoteSideClass} border-[color:var(--border-strong)] font-[var(--font-display)] text-[20px] leading-8 tracking-[-0.02em] text-[var(--text-secondary)] sm:text-[22px]`}
      >
        <p>{renderInlineLinks(block.content)}</p>
      </blockquote>
    );
  }

  if (block.type === "callout") {
    return (
      <aside
        className={`rounded-[10px] border border-[color:var(--border-soft)] bg-[var(--panel-bg)] px-4 py-4 ${textAlignClass}`}
        aria-label={block.label || "Note"}
      >
        {block.label ? (
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--text-muted)]">
            {block.label}
          </p>
        ) : null}
        <p className="text-[15px] leading-7 text-[var(--text-secondary)] sm:text-base">
          {renderInlineLinks(block.content)}
        </p>
      </aside>
    );
  }

  if (block.type === "image" || block.type === "gif") {
    const objectPosition = getObjectPosition(block.position);
    const imageZoom = getImageZoom(block.zoom);
    const mediaWidthClass = getMediaWidthClass(block.width);
    const aspectRatioClass = getAspectRatioClass(block.aspectRatio, "16/10");

    return (
      <div className={`flex w-full ${flexAlignClass}`}>
        <figure className={`grid w-full ${mediaWidthClass} gap-3 py-2 ${textAlignClass}`}>
          <div className="overflow-hidden rounded-[10px] border border-[color:var(--border-soft)] bg-[var(--panel-bg)]">
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
            <figcaption className="text-[13px] leading-6 text-[var(--text-muted)]">{block.caption}</figcaption>
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
      <div className={`flex w-full ${flexAlignClass}`}>
        <figure className={`grid w-full ${mediaWidthClass} gap-3 py-2 ${textAlignClass}`}>
          {embedUrl ? (
            <div className="overflow-hidden rounded-[10px] border border-[color:var(--border-soft)] bg-[var(--panel-bg)]">
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
              className="inline-flex w-fit rounded-[10px] border border-[color:var(--border-soft)] px-4 py-3 text-[15px] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              href={block.url}
              target="_blank"
              rel="noreferrer"
            >
              Ouvrir la vidéo YouTube
            </a>
          )}
          {block.caption ? (
            <figcaption className="text-[13px] leading-6 text-[var(--text-muted)]">{block.caption}</figcaption>
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
      <div className={`flex w-full ${flexAlignClass}`}>
        <div className={`grid w-full ${mediaWidthClass} gap-3 py-2 ${textAlignClass}`}>
          <a
            className="grid gap-2 rounded-[10px] border border-[color:var(--border-soft)] bg-[var(--panel-bg)] px-4 py-4 transition-colors hover:border-[color:var(--border-strong)]"
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noreferrer" : undefined}
          >
            <span className="text-[15px] font-medium leading-6 text-[var(--text-primary)]">
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
      <div className={`flex w-full ${flexAlignClass}`}>
        <div className={`grid w-full ${mediaWidthClass} gap-3 py-2 ${textAlignClass}`}>
          <div className="grid gap-2 rounded-[10px] border border-[color:var(--border-soft)] bg-[var(--panel-bg)] px-4 py-4">
            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--text-muted)]">
              Source
            </span>

            {href ? (
              <a
                className="text-[15px] font-medium leading-6 text-[var(--text-primary)] underline decoration-[color:var(--border-strong)] underline-offset-4 transition-colors hover:text-[var(--text-secondary)]"
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noreferrer" : undefined}
              >
                {block.title || block.url}
              </a>
            ) : (
              <span className="text-[15px] font-medium leading-6 text-[var(--text-primary)]">
                {block.title || "Source"}
              </span>
            )}

            {block.details ? (
              <p className="text-[14px] leading-6 text-[var(--text-secondary)]">{block.details}</p>
            ) : null}

            {block.url ? (
              <span className="text-[12px] leading-5 text-[var(--text-muted)]">{block.url}</span>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function ArticlePage({ article, sectionTitle }) {
  return (
    <article
      className="mx-auto flex w-full max-w-[960px] flex-col gap-8 lg:gap-10"
      aria-labelledby="article-title"
    >
      <div className="overflow-hidden rounded-[10px] border border-[color:var(--border-soft)] bg-[var(--panel-muted)] p-2">
        <img
          className="min-h-[280px] w-full rounded-[8px] border border-[color:var(--border-soft)] object-cover object-center sm:min-h-[352px] lg:min-h-[512px]"
          src={article.heroImage}
          alt={article.imageAlt}
          style={{ objectPosition: getObjectPosition(article.heroImagePosition) }}
        />
      </div>

      <header className="max-w-[720px] border-b border-[color:var(--border-soft)] pb-6 lg:pb-8">
        <div className="grid gap-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--text-muted)]">
            {sectionTitle}
          </p>
          <h1
            className="max-w-[13ch] font-[var(--font-display)] text-[40px] leading-[0.96] tracking-[-0.045em] text-[var(--text-primary)] sm:text-[52px] lg:text-[64px]"
            id="article-title"
          >
            {article.title}
          </h1>
          <p className="max-w-[560px] text-[15px] leading-7 text-[var(--text-secondary)] sm:text-base">
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

      <div className="grid max-w-[680px] gap-6">
        {article.content.map((block, index) => (
          <ArticleBlock block={block} key={`${block.type}-${index}`} />
        ))}
      </div>
    </article>
  );
}

export default ArticlePage;
