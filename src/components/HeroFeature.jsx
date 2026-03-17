import { useEffect, useState } from "react";
import AppLink from "./AppLink";

function HeroFeature({ article, slides = [], currentPath, onNavigate, sectionTitle }) {
  const safeSlides = slides.length ? slides : [article];
  const featuredIndex = Math.max(
    safeSlides.findIndex((slide) => slide.slug === article.slug),
    0,
  );
  const [activeIndex, setActiveIndex] = useState(featuredIndex);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    setActiveIndex(featuredIndex);
  }, [featuredIndex]);

  useEffect(() => {
    if (safeSlides.length < 2) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) =>
        currentIndex === safeSlides.length - 1 ? 0 : currentIndex + 1,
      );
    }, 10000);

    return () => window.clearInterval(intervalId);
  }, [safeSlides.length]);

  const activeSlide = safeSlides[activeIndex] || article;
  const activeSectionTitle = activeSlide.sectionTitle || sectionTitle;
  const hasImage = Boolean(activeSlide.heroImage) && !imageErrors[activeSlide.path];

  const handleImageError = () => {
    setImageErrors((currentErrors) => ({
      ...currentErrors,
      [activeSlide.path]: true,
    }));
  };

  const goToPrevious = () => {
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? safeSlides.length - 1 : currentIndex - 1,
    );
  };

  const goToNext = () => {
    setActiveIndex((currentIndex) =>
      currentIndex === safeSlides.length - 1 ? 0 : currentIndex + 1,
    );
  };

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__frame">
        <AppLink
          className="hero__article-link"
          currentPath={currentPath}
          href={activeSlide.path}
          onNavigate={onNavigate}
        >
          <article className="hero__article">
            <div className="hero__media">
              {hasImage ? (
                <img
                  className="hero__image"
                  src={activeSlide.heroImage}
                  alt={activeSlide.imageAlt}
                  onError={handleImageError}
                />
              ) : (
                <div className="hero__placeholder" aria-label="Image éditoriale à venir">
                  <div className="hero__placeholder-grid" />
                  <div className="hero__placeholder-copy">
                    <span className="hero__placeholder-kicker">METABLETON</span>
                    <span className="hero__placeholder-title">
                      Image éditoriale à remplacer
                    </span>
                  </div>
                </div>
              )}

              {safeSlides.length > 1 ? (
                <div className="hero__media-controls" aria-label="Navigation principale du carousel">
                  <button
                    className="hero__media-button hero__media-button--previous"
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      goToPrevious();
                    }}
                    aria-label="Slide précédente"
                  >
                    <span aria-hidden="true">‹</span>
                  </button>

                  <button
                    className="hero__media-button hero__media-button--next"
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      goToNext();
                    }}
                    aria-label="Slide suivante"
                  >
                    <span aria-hidden="true">›</span>
                  </button>
                </div>
              ) : null}
            </div>

            <div className="hero__content">
              <p className="hero__category">{activeSectionTitle}</p>
              <h1 className="hero__title" id="hero-title">
                {activeSlide.title}
              </h1>
              {activeSlide.summary ? <p className="hero__summary">{activeSlide.summary}</p> : null}
            </div>
          </article>
        </AppLink>

        {safeSlides.length > 1 ? (
          <div className="hero__controls" aria-label="Navigation du carousel hero">
            <div className="hero__dots" aria-label="Indicateur de slide">
              {safeSlides.map((slide, index) => (
                <button
                  key={slide.path}
                  className={`hero__dot ${index === activeIndex ? "is-active" : ""}`}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Aller au slide ${index + 1}`}
                  aria-current={index === activeIndex ? "true" : undefined}
                />
              ))}
            </div>

            <p className="hero__counter" aria-label="Position dans le carousel">
              {activeIndex + 1} / {safeSlides.length}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default HeroFeature;
