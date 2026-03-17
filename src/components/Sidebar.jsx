import AppLink from "./AppLink";

function Sidebar({ navigationGroups, currentPath, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar__inner">
        <AppLink
          className="sidebar__brand"
          currentPath={currentPath}
          href="/"
          aria-label="METABLETON"
          onNavigate={onNavigate}
        >
          <img
            src="/logos/metableton-logo-full.svg"
            alt="METABLETON"
            className="sidebar__wordmark"
          />
        </AppLink>

        <nav className="sidebar__nav" aria-label="Navigation principale">
          <ul className="sidebar__list">
            {navigationGroups.primary.map((item) => (
              <li key={item.label}>
                <AppLink
                  className="sidebar__link"
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

        <nav className="sidebar__nav sidebar__nav--secondary" aria-label="Liens secondaires">
          <ul className="sidebar__list">
            {navigationGroups.secondary.map((item) => (
              <li key={item.label}>
                <AppLink
                  className="sidebar__link sidebar__link--secondary"
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
      </div>
    </aside>
  );
}

export default Sidebar;
