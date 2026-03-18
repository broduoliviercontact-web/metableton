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
    <section aria-labelledby="hero-title" className="w-full">
      <div className="grid gap-4 lg:gap-5">
        <div className="relative overflow-hidden rounded-[10px] border border-black/10 bg-neutral-50 p-2">
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
                    className="block"
                    currentPath={currentPath}
                    href={slide.path}
                    onNavigate={onNavigate}
                  >
                    {hasImage ? (
                      <img
                        className="block h-[320px] w-full rounded-[8px] border border-black/10 object-cover object-center sm:h-[380px] lg:h-[clamp(440px,60vh,680px)]"
                        src={slide.heroImage}
                        alt={slide.imageAlt}
                        onError={() => handleImageError(slide.path)}
                      />
                    ) : (
                      <div
                        className="relative flex h-[320px] w-full items-end rounded-[8px] border border-black/10 bg-white p-4 sm:h-[380px] lg:h-[clamp(440px,60vh,680px)]"
                        aria-label="Image éditoriale à venir"
                      >
                        <div className="grid gap-1 rounded-[8px] border border-black/10 bg-neutral-50 px-3 py-2">
                          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-black/50">
                            METABLETON
                          </span>
                          <span className="text-sm leading-5 text-black/70">
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
              className="pointer-events-none absolute inset-y-0 left-4 right-4 flex items-center justify-between"
              aria-label="Navigation principale du carousel"
            >
              <button
                className="pointer-events-auto inline-flex h-12 w-12 items-center justify-center rounded-full border border-black/12 bg-white/96 text-[24px] text-black/80 transition hover:border-black/22 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
                type="button"
                onClick={goToPrevious}
                aria-label="Slide précédente"
              >
                <span aria-hidden="true">‹</span>
              </button>

              <button
                className="pointer-events-auto inline-flex h-12 w-12 items-center justify-center rounded-full border border-black/12 bg-white/96 text-[24px] text-black/80 transition hover:border-black/22 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
                type="button"
                onClick={goToNext}
                aria-label="Slide suivante"
              >
                <span aria-hidden="true">›</span>
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
          <article className="mx-auto grid w-full max-w-[760px] gap-3 px-1 text-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-black/52">
              {activeSectionTitle}
            </p>
            <h1
              className="mx-auto max-w-[16ch] font-serif text-[clamp(2.1rem,4.6vw,4.8rem)] leading-[0.96] tracking-[-0.045em] text-black"
              id="hero-title"
            >
              {activeSlide.title}
            </h1>
            {activeSlide.summary ? (
              <p className="mx-auto max-w-[40rem] text-[15px] leading-7 text-black/68 sm:text-base">
                {activeSlide.summary}
              </p>
            ) : null}
          </article>
        </AppLink>

        {hasMultipleSlides ? (
          <div
            className="mx-auto flex w-full max-w-[760px] items-center justify-center gap-4 border-t border-black/8 pt-3"
            aria-label="Navigation du carousel hero"
          >
            <div className="flex items-center gap-2" aria-label="Indicateur de slide">
              {safeSlides.map((slide, index) => (
                <button
                  key={slide.path}
                  className={`h-[7px] w-[7px] rounded-full transition ${
                    index === activeIndex ? "bg-black/80" : "bg-black/18 hover:bg-black/34"
                  }`}
                  type="button"
                  onClick={() => goToSlide(index)}
                  aria-label={`Aller au slide ${index + 1}`}
                  aria-current={index === activeIndex ? "true" : undefined}
                />
              ))}
            </div>

            <p
              className="text-[11px] font-medium uppercase tracking-[0.14em] text-black/50"
              aria-label="Position dans le carousel"
            >
              {activeIndex + 1} / {safeSlides.length}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default HeroFeature;
