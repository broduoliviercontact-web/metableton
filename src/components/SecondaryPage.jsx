function SecondaryPage({ page }) {
  return (
    <section className="secondary-page" aria-labelledby="secondary-page-title">
      <header className="secondary-page__header">
        <h1 className="secondary-page__title" id="secondary-page-title">
          {page.title}
        </h1>
        <p className="secondary-page__intro">{page.intro}</p>
      </header>

      {page.panels?.length ? (
        <div className="secondary-page__panels">
          {page.panels.map((panel) => (
            <article className="secondary-page__panel" key={panel.title}>
              <h2 className="secondary-page__panel-title">{panel.title}</h2>
              <p className="secondary-page__panel-text">{panel.text}</p>
            </article>
          ))}
        </div>
      ) : null}

      {page.links?.length ? (
        <div className="secondary-page__links">
          {page.links.map((link) => (
            <a
              className="secondary-page__link"
              href={link.href}
              key={link.label}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noreferrer" : undefined}
            >
              <span className="secondary-page__link-label">{link.label}</span>
              <span className="secondary-page__link-value">{link.value}</span>
            </a>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export default SecondaryPage;
