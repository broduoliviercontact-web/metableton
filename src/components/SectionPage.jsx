import AppLink from "./AppLink";

function SectionPage({ page, currentPath, onNavigate }) {
  return (
    <section className="section-page" aria-labelledby="section-title">
      <header className="section-page__header">
        <h1 className="section-page__title" id="section-title">
          {page.title}
        </h1>
        <p className="section-page__intro">{page.intro}</p>
      </header>

      <div className="section-list">
        {page.items.map((item) => (
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
            </div>
          </AppLink>
        ))}
      </div>
    </section>
  );
}

export default SectionPage;
