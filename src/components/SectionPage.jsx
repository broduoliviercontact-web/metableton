import { useState } from "react";
import AppLink from "./AppLink";

function SectionPage({ page, currentPath, onNavigate }) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const filteredItems = page.items.filter((item) => {
    if (!normalizedQuery) {
      return true;
    }

    const searchableText = [
      item.title,
      item.summary,
      ...(item.tags || []),
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedQuery);
  });

  return (
    <section className="section-page" aria-labelledby="section-title">
      <header className="section-page__header">
        <h1 className="section-page__title" id="section-title">
          {page.title}
        </h1>
        <p className="section-page__intro">{page.intro}</p>

        <div className="section-page__search-wrap">
          <label className="section-page__search-label" htmlFor={`search-${page.slug}`}>
            Rechercher dans cette section
          </label>
          <input
            className="section-page__search-input"
            id={`search-${page.slug}`}
            type="search"
            placeholder="Titre, resume, tag..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </header>

      <div className="section-list">
        {filteredItems.length ? filteredItems.map((item) => (
          <AppLink
            className="section-list__item"
            currentPath={currentPath}
            href={item.path}
            key={item.id}
            onNavigate={onNavigate}
          >
            {item.thumbnail ? (
              <div className="section-list__media">
                <img
                  className="section-list__thumb"
                  src={item.thumbnail}
                  alt={item.imageAlt || item.title}
                  loading="lazy"
                />
              </div>
            ) : null}

            <div className="section-list__content">
              <div className="section-list__eyebrow">
                <span className="section-list__type">{item.type}</span>
                {item.label ? <span className="section-list__label">{item.label}</span> : null}
              </div>

              <h2 className="section-list__title">{item.title}</h2>
              <p className="section-list__description">{item.summary}</p>

              {item.tags?.length ? (
                <div className="section-list__tags" aria-label="Tags">
                  {item.tags.map((tag) => (
                    <span className="editorial-tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </AppLink>
        )) : (
          <p className="section-page__empty">
            Aucun contenu ne correspond a cette recherche.
          </p>
        )}
      </div>
    </section>
  );
}

export default SectionPage;
