import EditorialTag from "./EditorialTag";

function ArticleBlock({ block }) {
  if (block.type === "heading") {
    return (
      <h2 className="pt-4 font-[var(--font-display)] text-[28px] leading-[1.05] tracking-[-0.03em] text-[var(--text-primary)] sm:text-[34px]">
        {block.content}
      </h2>
    );
  }

  if (block.type === "paragraph") {
    return <p className="text-[15px] leading-7 text-[var(--text-secondary)] sm:text-base">{block.content}</p>;
  }

  if (block.type === "list") {
    return (
      <ul className="grid gap-2 pl-5 text-[15px] leading-7 text-[var(--text-secondary)] sm:text-base">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  if (block.type === "quote") {
    return (
      <blockquote className="border-l border-[color:var(--border-strong)] pl-4 font-[var(--font-display)] text-[20px] leading-8 tracking-[-0.02em] text-[var(--text-secondary)] sm:text-[22px]">
        <p>{block.content}</p>
      </blockquote>
    );
  }

  if (block.type === "callout") {
    return (
      <aside className="rounded-[10px] border border-[color:var(--border-soft)] bg-[var(--panel-bg)] px-4 py-4" aria-label={block.label || "Note"}>
        {block.label ? (
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--text-muted)]">
            {block.label}
          </p>
        ) : null}
        <p className="text-[15px] leading-7 text-[var(--text-secondary)] sm:text-base">{block.content}</p>
      </aside>
    );
  }

  if (block.type === "image" || block.type === "gif") {
    return (
      <figure className="grid gap-3 py-2">
        <img
          className="w-full rounded-[10px] border border-[color:var(--border-soft)] bg-[var(--panel-bg)]"
          src={block.src}
          alt={block.alt}
          loading="lazy"
        />
        {block.caption ? (
          <figcaption className="text-[13px] leading-6 text-[var(--text-muted)]">{block.caption}</figcaption>
        ) : null}
      </figure>
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
