import { useEffect, useMemo, useRef, useState } from "react";
import AppLink from "./AppLink";

function HeroArrowButton({ direction, onClick, theme = "dark" }) {
  const isPrevious = direction === "previous";
  const toneClasses =
    theme === "light"
      ? "border-white/18 text-white hover:bg-white/10 focus-visible:ring-white/30"
      : "border-[color:var(--border-soft)] text-[var(--text-secondary)] hover:bg-[var(--panel-muted)] focus-visible:ring-[var(--control-ring)]";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPrevious ? "Slide précédente" : "Slide suivante"}
      className={`inline-flex h-10 w-10 items-center justify-center border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 ${toneClasses}`}
    >
      <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 16 16" fill="none">
        {isPrevious ? (
          <path d="M9.5 3.5 5 8l4.5 4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" />
        ) : (
          <path d="M6.5 3.5 11 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" />
        )}
      </svg>
    </button>
  );
}

function HeroDots({ slides, activeIndex, onSelect, tone = "dark" }) {
  const dotClasses =
    tone === "light"
      ? {
          active: "bg-white",
          idle: "bg-white/38 hover:bg-white/62",
        }
      : {
          active: "bg-[var(--dot-active)]",
          idle: "bg-[var(--dot-muted)] hover:bg-[var(--dot-hover)]",
        };

  return (
    <div className="flex items-center gap-2" aria-label="Indicateur de slide">
      {slides.map((slide, index) => (
        <button
          key={slide.path}
          className={`h-[7px] w-[7px] rounded-full transition-colors duration-150 ${
            index === activeIndex ? dotClasses.active : dotClasses.idle
          }`}
          type="button"
          onClick={() => onSelect(index)}
          aria-label={`Aller au slide ${index + 1}`}
          aria-current={index === activeIndex ? "true" : undefined}
        />
      ))}
    </div>
  );
}

