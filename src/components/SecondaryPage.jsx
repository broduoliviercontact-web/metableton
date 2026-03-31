function SecondaryPage({ page }) {
  return (
    <section className="mx-auto flex w-full max-w-[960px] flex-col gap-8 lg:gap-10" aria-labelledby="secondary-page-title">
      <header className="border-b border-[color:var(--border-soft)] pb-6 lg:pb-8">
        <div className="max-w-[720px] space-y-3">
          <p className="text-2xs font-medium uppercase tracking-caps-wider text-[var(--text-muted)]">
            Information
          </p>
          <h1
            className="font-[var(--font-display)] text-display-sm leading-[0.98] tracking-display-md text-[var(--text-primary)] sm:text-display lg:text-display-lg"
            id="secondary-page-title"
          >
            {page.title}
          </h1>
          <p className="max-w-[620px] text-body leading-[1.8] text-[var(--text-secondary)] sm:text-base">
            {page.intro}
          </p>
        </div>
      </header>

      {page.panels?.length ? (
        <div className="border-y border-[color:var(--border-soft)]">
          {page.panels.map((panel) => (
            <article
              className="grid gap-3 border-b border-[color:var(--border-soft)] px-0 py-4 last:border-b-0 sm:grid-cols-[minmax(0,220px)_minmax(0,1fr)] sm:gap-6 sm:py-6"
              key={panel.title}
            >
              <h2 className="text-body font-medium tracking-display-2xs text-[var(--text-primary)] sm:text-[18px]">
                {panel.title}
              </h2>
              <p className="max-w-[620px] text-body leading-[1.8] text-[var(--text-secondary)] sm:text-base">
                {panel.text}
              </p>
            </article>
          ))}
        </div>
      ) : null}

      {page.links?.length ? (
        <div className="border-y border-[color:var(--border-soft)]">
          {page.links.map((link) => (
            <a
              className="grid gap-2 border-b border-[color:var(--border-soft)] px-0 py-4 transition-colors duration-150 hover:opacity-90 last:border-b-0 sm:grid-cols-[160px_minmax(0,1fr)] sm:items-baseline sm:gap-6 sm:py-5"
              href={link.href}
              key={link.label}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noreferrer" : undefined}
            >
              <span className="text-2xs font-medium uppercase tracking-caps text-[var(--text-muted)]">
                {link.label}
              </span>
              <span className="font-[var(--font-display)] text-title-xs leading-[1.04] tracking-display-xs text-[var(--text-primary)] sm:text-title-sm">
                {link.value}
              </span>
            </a>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export default SecondaryPage;
