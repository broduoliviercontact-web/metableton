import { useMemo, useState } from "react";
import AppLink from "./AppLink";
import EditorialTag from "./EditorialTag";

function normalizeSearchValue(value) {
  return value.trim().toLowerCase();
}

function matchesQuery(article, query) {
  if (!query) {
    return true;
  }

  const fields = [article.title, article.summary, ...(article.tags || [])];

  return fields.some((field) => field?.toLowerCase().includes(query));
}

function SectionPage({ page, currentPath, onNavigate }) {
  const [query, setQuery] = useState("");
  const normalizedQuery = normalizeSearchValue(query);

  const filteredItems = useMemo(
    () => page.items.filter((article) => matchesQuery(article, normalizedQuery)),
    [page.items, normalizedQuery],
  );

  return (
    <section className="mx-auto flex w-full max-w-[960px] flex-col gap-8 lg:gap-10">
      <header className="border-b border-[color:var(--border-soft)] pb-6 lg:pb-8">
        <div className="flex flex-col gap-6">
          <div className="max-w-[720px] space-y-3">
            <p className="text-2xs font-medium uppercase tracking-caps-wider text-[var(--text-muted)]">
              Section
            </p>
            <h1 className="font-[var(--font-display)] text-display-sm leading-[0.98] tracking-display-md text-[var(--text-primary)] sm:text-display">
              {page.title}
            </h1>
            <p className="max-w-[640px] text-body leading-7 text-[var(--text-secondary)]">
              {page.intro}
            </p>
          </div>

          <div className="max-w-[360px]">
            <label className="sr-only" htmlFor="section-search">
              Rechercher dans {page.title}
            </label>
            <input
              id="section-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Rechercher un article"
              className="h-11 w-full rounded-card border border-[color:var(--border-soft)] bg-[var(--panel-bg)] px-4 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[color:var(--border-strong)]"
            />
          </div>
        </div>
      </header>

      {filteredItems.length ? (
        <div className="border-y border-[color:var(--border-soft)]">
          {filteredItems.map((article) => (
            <AppLink
              key={article.id}
              href={article.path}
              currentPath={currentPath}
              onNavigate={onNavigate}
              className="group block border-b border-[color:var(--border-soft)] last:border-b-0"
            >
              <article className="grid gap-4 px-0 py-5 transition-colors duration-150 md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 md:py-6">
                <div className="overflow-hidden rounded-tag border border-[color:var(--border-soft)] bg-[var(--panel-muted)]">
                  {article.thumbnail || article.heroImage ? (
                    <img
                      src={article.thumbnail || article.heroImage}
                      alt={article.imageAlt}
                      className="aspect-[16/10] h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.01]"
                      style={{ objectPosition: article.thumbnailPosition || article.heroImagePosition || "50% 50%" }}
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex aspect-[16/10] h-full w-full items-end bg-[var(--panel-bg)] p-4">
                      <span className="rounded-tag border border-[color:var(--border-soft)] px-3 py-2 text-2xs uppercase tracking-caps text-[var(--text-muted)]">
                        Ghost article
                      </span>
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-2xs uppercase tracking-caps text-[var(--text-muted)]">
                    <span>{article.type}</span>
                    {article.label ? (
                      <span className="border-l border-[color:var(--border-soft)] pl-3">{article.label}</span>
                    ) : null}
                  </div>

                  <h2 className="max-w-[680px] font-[var(--font-display)] text-title-sm leading-[1.02] tracking-display-sm text-[var(--text-primary)] transition-colors duration-150 group-hover:text-[var(--text-secondary)] sm:text-title">
                    {article.title}
                  </h2>

                  <p className="mt-3 max-w-[700px] text-body leading-7 text-[var(--text-secondary)]">
                    {article.summary}
                  </p>

                  {article.tags?.length ? (
                    <div className="mt-4 flex flex-wrap gap-2" aria-label="Tags de l'article">
                      {article.tags.slice(0, 3).map((tag) => (
                        <EditorialTag key={tag}>
                          {tag}
                        </EditorialTag>
                      ))}
                    </div>
                  ) : null}
                </div>
              </article>
            </AppLink>
          ))}
        </div>
      ) : (
        <div className="rounded-card border border-[color:var(--border-soft)] px-5 py-6 text-body leading-7 text-[var(--text-secondary)]">
          Aucun contenu ne correspond à cette recherche.
        </div>
      )}
    </section>
  );
}

export default SectionPage;
