import { useMemo, useState } from "react";
import AppLink from "./AppLink";

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
    <section className="mx-auto flex w-full max-w-[980px] flex-col gap-8 lg:gap-10">
      <header className="border-b border-black/8 pb-6 lg:pb-8">
        <div className="flex flex-col gap-6">
          <div className="max-w-[720px] space-y-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-500">
              Section
            </p>
            <h1 className="text-3xl font-medium tracking-[-0.03em] text-neutral-950 sm:text-4xl">
              {page.title}
            </h1>
            <p className="max-w-[640px] text-sm leading-7 text-neutral-600 sm:text-[15px]">
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
              className="h-11 w-full rounded-[10px] border border-black/10 bg-white px-4 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-black/20"
            />
          </div>
        </div>
      </header>

      {filteredItems.length ? (
        <div className="border-y border-black/8">
          {filteredItems.map((article) => (
            <AppLink
              key={article.id}
              href={article.path}
              currentPath={currentPath}
              onNavigate={onNavigate}
              className="group block border-b border-black/8 last:border-b-0"
            >
              <article className="grid gap-4 px-0 py-4 transition-colors duration-150 md:grid-cols-[196px_minmax(0,1fr)] md:gap-6 md:py-5">
                <div className="overflow-hidden rounded-[8px] border border-black/10 bg-neutral-100">
                  <img
                    src={article.thumbnail || article.heroImage}
                    alt={article.imageAlt}
                    className="aspect-[16/10] h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.01]"
                    loading="lazy"
                  />
                </div>

                <div className="min-w-0">
                  <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] uppercase tracking-[0.16em] text-neutral-500">
                    <span>{article.type}</span>
                    {article.label ? (
                      <span className="border-l border-black/10 pl-3">{article.label}</span>
                    ) : null}
                  </div>

                  <h2 className="max-w-[720px] text-xl font-medium tracking-[-0.03em] text-neutral-950 transition-colors duration-150 group-hover:text-neutral-700 sm:text-2xl">
                    {article.title}
                  </h2>

                  <p className="mt-3 max-w-[700px] text-sm leading-7 text-neutral-600 sm:text-[15px]">
                    {article.summary}
                  </p>

                  {article.tags?.length ? (
                    <div className="mt-4 flex flex-wrap gap-2" aria-label="Tags de l'article">
                      {article.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex h-7 items-center rounded-[8px] border border-black/10 px-2.5 text-[12px] text-neutral-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </article>
            </AppLink>
          ))}
        </div>
      ) : (
        <div className="rounded-[10px] border border-black/8 px-4 py-6 text-sm leading-7 text-neutral-600 sm:px-5">
          Aucun contenu ne correspond à cette recherche.
        </div>
      )}
    </section>
  );
}

export default SectionPage;
