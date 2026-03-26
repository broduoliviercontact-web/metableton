import { useEffect, useMemo, useRef, useState } from "react";
import abletonData from "../ableton.json";
import EditorialTag from "./EditorialTag";

const FILTERS = [
  { id: "all", label: "Tout" },
  { id: "software", label: "Live" },
  { id: "hardware", label: "Hardware" },
  { id: "platform", label: "Plateforme" },
];

const VIEW_MODES = [
  { id: "archive", label: "Vue archive" },
  { id: "knightlab", label: "Vue Knight Lab" },
];

const TEMP_VISUALS = {
  entries: {
    "live-1": "/articles/guides-ableton/session-view.jpg",
    "live-2": "/articles/blog-news/arrangement-overview.jpg",
    "live-3": "/articles/blog-news/ableton-interface-closeup.jpg",
    "live-4": "/articles/guides-ableton/ableton-live-overview.jpg",
    "live-5": "/articles/guides-ableton/clean-project-view.jpg",
    "live-6": "/articles/guides-ableton/browser-and-session-view.jpg",
    "max-for-live-2009": "/articles/max-for-live/max-like-interface.jpg",
    "live-9": "/articles/max-for-live/creative-ableton-view.jpg",
    "push-1-release": "/articles/blog-news/home-studio-ableton.jpg",
    "push-2-release": "/articles/guides-ableton/clean-project-view.jpg",
    "push-3-release": "/articles/max-for-live/device-workflow.jpg",
    "move-release": "/articles/freebies/template-session.jpg",
    "live-12": "/articles/guides-ableton/Meld-main.jpg",
    "live-12-1": "/articles/guides-ableton/browser-and-session-view.jpg",
    "live-12-2": "/articles/guides-ableton/clean-project-view.jpg",
    "live-12-3": "/articles/blog-news/ableton-interface-closeup.jpg",
    "live-12-4": "/articles/max-for-live/creative-ableton-view.jpg",
  },
  products: {
    "ableton-live": "/articles/guides-ableton/ableton-live-overview.jpg",
    "max-for-live": "/articles/max-for-live/max-like-interface.jpg",
    "push-1": "/articles/blog-news/home-studio-ableton.jpg",
    "push-2": "/articles/blog-news/ableton-interface-closeup.jpg",
    "push-3": "/articles/max-for-live/device-workflow.jpg",
    "move": "/articles/freebies/template-session.jpg",
  },
  eras: {
    "era-early-live": "/articles/guides-ableton/session-view.jpg",
    "era-audio-to-midi": "/articles/guides-ableton/browser-and-session-view.jpg",
    "era-push-1": "/articles/blog-news/ableton-interface-closeup.jpg",
    "era-push-2": "/articles/guides-ableton/clean-project-view.jpg",
    "era-push-3-move": "/articles/guides-ableton/Meld-main.jpg",
  },
};

const KNIGHT_LAB_CSS_ID = "knightlab-timeline-css";
const KNIGHT_LAB_SCRIPT_ID = "knightlab-timeline-script";
const KNIGHT_LAB_SCRIPT_SRC = "https://cdn.knightlab.com/libs/timeline3/latest/js/timeline.js";
const KNIGHT_LAB_CSS_SRC = "https://cdn.knightlab.com/libs/timeline3/latest/css/timeline.css";

function ensureKnightLabAssets() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("TimelineJS n’est disponible que dans le navigateur."));
  }

  if (!document.getElementById(KNIGHT_LAB_CSS_ID)) {
    const link = document.createElement("link");
    link.id = KNIGHT_LAB_CSS_ID;
    link.rel = "stylesheet";
    link.href = KNIGHT_LAB_CSS_SRC;
    document.head.appendChild(link);
  }

  if (window.TL?.Timeline) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const existingScript = document.getElementById(KNIGHT_LAB_SCRIPT_ID);

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Impossible de charger TimelineJS.")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.id = KNIGHT_LAB_SCRIPT_ID;
    script.src = KNIGHT_LAB_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Impossible de charger TimelineJS."));
    document.body.appendChild(script);
  });
}

function normalizeValue(value) {
  return value.trim().toLowerCase();
}

