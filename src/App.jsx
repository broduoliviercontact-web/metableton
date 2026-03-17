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

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(normalizePath(window.location.pathname));
    };

    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

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
    <div className="site-shell">
      <Sidebar
        currentPath={navigationPath}
        navigationGroups={navigationGroups}
        onNavigate={handleNavigate}
      />

      <main
        className={`content-area ${currentSection || currentArticle ? "content-area--section" : ""}`}
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
    </div>
  );
}

export default App;
