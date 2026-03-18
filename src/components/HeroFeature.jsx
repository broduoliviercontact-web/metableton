import { useEffect, useMemo, useState } from "react";
import AppLink from "./AppLink";

function wrapIndex(index, length) {
  return (index + length) % length;
}

function HeroFeature({ article, slides = [], currentPath, onNavigate, sectionTitle }) {
  const safeSlides = slides.length ? slides : [article];
  const hasMultipleSlides = safeSlides.length > 1;
  const featuredIndex = Math.max(
    safeSlides.findIndex((slide) => slide.slug === article.slug),
    0,
  );
  const [activeIndex, setActiveIndex] = useState(featuredIndex);
  const [renderIndex, setRenderIndex] = useState(hasMultipleSlides ? featuredIndex + 1 : 0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [imageErrors, setImageErrors] = useState({});

  const carouselSlides = useMemo(() => {
    if (!hasMultipleSlides) {
      return safeSlides;
    }

    return [safeSlides[safeSlides.length - 1], ...safeSlides, safeSlides[0]];
  }, [hasMultipleSlides, safeSlides]);

  useEffect(() => {
    setActiveIndex(featuredIndex);
    setRenderIndex(hasMultipleSlides ? featuredIndex + 1 : 0);
    setIsAnimating(true);
  }, [featuredIndex, hasMultipleSlides]);

  useEffect(() => {
    if (!hasMultipleSlides) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => wrapIndex(currentIndex + 1, safeSlides.length));
      setRenderIndex((currentIndex) => currentIndex + 1);
      setIsAnimating(true);
    }, 10000);

    return () => window.clearInterval(intervalId);
  }, [hasMultipleSlides, safeSlides.length]);

  useEffect(() => {
    if (isAnimating) {
      return undefined;
    }

    const frameId = window.requestAnimationFrame(() => {
      setIsAnimating(true);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [isAnimating]);

  const activeSlide = safeSlides[activeIndex] || article;
  const activeSectionTitle = activeSlide.sectionTitle || sectionTitle;

  const goToPrevious = () => {
    if (!hasMultipleSlides) {
      return;
    }

    setActiveIndex((currentIndex) => wrapIndex(currentIndex - 1, safeSlides.length));
    setRenderIndex((currentIndex) => currentIndex - 1);
    setIsAnimating(true);
  };

  const goToNext = () => {
    if (!hasMultipleSlides) {
      return;
    }

    setActiveIndex((currentIndex) => wrapIndex(currentIndex + 1, safeSlides.length));
    setRenderIndex((currentIndex) => currentIndex + 1);
    setIsAnimating(true);
  };

  const goToSlide = (index) => {
    setActiveIndex(index);
    setRenderIndex(hasMultipleSlides ? index + 1 : index);
    setIsAnimating(true);
  };

  const handleTransitionEnd = () => {
    if (!hasMultipleSlides) {
      return;
    }

    if (renderIndex === 0) {
      setIsAnimating(false);
      setRenderIndex(safeSlides.length);
      return;
    }

    if (renderIndex === safeSlides.length + 1) {
      setIsAnimating(false);
      setRenderIndex(1);
    }
  };

  const handleImageError = (path) => {
    setImageErrors((currentErrors) => ({
      ...currentErrors,
      [path]: true,
    }));
  };

  return (
    <section aria-labelledby="hero-title" className="flex w-full max-w-none flex-col gap-4 lg:gap-5">
      <div className="relative overflow-hidden rounded-[10px] border border-[color:var(--border-soft)] bg-transparent">
        <div
          className={`flex ${isAnimating ? "transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" : "transition-none"}`}
          style={{
            transform: `translateX(-${renderIndex * 100}%)`,
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {carouselSlides.map((slide, index) => {
            const hasImage = Boolean(slide.heroImage) && !imageErrors[slide.path];

            return (
              <div className="min-w-full shrink-0" key={`${slide.path}-${index}`}>
                <AppLink
                  className="relative block overflow-hidden rounded-[10px] bg-transparent"
                  currentPath={currentPath}
                  href={slide.path}
                  onNavigate={onNavigate}
                >
                  {hasImage ? (
                    <img
                      className="block h-[340px] w-full object-cover object-center sm:h-[500px] lg:h-[72vh] lg:min-h-[680px] lg:max-h-[820px]"
                      src={slide.heroImage}
                      alt={slide.imageAlt}
                      onError={() => handleImageError(slide.path)}
                    />
                  ) : (
                    <div
                      className="flex h-[340px] items-end border border-[color:var(--border-soft)] bg-[var(--panel-bg)] p-4 sm:h-[500px] lg:h-[72vh] lg:min-h-[680px] lg:max-h-[820px]"
                      aria-label="Image éditoriale à venir"
                    >
                      <div className="grid gap-1 rounded-[8px] border border-black/10 bg-stone-50 px-3 py-3">
                        <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--text-muted)]">
                          METABLETON
                        </span>
                        <span className="text-sm leading-6 text-[var(--text-secondary)]">
                          Image éditoriale à remplacer
                        </span>
                      </div>
                    </div>
                  )}
                </AppLink>
              </div>
            );
          })}
        </div>

        {hasMultipleSlides ? (
          <div
            className="pointer-events-none absolute inset-y-0 left-6 right-6 flex items-center justify-between sm:left-8 sm:right-8"
            aria-label="Navigation principale du carousel"
          >
            <button
              className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-[10px] border border-[color:var(--border-strong)] bg-[var(--control-bg)] text-[var(--control-text)] transition-colors duration-150 hover:bg-[var(--control-bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--control-ring)] lg:h-12 lg:w-12"
              type="button"
              onClick={goToPrevious}
              aria-label="Slide précédente"
            >
              <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                <path d="M9.5 3.5 5 8l4.5 4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" />
              </svg>
            </button>

            <button
              className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-[10px] border border-[color:var(--border-strong)] bg-[var(--control-bg)] text-[var(--control-text)] transition-colors duration-150 hover:bg-[var(--control-bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--control-ring)] lg:h-12 lg:w-12"
              type="button"
              onClick={goToNext}
              aria-label="Slide suivante"
            >
              <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                <path d="M6.5 3.5 11 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" />
              </svg>
            </button>
          </div>
        ) : null}
      </div>

      <AppLink
        className="block"
        currentPath={currentPath}
        href={activeSlide.path}
        onNavigate={onNavigate}
      >
        <article className="mx-auto grid w-full max-w-[760px] gap-2 text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--text-muted)]">
            {activeSectionTitle}
          </p>
          <h1
            className="mx-auto max-w-[13ch] font-[var(--font-display)] text-[38px] leading-[0.96] tracking-[-0.045em] text-[var(--text-primary)] sm:text-[52px] lg:text-[62px]"
            id="hero-title"
          >
            {activeSlide.title}
          </h1>
          {activeSlide.summary ? (
            <p className="mx-auto max-w-[620px] text-[15px] leading-7 text-[var(--text-secondary)] sm:text-base">
              {activeSlide.summary}
            </p>
          ) : null}
        </article>
      </AppLink>

      {hasMultipleSlides ? (
        <div
          className="mx-auto flex w-full max-w-[760px] items-center justify-center gap-4 border-t border-[color:var(--border-soft)] pt-3"
          aria-label="Navigation du carousel hero"
        >
          <div className="flex items-center gap-2" aria-label="Indicateur de slide">
            {safeSlides.map((slide, index) => (
              <button
                key={slide.path}
                className={`h-[7px] w-[7px] rounded-full transition-colors duration-150 ${
                  index === activeIndex
                    ? "bg-[var(--dot-active)]"
                    : "bg-[var(--dot-muted)] hover:bg-[var(--dot-hover)]"
                }`}
                type="button"
                onClick={() => goToSlide(index)}
                aria-label={`Aller au slide ${index + 1}`}
                aria-current={index === activeIndex ? "true" : undefined}
              />
            ))}
          </div>

          <p
            className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--text-muted)]"
            aria-label="Position dans le carousel"
          >
            {activeIndex + 1} / {safeSlides.length}
          </p>
        </div>
      ) : null}
    </section>
  );
}

export default HeroFeature;