function formatDateLabel(date, precision = "day") {
  if (!date) {
    return "Date inconnue";
  }

  const safeDate = new Date(`${date}T12:00:00`);

  if (Number.isNaN(safeDate.getTime())) {
    return date;
  }

  if (precision === "year") {
    return `${safeDate.getFullYear()}`;
  }

  if (precision === "month") {
    return new Intl.DateTimeFormat("fr-FR", {
      month: "long",
      year: "numeric",
    }).format(safeDate);
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(safeDate);
}

function getEntryYear(entry) {
  return entry.date ? entry.date.slice(0, 4) : "????";
}

function getEntryChannel(entry) {
  if (entry.productFamily === "hardware") {
    return "hardware";
  }

  if (entry.productFamily === "platform" || entry.type === "platform") {
    return "platform";
  }

  return "software";
}

function getTypeLabel(entry) {
  if (entry.type === "major") {
    return "Version majeure";
  }

  if (entry.type === "update") {
    return "Mise à jour";
  }

  if (entry.type === "addon") {
    return "Extension";
  }

  if (entry.type === "platform") {
    return "Plateforme";
  }

  if (entry.type === "hardware") {
    return "Hardware";
  }

  return entry.type;
}

function getStatusLabel(status) {
  if (status === "released") {
    return "Sortie";
  }

  if (status === "public-beta") {
    return "Bêta publique";
  }

  if (status === "historical-approx") {
    return "Date approximative";
  }

  return status;
}

function collectHighlights(entry) {
  const values = [
    ...(entry.headlineFeatures || []),
    ...(entry.newFeatures || []),
    ...(entry.newInstruments || []),
    ...(entry.newAudioEffects || []),
    ...(entry.newMidiEffects || []),
    ...(entry.hardwareHighlights || []),
  ];

  return [...new Set(values)].slice(0, 8);
}

function entryMatchesQuery(entry, query, eraId) {
  if (eraId !== "all" && entry.era !== eraId) {
    return false;
  }

  if (!query) {
    return true;
  }

  const fields = [
    entry.label,
    entry.headline,
    entry.summary,
    ...(entry.tags || []),
    ...(entry.newFeatures || []),
    ...(entry.headlineFeatures || []),
    ...(entry.newInstruments || []),
    ...(entry.newAudioEffects || []),
    ...(entry.newMidiEffects || []),
    ...(entry.hardwareHighlights || []),
  ];

  return fields.some((field) => field?.toLowerCase().includes(query));
}

function buildEntryIndex(entries) {
  return entries.reduce((accumulator, entry) => {
    accumulator[entry.id] = entry;
    return accumulator;
  }, {});
}

function buildProductIndex(products) {
  return products.reduce((accumulator, product) => {
    accumulator[product.id] = product;
    return accumulator;
  }, {});
}

function buildEraIndex(eras) {
  return eras.reduce((accumulator, era) => {
    accumulator[era.id] = era;
    return accumulator;
  }, {});
}

function getFeatureMatches(features, query) {
  if (!query) {
    return features.slice(0, 6);
  }

  return features
    .filter((feature) => {
      const fields = [feature.name, feature.category, feature.firstAppearanceLabel];
      return fields.some((field) => field?.toLowerCase().includes(query));
    })
    .slice(0, 6);
}

function groupEntriesByEra(entries, eras) {
  return eras
    .map((era) => ({
      ...era,
      items: entries.filter((entry) => entry.era === era.id),
    }))
    .filter((era) => era.items.length);
}

function getDateParts(date, precision = "day") {
  if (!date) {
    return { year: 2001 };
  }

  const [year, month, day] = date.split("-").map((part) => Number(part));
  const parts = { year };

  if (precision === "month" || precision === "day") {
    parts.month = month || 1;
  }

  if (precision === "day") {
    parts.day = day || 1;
  }

  return parts;
}

function getVisualForEntry(entry, product, era) {
  const hero =
    entry.coverImage ||
    TEMP_VISUALS.entries[entry.id] ||
    TEMP_VISUALS.products[product?.id] ||
    TEMP_VISUALS.eras[era?.id] ||
    null;

  const secondary =
    TEMP_VISUALS.products[product?.id] ||
    TEMP_VISUALS.eras[era?.id] ||
    TEMP_VISUALS.entries[entry.id] ||
    null;

  return {
    hero,
    secondary,
    heroAlt: `${entry.label} — visuel de timeline`,
    secondaryAlt: `${product?.displayName || product?.name || era?.label || entry.label} — visuel secondaire`,
  };
}

function isKnightLabMilestone(entry) {
  return (
    entry.type === "major" ||
    entry.type === "platform" ||
    (entry.channel === "hardware" && entry.id.endsWith("-release"))
  );
}

function buildKnightLabTimelineData({ page, entries, eras, productIndex, eraIndex }) {
  const latestDate = entries[entries.length - 1]?.date || new Date().toISOString().slice(0, 10);
  const heroEntry = entries[0] || null;
  const heroProduct = heroEntry ? productIndex[heroEntry.productId] : null;
  const heroEra = heroEntry ? eraIndex[heroEntry.era] : null;
  const heroVisuals = heroEntry ? getVisualForEntry(heroEntry, heroProduct, heroEra) : null;

  return {
    title: {
      text: {
        headline: page.title,
        text: `<p>${page.intro}</p><p>Version de comparaison rendue avec TimelineJS de Knight Lab, à partir de la même base de données locale.</p>`,
      },
      media: heroVisuals?.hero
        ? {
            url: heroVisuals.hero,
            caption: "Visuel temporaire branché depuis le projet",
            alt: heroVisuals.heroAlt,
          }
        : undefined,
      background: {
        color: "#d6d3d1",
      },
    },
    eras: eras
      .filter((era) => entries.some((entry) => entry.era === era.id))
      .map((era) => ({
        start_date: getDateParts(era.startDate, "day"),
        end_date: getDateParts(era.endDate || latestDate, "day"),
        text: {
          headline: era.label,
        },
      })),
    events: entries.map((entry) => {
      const product = productIndex[entry.productId];
      const era = eraIndex[entry.era];
      const visuals = getVisualForEntry(entry, product, era);
      const highlights = entry.highlights
        .slice(0, 4)
        .map((item) => `<li>${item}</li>`)
        .join("");

      return {
        start_date: getDateParts(entry.date, entry.datePrecision),
        display_date: formatDateLabel(entry.date, entry.datePrecision),
        text: {
          headline: entry.label,
          text: `<p><strong>${entry.headline}</strong></p><p>${entry.summary}</p>${
            highlights ? `<ul>${highlights}</ul>` : ""
          }<p>${getTypeLabel(entry)} · ${product?.displayName || product?.name || "Ableton"} · ${getStatusLabel(entry.status)}</p>`,
        },
        media: visuals.hero
          ? {
              url: visuals.hero,
              thumbnail: visuals.secondary || visuals.hero,
              caption: `${era?.label || "Ableton"} · visuel temporaire`,
              alt: visuals.heroAlt,
            }
          : undefined,
        background: {
          color: era?.color || "#d6d3d1",
        },
        group: era?.label || "",
        unique_id: entry.id,
      };
    }),
  };
}

function ArchiveImage({ src, alt, year, caption, accentColor, compact = false }) {
  if (src) {
    return (
      <figure className="relative overflow-hidden rounded-[10px] border border-[color:var(--border-soft)] bg-[var(--panel-subtle)]">
        <img
          src={src}
          alt={alt}
          className={`h-full w-full object-cover ${compact ? "min-h-[170px]" : "min-h-[320px]"}`}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-4 py-4 text-white">
          <p className={`${compact ? "text-[28px]" : "text-[48px]"} font-[var(--font-display)] leading-none tracking-[-0.06em]`}>
            {year}
          </p>
          {caption ? <p className="mt-2 max-w-[28ch] text-[12px] leading-5 text-white/82">{caption}</p> : null}
        </div>
        <span
          className="absolute inset-x-0 top-0 h-[4px]"
          style={{ backgroundColor: accentColor || "var(--text-primary)" }}
          aria-hidden="true"
        />
      </figure>
    );
  }

  return (
    <div
      className="relative overflow-hidden rounded-[10px] border border-[color:var(--border-soft)] bg-[var(--panel-subtle)]"
      style={{
        backgroundImage: `linear-gradient(180deg, ${(accentColor || "#171717")}2f 0%, transparent 100%)`,
      }}
    >
      <div className={`${compact ? "min-h-[170px] p-4" : "min-h-[320px] p-5"} flex flex-col justify-between`}>
        <div>
          <p className="text-[12px] uppercase tracking-[0.08em] text-[var(--text-muted)]">Visuel à remplacer</p>
          <p className="mt-4 font-[var(--font-display)] text-[56px] leading-none tracking-[-0.07em] text-[var(--text-primary)]">
            {year}
          </p>
        </div>
        {caption ? (
          <p className="max-w-[28ch] text-[13px] leading-6 text-[var(--text-secondary)]">{caption}</p>
        ) : null}
      </div>
      <span
        className="absolute inset-x-0 top-0 h-[4px]"
        style={{ backgroundColor: accentColor || "var(--text-primary)" }}
        aria-hidden="true"
      />
    </div>
  );
}

function KnightLabTimelinePreview({ page, entries, activeId, eras, productIndex, eraIndex }) {
  const containerRef = useRef(null);
  const instanceRef = useRef(null);
  const embedIdRef = useRef(`knightlab-timeline-${Math.random().toString(36).slice(2, 9)}`);
  const [loadingError, setLoadingError] = useState("");

  const timelineEntries = useMemo(() => {
    const curated = entries.filter((entry) => isKnightLabMilestone(entry));

    if (activeId && entries.some((entry) => entry.id === activeId) && !curated.some((entry) => entry.id === activeId)) {
      const activeEntry = entries.find((entry) => entry.id === activeId);
      return [...curated, activeEntry].sort((left, right) => {
        if (left.date !== right.date) {
          return left.date.localeCompare(right.date);
        }

        return (left.sortOrder || 0) - (right.sortOrder || 0);
      });
    }

    return curated;
  }, [activeId, entries]);

  const timelineData = useMemo(
    () =>
      buildKnightLabTimelineData({
        page,
        entries: timelineEntries,
        eras,
        productIndex,
        eraIndex,
      }),
    [eraIndex, eras, page, productIndex, timelineEntries],
  );

  const startAtSlide = useMemo(() => {
    const index = timelineEntries.findIndex((entry) => entry.id === activeId);
    return index >= 0 ? index + 1 : 0;
  }, [activeId, timelineEntries]);

  useEffect(() => {
    let cancelled = false;

    if (!containerRef.current || !timelineEntries.length) {
      return undefined;
    }

    setLoadingError("");

    ensureKnightLabAssets()
      .then(() => {
        if (cancelled || !containerRef.current || !window.TL?.Timeline) {
          return;
        }

        containerRef.current.innerHTML = "";

        instanceRef.current = new window.TL.Timeline(embedIdRef.current, timelineData, {
          language: "fr",
          font: "oldstandard",
          theme: "contrast",
          initial_zoom: 3,
          timenav_height_percentage: 28,
          timenav_mobile_height_percentage: 40,
          marker_padding: 4,
          slide_padding_lr: 80,
          start_at_slide: startAtSlide,
          hash_bookmark: false,
          duration: 500,
        });
      })
      .catch((error) => {
        if (!cancelled) {
          setLoadingError(error.message);
        }
      });

    return () => {
      cancelled = true;

      if (instanceRef.current && typeof instanceRef.current.destroy === "function") {
        instanceRef.current.destroy();
      }

      instanceRef.current = null;

      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [startAtSlide, timelineData, timelineEntries.length]);

  if (!timelineEntries.length) {
    return (
      <div className="rounded-[10px] border border-[color:var(--border-soft)] px-5 py-6 text-sm leading-7 text-[var(--text-secondary)]">
        Aucun jalon compatible à afficher dans la vue Knight Lab avec les filtres actuels.
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-[10px] border border-[color:var(--border-soft)] bg-[var(--panel-bg)]">
      <div className="border-b border-[color:var(--border-soft)] px-5 py-4 sm:px-6">
        <p className="text-sm leading-7 text-[var(--text-secondary)]">
          Aperçu TimelineJS avec une sélection resserrée de jalons majeurs pour rester proche de son usage éditorial.
        </p>
      </div>

      <div className="px-2 py-2 sm:px-3 sm:py-3">
        <div
          id={embedIdRef.current}
          ref={containerRef}
          className="min-h-[760px] w-full bg-white"
        />
      </div>

      {loadingError ? (
        <div className="border-t border-[color:var(--border-soft)] px-5 py-4 text-sm leading-7 text-[var(--text-secondary)]">
          {loadingError}
        </div>
      ) : null}
    </section>
  );
}

function TimelineArrow({ direction, onClick, disabled }) {
  const isPrevious = direction === "previous";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isPrevious ? "Événement précédent" : "Événement suivant"}
      className="inline-flex h-10 w-10 items-center justify-center rounded-[8px] border border-[color:var(--border-soft)] bg-[var(--panel-bg)] text-[var(--text-secondary)] transition-colors hover:border-[color:var(--border-strong)] hover:text-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-40"
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

function AbletonTimelinePage({ page }) {
  const { eras, products, timelineVersions, hardwareTimeline, featureFirstAppearance } = abletonData;
  const cardRefs = useRef({});

  const entries = useMemo(
    () =>
      [...timelineVersions, ...hardwareTimeline]
        .map((entry) => ({
          ...entry,
          channel: getEntryChannel(entry),
          highlights: collectHighlights(entry),
        }))
        .sort((left, right) => {
          if (left.date !== right.date) {
            return left.date.localeCompare(right.date);
          }

          return (left.sortOrder || 0) - (right.sortOrder || 0);
        }),
    [hardwareTimeline, timelineVersions],
  );

  const entryIndex = useMemo(() => buildEntryIndex(entries), [entries]);
  const productIndex = useMemo(() => buildProductIndex(products), [products]);
  const eraIndex = useMemo(() => buildEraIndex(eras), [eras]);
  const normalizedFeatures = useMemo(
    () =>
      [...featureFirstAppearance].sort((left, right) => {
        if (left.date !== right.date) {
          return left.date.localeCompare(right.date);
        }

        return left.name.localeCompare(right.name, "fr");
      }),
    [featureFirstAppearance],
  );

  const [channelFilter, setChannelFilter] = useState("all");
  const [eraFilter, setEraFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [featureQuery, setFeatureQuery] = useState("");
  const [viewMode, setViewMode] = useState("archive");
  const [activeId, setActiveId] = useState(entries[0]?.id || null);

  const normalizedQuery = normalizeValue(query);
  const normalizedFeatureQuery = normalizeValue(featureQuery);

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      if (channelFilter !== "all" && entry.channel !== channelFilter) {
        return false;
      }

      return entryMatchesQuery(entry, normalizedQuery, eraFilter);
    });
  }, [channelFilter, entries, eraFilter, normalizedQuery]);

  const featureMatches = useMemo(
    () => getFeatureMatches(normalizedFeatures, normalizedFeatureQuery),
    [normalizedFeatureQuery, normalizedFeatures],
  );

  const eraGroups = useMemo(
    () => groupEntriesByEra(filteredEntries, eras),
    [eras, filteredEntries],
  );

  useEffect(() => {
    if (!filteredEntries.length) {
      setActiveId(null);
      return;
    }

    if (!filteredEntries.some((entry) => entry.id === activeId)) {
      setActiveId(filteredEntries[0].id);
    }
  }, [activeId, filteredEntries]);

  useEffect(() => {
    if (!activeId) {
      return;
    }

    const element = cardRefs.current[activeId];

    if (!element) {
      return;
    }

    element.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeId]);

  const activeEntry = filteredEntries.find((entry) => entry.id === activeId) || filteredEntries[0] || null;
  const activeEntryIndex = activeEntry
    ? filteredEntries.findIndex((entry) => entry.id === activeEntry.id)
    : -1;
  const activeProduct = activeEntry ? productIndex[activeEntry.productId] : null;
  const activeEra = activeEntry ? eraIndex[activeEntry.era] : null;
  const relatedEntries = activeEntry
    ? (activeEntry.relatedIds || []).map((relatedId) => entryIndex[relatedId]).filter(Boolean)
    : [];
  const activeVisuals = activeEntry ? getVisualForEntry(activeEntry, activeProduct, activeEra) : null;

  const focusEntry = (entry) => {
    if (!entry) {
      return;
    }

    setChannelFilter("all");
    setEraFilter("all");
    setQuery("");
    setActiveId(entry.id);
  };

  const goToSibling = (direction) => {
    if (activeEntryIndex < 0) {
      return;
    }

    const nextEntry = filteredEntries[activeEntryIndex + direction];

    if (nextEntry) {
      setActiveId(nextEntry.id);
    }
  };

  return (
    <section className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 lg:gap-8">
      <header className="border-b border-[color:var(--border-soft)] pb-6 lg:pb-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
          <div className="space-y-4">
            <h1 className="font-[var(--font-display)] text-[40px] leading-[0.95] tracking-[-0.05em] text-[var(--text-primary)] sm:text-[54px] lg:text-[68px]">
              {page.title}
            </h1>
            <p className="max-w-[820px] text-[15px] leading-7 text-[var(--text-secondary)] sm:text-base">
              {page.intro}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-px overflow-hidden rounded-[10px] border border-[color:var(--border-soft)] bg-[color:var(--border-soft)]">
            <div className="bg-[var(--panel-bg)] px-4 py-4">
              <p className="text-[12px] text-[var(--text-muted)]">Jalons</p>
              <p className="mt-2 text-[24px] font-medium tracking-[-0.04em] text-[var(--text-primary)]">
                {entries.length}
              </p>
            </div>
            <div className="bg-[var(--panel-bg)] px-4 py-4">
              <p className="text-[12px] text-[var(--text-muted)]">Ères</p>
              <p className="mt-2 text-[24px] font-medium tracking-[-0.04em] text-[var(--text-primary)]">
                {eras.length}
              </p>
            </div>
            <div className="bg-[var(--panel-bg)] px-4 py-4">
              <p className="text-[12px] text-[var(--text-muted)]">Features</p>
              <p className="mt-2 text-[24px] font-medium tracking-[-0.04em] text-[var(--text-primary)]">
                {featureFirstAppearance.length}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="flex flex-wrap gap-2">
            {VIEW_MODES.map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setViewMode(mode.id)}
                className={`rounded-[8px] border px-3 py-2 text-sm transition-colors ${
                  viewMode === mode.id
                    ? "border-[color:var(--border-strong)] bg-[var(--panel-bg)] text-[var(--text-primary)]"
                    : "border-[color:var(--border-soft)] bg-[var(--panel-subtle)] text-[var(--text-secondary)] hover:border-[color:var(--border-strong)] hover:bg-[var(--panel-bg)]"
                }`}
              >
                {mode.label}
              </button>
            ))}

            {FILTERS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setChannelFilter(filter.id)}
                className={`rounded-[8px] border px-3 py-2 text-sm transition-colors ${
                  channelFilter === filter.id
                    ? "border-[color:var(--border-strong)] bg-[var(--panel-bg)] text-[var(--text-primary)]"
                    : "border-[color:var(--border-soft)] bg-[var(--panel-subtle)] text-[var(--text-secondary)] hover:border-[color:var(--border-strong)] hover:bg-[var(--panel-bg)]"
                }`}
              >
                {filter.label}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setEraFilter("all")}
              className={`rounded-[8px] border px-3 py-2 text-sm transition-colors ${
                eraFilter === "all"
                  ? "border-[color:var(--border-strong)] bg-[var(--panel-bg)] text-[var(--text-primary)]"
                  : "border-[color:var(--border-soft)] bg-[var(--panel-subtle)] text-[var(--text-secondary)] hover:border-[color:var(--border-strong)] hover:bg-[var(--panel-bg)]"
              }`}
            >
              Toutes les ères
            </button>

            {eras.map((era) => (
              <button
                key={era.id}
                type="button"
                onClick={() => setEraFilter(era.id)}
                className={`inline-flex items-center gap-2 rounded-[8px] border px-3 py-2 text-sm transition-colors ${
                  eraFilter === era.id
                    ? "border-[color:var(--border-strong)] bg-[var(--panel-bg)] text-[var(--text-primary)]"
                    : "border-[color:var(--border-soft)] bg-[var(--panel-subtle)] text-[var(--text-secondary)] hover:border-[color:var(--border-strong)] hover:bg-[var(--panel-bg)]"
                }`}
              >
                <span
                  className="h-[8px] w-[8px] rounded-full"
                  style={{ backgroundColor: era.color }}
                  aria-hidden="true"
                />
                {era.label}
              </button>
            ))}
          </div>

          <label className="block" htmlFor="ableton-timeline-search">
            <span className="sr-only">Rechercher dans la timeline</span>
            <input
              id="ableton-timeline-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Rechercher une version ou une fonction"
              className="h-11 w-full rounded-[10px] border border-[color:var(--border-soft)] bg-[var(--panel-bg)] px-4 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[color:var(--border-strong)]"
            />
          </label>
        </div>
      </header>

      {viewMode === "knightlab" ? (
        <KnightLabTimelinePreview
          page={page}
          entries={filteredEntries}
          activeId={activeId}
          eras={eras}
          productIndex={productIndex}
          eraIndex={eraIndex}
        />
      ) : activeEntry ? (
        <section className="overflow-hidden rounded-[10px] border border-[color:var(--border-soft)] bg-[var(--panel-bg)]">
          <div className="grid gap-px bg-[color:var(--border-soft)] lg:grid-cols-[minmax(0,1.3fr)_360px]">
            <div className="bg-[var(--panel-bg)]">
              <div className="grid gap-6 px-5 py-5 sm:px-6 sm:py-6 lg:px-7 lg:py-7">
                <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)]">
                  <div className="grid gap-4">
                    <ArchiveImage
                      src={activeVisuals?.hero}
                      alt={activeVisuals?.heroAlt}
                      year={getEntryYear(activeEntry)}
                      caption={`${activeProduct?.displayName || activeProduct?.name || "Ableton"} · ${formatDateLabel(activeEntry.date, activeEntry.datePrecision)}`}
                      accentColor={activeEra?.color}
                    />

                    <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_220px]">
                      <div
                        className="relative overflow-hidden rounded-[10px] border border-[color:var(--border-soft)] bg-[var(--panel-subtle)] px-5 py-5"
                        style={{
                          backgroundImage: `linear-gradient(180deg, ${activeEra?.color || "#171717"}22 0%, transparent 100%)`,
                        }}
                      >
                        <div
                          className="absolute inset-x-0 top-0 h-[4px]"
                          style={{ backgroundColor: activeEra?.color || "var(--text-primary)" }}
                          aria-hidden="true"
                        />
                        <p className="text-[12px] text-[var(--text-muted)]">
                          {activeProduct?.displayName || activeProduct?.name || "Ableton"}
                        </p>
                        <p className="mt-6 font-[var(--font-display)] text-[56px] leading-none tracking-[-0.07em] text-[var(--text-primary)] sm:text-[72px]">
                          {getEntryYear(activeEntry)}
                        </p>
                        <p className="mt-3 text-[13px] leading-6 text-[var(--text-secondary)]">
                          {formatDateLabel(activeEntry.date, activeEntry.datePrecision)}
                        </p>
                        <div className="mt-6 flex flex-wrap gap-2">
                          <EditorialTag>{getTypeLabel(activeEntry)}</EditorialTag>
                          <EditorialTag>{getStatusLabel(activeEntry.status)}</EditorialTag>
                        </div>
                      </div>

                      <ArchiveImage
                        src={activeVisuals?.secondary}
                        alt={activeVisuals?.secondaryAlt}
                        year={getEntryYear(activeEntry)}
                        caption={activeEra?.label || "Archive visuelle"}
                        accentColor={activeEra?.color}
                        compact
                      />
                    </div>
                  </div>

                  <div className="flex flex-col justify-between gap-6">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-[12px] text-[var(--text-muted)]">
                        <span>{activeEra?.label}</span>
                        <span aria-hidden="true">/</span>
                        <span>{activeEntry.channel === "software" ? "Software" : activeEntry.channel === "hardware" ? "Hardware" : "Platform"}</span>
                      </div>

                      <h2 className="mt-4 font-[var(--font-display)] text-[34px] leading-[0.98] tracking-[-0.045em] text-[var(--text-primary)] sm:text-[46px]">
                        {activeEntry.label}
                      </h2>
                      <p className="mt-4 max-w-[740px] text-[17px] leading-8 text-[var(--text-primary)]">
                        {activeEntry.headline}
                      </p>
                      <p className="mt-4 max-w-[760px] text-[15px] leading-7 text-[var(--text-secondary)] sm:text-base">
                        {activeEntry.summary}
                      </p>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                      <div>
                        <p className="text-sm font-medium text-[var(--text-primary)]">Points clés</p>
                        <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--text-secondary)]">
                          {activeEntry.highlights.slice(0, 5).map((highlight) => (
                            <li key={highlight}>{highlight}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-[var(--text-primary)]">Tags</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {(activeEntry.tags || []).slice(0, 6).map((tag) => (
                            <EditorialTag key={tag}>{tag}</EditorialTag>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="rounded-[10px] border border-[color:var(--border-soft)] bg-[var(--panel-subtle)] px-4 py-4">
                        <p className="text-[12px] text-[var(--text-muted)]">Produit</p>
                        <p className="mt-2 text-sm leading-6 text-[var(--text-primary)]">
                          {activeProduct?.displayName || activeProduct?.name || "Ableton"}
                        </p>
                      </div>
                      <div className="rounded-[10px] border border-[color:var(--border-soft)] bg-[var(--panel-subtle)] px-4 py-4">
                        <p className="text-[12px] text-[var(--text-muted)]">Ère</p>
                        <p className="mt-2 text-sm leading-6 text-[var(--text-primary)]">
                          {activeEra?.label || "Période"}
                        </p>
                      </div>
                      <div className="rounded-[10px] border border-[color:var(--border-soft)] bg-[var(--panel-subtle)] px-4 py-4">
                        <p className="text-[12px] text-[var(--text-muted)]">Statut</p>
                        <p className="mt-2 text-sm leading-6 text-[var(--text-primary)]">
                          {getStatusLabel(activeEntry.status)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <aside className="grid gap-5 bg-[var(--panel-bg)] px-5 py-5 sm:px-6 sm:py-6">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-[var(--text-primary)]">Navigation</p>
                <div className="flex items-center gap-2">
                  <TimelineArrow
                    direction="previous"
                    onClick={() => goToSibling(-1)}
                    disabled={activeEntryIndex <= 0}
                  />
                  <TimelineArrow
                    direction="next"
                    onClick={() => goToSibling(1)}
                    disabled={activeEntryIndex < 0 || activeEntryIndex >= filteredEntries.length - 1}
                  />
                </div>
              </div>

              {activeProduct ? (
                <div className="rounded-[10px] border border-[color:var(--border-soft)] bg-[var(--panel-subtle)] px-4 py-4">
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    {activeProduct.displayName || activeProduct.name}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                    {activeProduct.description}
                  </p>
                </div>
              ) : null}

              {(activeEntry.ecosystem || []).length ? (
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">Écosystème</p>
                  <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--text-secondary)]">
                    {activeEntry.ecosystem.slice(0, 4).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {relatedEntries.length ? (
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">Liens croisés</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {relatedEntries.map((entry) => (
                      <button
                        key={entry.id}
                        type="button"
                        onClick={() => focusEntry(entry)}
                        className="rounded-[8px] border border-[color:var(--border-soft)] px-3 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:border-[color:var(--border-strong)] hover:text-[var(--text-primary)]"
                      >
                        {entry.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="border-t border-[color:var(--border-soft)] pt-5">
                <p className="text-sm font-medium text-[var(--text-primary)]">Quand est apparu…</p>
                <label className="mt-3 block" htmlFor="ableton-feature-search">
                  <span className="sr-only">Rechercher une feature</span>
                  <input
                    id="ableton-feature-search"
                    type="search"
                    value={featureQuery}
                    onChange={(event) => setFeatureQuery(event.target.value)}
                    placeholder="Operator, Drum Rack, Stem Separation…"
                    className="h-11 w-full rounded-[10px] border border-[color:var(--border-soft)] bg-[var(--panel-bg)] px-4 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[color:var(--border-strong)]"
                  />
                </label>
                <div className="mt-3 grid gap-2">
                  {featureMatches.map((feature) => {
                    const featureEntry = entryIndex[feature.firstAppearanceId];

                    return (
                      <button
                        key={feature.slug}
                        type="button"
                        onClick={() => featureEntry && focusEntry(featureEntry)}
                        className="rounded-[8px] border border-[color:var(--border-soft)] px-3 py-3 text-left transition-colors hover:border-[color:var(--border-strong)]"
                      >
                        <span className="block text-sm font-medium text-[var(--text-primary)]">
                          {feature.name}
                        </span>
                        <span className="mt-1 block text-sm text-[var(--text-secondary)]">
                          {feature.firstAppearanceLabel} ·{" "}
                          {formatDateLabel(
                            featureEntry?.date || feature.date,
                            featureEntry?.datePrecision || "day",
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>
          </div>

          {(activeEntry.sources || []).length ? (
            <div className="border-t border-[color:var(--border-soft)] px-5 py-4 sm:px-6 lg:px-7">
              <div className="flex flex-wrap gap-2">
                {activeEntry.sources.map((source) => (
                  <a
                    key={`${activeEntry.id}-${source.url}`}
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-[8px] border border-[color:var(--border-soft)] px-3 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:border-[color:var(--border-strong)] hover:text-[var(--text-primary)]"
                  >
                    {source.title}
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </section>
      ) : (
        <div className="rounded-[10px] border border-[color:var(--border-soft)] px-5 py-6 text-sm leading-7 text-[var(--text-secondary)]">
          Aucun jalon ne correspond aux filtres actuels.
        </div>
      )}

      {viewMode === "archive" && filteredEntries.length ? (
        <section className="overflow-hidden rounded-[10px] border border-[color:var(--border-soft)] bg-[var(--panel-bg)]">
          <div className="border-b border-[color:var(--border-soft)] px-5 py-4 sm:px-6">
            <p className="text-sm text-[var(--text-secondary)]">
              Frise horizontale inspirée d’un viewer éditorial: sélectionne un jalon pour faire évoluer le panneau principal.
            </p>
          </div>

          <div className="overflow-x-auto pb-2">
            <div className="min-w-max px-5 pt-5 sm:px-6">
              <div className="flex gap-4">
                {eraGroups.map((era) => (
                  <button
                    key={era.id}
                    type="button"
                    onClick={() => setEraFilter(era.id)}
                    className={`min-w-[220px] rounded-[10px] border px-4 py-3 text-left transition-colors ${
                      eraFilter === era.id
                        ? "border-[color:var(--border-strong)] bg-[var(--panel-subtle)]"
                        : "border-[color:var(--border-soft)] bg-transparent hover:bg-[var(--panel-subtle)]"
                    }`}
                  >
                    <span
                      className="mb-3 block h-[4px] w-full rounded-full"
                      style={{ backgroundColor: era.color }}
                      aria-hidden="true"
                    />
                    <span className="block text-sm font-medium text-[var(--text-primary)]">{era.label}</span>
                    <span className="mt-1 block text-sm text-[var(--text-muted)]">
                      {era.items.length} jalons
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative mt-6 min-w-max px-5 pb-8 sm:px-6">
              <span
                className="absolute left-6 right-6 top-[172px] h-px bg-[color:var(--border-soft)]"
                aria-hidden="true"
              />

              <ol className="flex gap-4">
                {filteredEntries.map((entry) => {
                  const isActive = entry.id === activeEntry?.id;
                  const product = productIndex[entry.productId];
                  const era = eraIndex[entry.era];
                  const visuals = getVisualForEntry(entry, product, era);

                  return (
                    <li key={entry.id} className="w-[250px] shrink-0">
                      <button
                        ref={(element) => {
                          cardRefs.current[entry.id] = element;
                        }}
                        type="button"
                        onClick={() => setActiveId(entry.id)}
                        className={`group relative flex h-full w-full flex-col rounded-[10px] border bg-[var(--panel-bg)] px-4 pb-4 pt-4 text-left transition-colors ${
                          isActive
                            ? "border-[color:var(--border-strong)]"
                            : "border-[color:var(--border-soft)] hover:bg-[var(--panel-subtle)]"
                        }`}
                        style={{ scrollSnapAlign: "center" }}
                      >
                        <div className="mb-10">
                          <div className="overflow-hidden rounded-[8px] border border-[color:var(--border-soft)] bg-[var(--panel-subtle)]">
                            {visuals.hero ? (
                              <img
                                src={visuals.hero}
                                alt={visuals.heroAlt}
                                className="h-[132px] w-full object-cover"
                              />
                            ) : (
                              <div
                                className="flex h-[132px] items-end px-4 py-4"
                                style={{
                                  backgroundImage: `linear-gradient(180deg, ${(era?.color || "#171717")}2f 0%, transparent 100%)`,
                                }}
                              >
                                <p className="font-[var(--font-display)] text-[38px] leading-none tracking-[-0.06em] text-[var(--text-primary)]">
                                  {getEntryYear(entry)}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between gap-3">
                            <span className="text-[12px] text-[var(--text-muted)]">
                              {getEntryYear(entry)}
                            </span>
                            <span
                              className="h-[3px] w-10 rounded-full"
                              style={{ backgroundColor: era?.color || "var(--text-primary)" }}
                              aria-hidden="true"
                            />
                          </div>

                          <h3 className="mt-4 font-[var(--font-display)] text-[28px] leading-[1] tracking-[-0.04em] text-[var(--text-primary)]">
                            {entry.label}
                          </h3>
                          <p className="mt-3 text-sm leading-6 text-[var(--text-primary)]">
                            {entry.headline}
                          </p>
                        </div>

                        <div className="mt-auto">
                          <div className="absolute bottom-[34px] left-6 h-[42px] w-px bg-[color:var(--border-soft)]" />
                          <span
                            className={`absolute bottom-[28px] left-[19px] h-[13px] w-[13px] rounded-full border ${
                              isActive
                                ? "border-[color:var(--border-strong)]"
                                : "border-[color:var(--border-soft)]"
                            }`}
                            style={{
                              backgroundColor: isActive ? era?.color || "var(--text-primary)" : "var(--panel-bg)",
                            }}
                            aria-hidden="true"
                          />

                          <div className="flex flex-wrap items-center gap-2 text-[12px] text-[var(--text-muted)]">
                            <span>{getTypeLabel(entry)}</span>
                            <span aria-hidden="true">/</span>
                            <span>{product?.displayName || product?.name || entry.label}</span>
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </section>
      ) : null}
    </section>
  );
}

export default AbletonTimelinePage;
