import { useEffect, useState } from "react";
import ArticlePage from "./components/ArticlePage";
import HeroFeature from "./components/HeroFeature";
import SecondaryPage from "./components/SecondaryPage";
import SectionPage from "./components/SectionPage";
import Sidebar from "./components/Sidebar";
import {
  articlesByPath,
  featuredArticle,
  heroCarouselSlides,
  navigationGroups,
  secondaryPages,
  sectionPages,
  sections,
} from "./data/content";

function normalizePath(pathname) {
  if (!pathname || pathname === "/") {
    return "/";
  }

  return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

function App() {
  const [currentPath, setCurrentPath] = useState(() => normalizePath(window.location.pathname));
  const [theme, setTheme] = useState(() => {
    const savedTheme = window.localStorage.getItem("metableton-theme");

    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(normalizePath(window.location.pathname));
    };

    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("metableton-theme", theme);
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  const handleNavigate = (href) => {
    const nextPath = normalizePath(href);

    if (nextPath === currentPath) {
      return;
    }

    window.history.pushState({}, "", nextPath);
    setCurrentPath(nextPath);
  };

  const currentSection = sectionPages[currentPath];
  const currentSecondaryPage = secondaryPages[currentPath];
  const currentArticle = articlesByPath[currentPath];
  const articleSection = currentArticle
    ? sections.find((section) => section.id === currentArticle.section)
    : null;
  const featuredSection = sections.find((section) => section.id === featuredArticle.section);
  const navigationPath = currentSection
    ? currentSection.path
    : currentSecondaryPage
      ? currentSecondaryPage.path
      : articleSection
        ? `/${articleSection.slug}`
        : currentPath;

  return (
    <div
      className={`theme-shell min-h-screen bg-[var(--app-bg)] text-[var(--text-primary)] transition-colors duration-200 lg:grid lg:grid-cols-[minmax(0,1fr)_256px] ${
        theme === "dark" ? "theme-dark" : "theme-light"
      }`}
    >
      <main
        className="min-w-0 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8"
        aria-label="Contenu principal"
      >
        {currentArticle ? (
          <ArticlePage article={currentArticle} sectionTitle={articleSection?.title} />
        ) : currentSection ? (
          <SectionPage
            currentPath={currentPath}
            onNavigate={handleNavigate}
            page={currentSection}
          />
        ) : currentSecondaryPage ? (
          <SecondaryPage page={currentSecondaryPage} />
        ) : (
          <HeroFeature
            article={featuredArticle}
            slides={heroCarouselSlides}
            currentPath={currentPath}
            onNavigate={handleNavigate}
            sectionTitle={featuredSection?.title}
          />
        )}
      </main>

      <Sidebar
        currentPath={navigationPath}
        navigationGroups={navigationGroups}
        onNavigate={handleNavigate}
        onToggleTheme={() => setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"))}
        theme={theme}
      />
    </div>
  );
}

export default App;
