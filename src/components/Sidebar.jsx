import AppLink from "./AppLink";

function Sidebar({ navigationGroups, currentPath, onNavigate, theme, onToggleTheme }) {
  return (
    <aside className="border-b border-[color:var(--border-soft)] bg-[var(--panel-subtle)] lg:border-b-0 lg:border-l">
      <div className="flex gap-6 px-4 py-4 sm:px-6 lg:sticky lg:top-0 lg:min-h-screen lg:flex-col lg:px-6 lg:py-8">
        <div className="shrink-0 ">
          <AppLink
            className="inline-flex justify-center"
            currentPath={currentPath}
            href="/"
            aria-label="METABLETON"
            onNavigate={onNavigate}
          >
            <img
              src="/logos/metableton-logo-full.svg"
              alt="METABLETON"
              className={`h-auto w-[136px] transition-[filter] duration-150 sm:w-[148px] ${
                theme === "dark" ? "invert" : ""
              }`}
            />
          </AppLink>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <nav aria-label="Navigation principale">
            <ul className="grid gap-2">
              {navigationGroups.primary.map((item) => (
                <li key={item.label}>
                  <AppLink
                    className={`block border-b py-2.5 pl-3 text-body leading-6 transition-colors duration-150 ${
                      currentPath === item.href
                        ? "border-[color:var(--border-strong)] text-[var(--text-primary)]"
                        : "border-[color:var(--border-soft)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                    currentPath={currentPath}
                    href={item.href}
                    onNavigate={onNavigate}
                  >
                    {item.label}
                  </AppLink>
                </li>
              ))}
            </ul>
          </nav>

          <nav
            className="border-t border-[color:var(--border-soft)] pt-4 lg:mt-auto lg:pt-8"
            aria-label="Liens secondaires"
          >
            <ul className="grid gap-2">
              {navigationGroups.secondary.map((item) => (
                <li key={item.label}>
                  <AppLink
                    className={`block border-b py-2 pl-3 text-ui leading-6 transition-colors duration-150 ${
                      currentPath === item.href
                        ? "border-[color:var(--border-strong)] text-[var(--text-secondary)]"
                        : "border-[color:var(--border-soft)] text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                    }`}
                    currentPath={currentPath}
                    href={item.href}
                    onNavigate={onNavigate}
                  >
                    {item.label}
                  </AppLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto border-t border-[color:var(--border-soft)] pt-4 text-center lg:pt-8">
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={theme === "dark" ? "Activer le mode clair" : "Activer le mode sombre"}
              aria-pressed={theme === "dark"}
              className="relative mx-auto flex h-10 w-[78px] items-center rounded-full border border-[color:var(--border-soft)] bg-[var(--panel-bg)] px-1 transition-colors duration-150 hover:border-[color:var(--border-strong)]"
            >
              <span className="flex w-full items-center justify-between px-2 text-[var(--text-muted)]">
                <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M10 3.25v1.5M10 15.25v1.5M5.23 5.23l1.06 1.06M13.71 13.71l1.06 1.06M3.25 10h1.5M15.25 10h1.5M5.23 14.77l1.06-1.06M13.71 6.29l1.06-1.06M13 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M14.75 11.2A5.75 5.75 0 0 1 8.8 5.25 5.76 5.76 0 1 0 14.75 11.2Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span
                className={`absolute h-8 w-8 rounded-full border border-[color:var(--border-soft)] bg-[var(--panel-subtle)] transition-transform duration-200 ${
                  theme === "dark" ? "translate-x-[38px]" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
