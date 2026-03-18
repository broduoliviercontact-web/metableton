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
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
              Section
            </p>
            <h1 className="font-[var(--font-display)] text-[40px] leading-[0.98] tracking-[-0.045em] text-[var(--text-primary)] sm:text-[52px]">
              {page.title}
            </h1>
            <p className="max-w-[640px] text-sm leading-7 text-[var(--text-secondary)] sm:text-[15px]">
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
              className="h-11 w-full rounded-[10px] border border-[color:var(--border-soft)] bg-[var(--panel-bg)] px-4 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[color:var(--border-strong)]"
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
              <article className="grid gap-4 px-0 py-4 transition-colors duration-150 md:grid-cols-[208px_minmax(0,1fr)] md:gap-6 md:py-5">
                <div className="overflow-hidden rounded-[8px] border border-[color:var(--border-soft)] bg-[var(--panel-muted)]">
                  <img
                    src={article.thumbnail || article.heroImage}
                    alt={article.imageAlt}
                    className="aspect-[16/10] h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.01]"
                    loading="lazy"
                  />
                </div>

                <div className="min-w-0">
                  <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                    <span>{article.type}</span>
                    {article.label ? (
                      <span className="border-l border-[color:var(--border-soft)] pl-3">{article.label}</span>
                    ) : null}
                  </div>

                  <h2 className="max-w-[680px] font-[var(--font-display)] text-[28px] leading-[1.02] tracking-[-0.035em] text-[var(--text-primary)] transition-colors duration-150 group-hover:text-[var(--text-secondary)] sm:text-[34px]">
                    {article.title}
                  </h2>

                  <p className="mt-3 max-w-[700px] text-sm leading-7 text-[var(--text-secondary)] sm:text-[15px]">
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
        <div className="rounded-[10px] border border-[color:var(--border-soft)] px-4 py-6 text-sm leading-7 text-[var(--text-secondary)] sm:px-5">
          Aucun contenu ne correspond à cette recherche.
        </div>
      )}
    </section>
  );
}

export default SectionPage;