function HeroFeature({ article, slides = [], currentPath, onNavigate, sectionTitle }) {
  const safeSlides = slides.length ? slides : [article];
  const hasMultipleSlides = safeSlides.length > 1;
  const featuredIndex = Math.max(
    safeSlides.findIndex((slide) => slide.slug === article.slug),
    0,
  );
  const viewportRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(featuredIndex);
  const [trackIndex, setTrackIndex] = useState(hasMultipleSlides ? featuredIndex + 1 : 0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [imageErrors, setImageErrors] = useState({});
  const [viewportWidth, setViewportWidth] = useState(0);
  const isTransitionLockedRef = useRef(false);

  const carouselSlides = useMemo(() => {
    if (!hasMultipleSlides) {
      return safeSlides;
    }

    return [safeSlides[safeSlides.length - 1], ...safeSlides, safeSlides[0]];
  }, [hasMultipleSlides, safeSlides]);

  useEffect(() => {
    setActiveIndex(featuredIndex);
    setTrackIndex(hasMultipleSlides ? featuredIndex + 1 : 0);
    setIsAnimating(true);
    isTransitionLockedRef.current = false;
  }, [featuredIndex, hasMultipleSlides]);

  useEffect(() => {
    const element = viewportRef.current;

    if (!element) {
      return undefined;
    }

    const updateWidth = () => {
      setViewportWidth(element.getBoundingClientRect().width);
    };

    updateWidth();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateWidth);

      return () => window.removeEventListener("resize", updateWidth);
    }

    const observer = new ResizeObserver(() => {
      updateWidth();
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasMultipleSlides) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      if (isTransitionLockedRef.current) {
        return;
      }

      isTransitionLockedRef.current = true;
      setActiveIndex((currentIndex) => (currentIndex + 1) % safeSlides.length);
      setTrackIndex((currentIndex) => currentIndex + 1);
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
      isTransitionLockedRef.current = false;
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [isAnimating]);

  const activeSlide = safeSlides[activeIndex] || article;
  const safeViewportWidth = Math.max(viewportWidth, 1);
  const trackWidth = `${carouselSlides.length * safeViewportWidth}px`;
  const slideWidth = `${safeViewportWidth}px`;
  const trackTranslate = `translate3d(-${trackIndex * safeViewportWidth}px, 0, 0)`;

  const handleImageError = (path) => {
    setImageErrors((currentErrors) => ({
      ...currentErrors,
      [path]: true,
    }));
  };

  const goToPrevious = () => {
    if (!hasMultipleSlides || isTransitionLockedRef.current) {
      return;
    }

    isTransitionLockedRef.current = true;
    setActiveIndex((currentIndex) => (currentIndex === 0 ? safeSlides.length - 1 : currentIndex - 1));
    setTrackIndex((currentIndex) => currentIndex - 1);
    setIsAnimating(true);
  };

  const goToNext = () => {
    if (!hasMultipleSlides || isTransitionLockedRef.current) {
      return;
    }

    isTransitionLockedRef.current = true;
    setActiveIndex((currentIndex) => (currentIndex === safeSlides.length - 1 ? 0 : currentIndex + 1));
    setTrackIndex((currentIndex) => currentIndex + 1);
    setIsAnimating(true);
  };

  const goToSlide = (nextIndex) => {
    if (!hasMultipleSlides || isTransitionLockedRef.current || nextIndex === activeIndex) {
      return;
    }

    isTransitionLockedRef.current = true;
    setActiveIndex(nextIndex);
    setTrackIndex(nextIndex + 1);
    setIsAnimating(true);
  };

  const handleTransitionEnd = () => {
    if (!hasMultipleSlides) {
      return;
    }

    if (trackIndex === 0) {
      setIsAnimating(false);
      setTrackIndex(safeSlides.length);
      return;
    }

    if (trackIndex === safeSlides.length + 1) {
      setIsAnimating(false);
      setTrackIndex(1);
      return;
    }

    isTransitionLockedRef.current = false;
  };

  return (
    <section
      aria-labelledby="hero-title"
      className="flex w-full max-w-none flex-col gap-4 lg:h-full lg:min-h-0 lg:gap-0"
    >
      <div
        ref={viewportRef}
        className="relative overflow-hidden rounded-[10px] border border-[color:var(--border-soft)] bg-transparent lg:h-full lg:min-h-0"
      >
        <div
          className={`flex h-full ${isAnimating ? "transition-transform duration-500 ease-out" : "transition-none"} will-change-transform`}
          style={{ width: trackWidth, transform: trackTranslate }}
          onTransitionEnd={handleTransitionEnd}
        >
          {carouselSlides.map((slide, index) => {
            const hasImage = Boolean(slide.heroImage) && !imageErrors[slide.path];

            return (
              <div className="shrink-0" style={{ width: slideWidth }} key={`${slide.path}-${index}`}>
                <AppLink
                  className="relative block h-full overflow-hidden rounded-[10px] bg-transparent"
                  currentPath={currentPath}
                  href={slide.path}
                  onNavigate={onNavigate}
                >
                  {hasImage ? (
                    <img
                      className="block h-[340px] w-full object-cover object-center sm:h-[500px] lg:h-full"
                      src={slide.heroImage}
                      alt={slide.imageAlt}
                      style={{ objectPosition: slide.heroImagePosition || "50% 50%" }}
                      onError={() => handleImageError(slide.path)}
                    />
                  ) : (
                    <div
                      className="flex h-[340px] items-end border border-[color:var(--border-soft)] bg-[var(--panel-bg)] p-4 sm:h-[500px] lg:h-full"
                      aria-label="Image éditoriale à venir"
                    >
                      <div className="grid gap-1 rounded-[8px] border border-[color:var(--border-soft)] bg-[var(--panel-bg)] px-3 py-3">
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

        <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden lg:block">
          <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-end px-8 pb-8">
            <div className="max-w-[420px]">
              <div className="inline-flex max-w-full rounded-[10px] border border-white/14 bg-black/58 px-4 py-3 backdrop-blur-[2px]">
                <h1
                  className="text-left font-[var(--font-ui)] text-[22px] font-normal leading-[1.12] tracking-[-0.02em] text-white"
                  id="hero-title"
                >
                  {activeSlide.title}
                </h1>
              </div>
            </div>

            {hasMultipleSlides ? (
              <div className="justify-self-center">
                <HeroDots
                  slides={safeSlides}
                  activeIndex={activeIndex}
                  tone="light"
                  onSelect={goToSlide}
                />
              </div>
            ) : null}

            {hasMultipleSlides ? (
              <div className="justify-self-end">
                <div className="pointer-events-auto inline-flex overflow-hidden rounded-[10px] border border-white/18 bg-black/65">
                  <HeroArrowButton direction="previous" onClick={goToPrevious} theme="light" />
                  <HeroArrowButton direction="next" onClick={goToNext} theme="light" />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <AppLink
        className="block lg:hidden"
        currentPath={currentPath}
        href={activeSlide.path}
        onNavigate={onNavigate}
      >
        <article className="mx-auto grid w-full max-w-[760px] gap-2 text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--text-muted)]">
            {sectionTitle}
          </p>
          <h1
            className="mx-auto max-w-[13ch] font-[var(--font-display)] text-[38px] leading-[0.96] tracking-[-0.045em] text-[var(--text-primary)] sm:text-[52px]"
            id="hero-title-mobile"
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
          className="mx-auto flex w-full max-w-[760px] items-center justify-center gap-3 border-t border-[color:var(--border-soft)] pt-3 lg:hidden"
          aria-label="Navigation du carousel hero"
        >
          <div className="inline-flex overflow-hidden rounded-[10px] border border-[color:var(--border-soft)] bg-[var(--panel-bg)]">
            <HeroArrowButton direction="previous" onClick={goToPrevious} />
            <HeroArrowButton direction="next" onClick={goToNext} />
          </div>
          <HeroDots slides={safeSlides} activeIndex={activeIndex} onSelect={goToSlide} />
        </div>
      ) : null}
    </section>
  );
}

export default HeroFeature;
