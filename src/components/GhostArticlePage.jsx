function GhostArticlePage({ article }) {
  return (
    <article className="mx-auto flex w-full max-w-[760px] flex-col gap-8 pb-16">
      <header className="space-y-5 border-b border-[color:var(--border-soft)] pb-7">
        <div className="flex flex-wrap items-center gap-3 text-2xs uppercase tracking-caps text-[var(--text-muted)]">
          <span>{article.label || "Ghost"}</span>
          {article.publishedAt ? (
            <span className="border-l border-[color:var(--border-soft)] pl-3">
              {new Intl.DateTimeFormat("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }).format(new Date(article.publishedAt))}
            </span>
          ) : null}
        </div>

        <div className="space-y-4">
          <h1 className="font-[var(--font-display)] text-[2.8rem] leading-[0.96] tracking-display-md text-[var(--text-primary)] sm:text-[4.2rem]">
            {article.title}
          </h1>
          {article.excerpt ? (
            <p className="max-w-[680px] text-[1.05rem] leading-8 text-[var(--text-secondary)] sm:text-[1.12rem]">
              {article.excerpt}
            </p>
          ) : null}
        </div>
      </header>

      {article.heroImage ? (
        <div className="overflow-hidden rounded-card border border-[color:var(--border-soft)] bg-[var(--panel-muted)]">
          <img
            src={article.heroImage}
            alt={article.imageAlt || article.title}
            className="aspect-[16/9] h-full w-full object-cover"
            style={{ objectPosition: article.heroImagePosition || "50% 50%" }}
          />
        </div>
      ) : null}

      <div
        className="space-y-5 text-body leading-8 text-[var(--text-secondary)] [&_a]:underline [&_a]:underline-offset-[3px] [&_blockquote]:border-l-2 [&_blockquote]:border-[color:var(--border-strong)] [&_blockquote]:pl-4 [&_h2]:mt-10 [&_h2]:font-[var(--font-display)] [&_h2]:text-title-sm [&_h2]:leading-[1.02] [&_h2]:tracking-display-sm [&_h2]:text-[var(--text-primary)] [&_h3]:mt-8 [&_h3]:font-[var(--font-display)] [&_h3]:text-xl [&_h3]:text-[var(--text-primary)] [&_li]:ml-5 [&_li]:list-disc"
        dangerouslySetInnerHTML={{ __html: article.html }}
      />
    </article>
  );
}

export default GhostArticlePage;
