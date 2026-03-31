import {
  DEFAULT_BLOCK_ALIGN,
  DEFAULT_IMAGE_ZOOM,
  clampZoom,
  formatImagePosition,
  parseImagePosition,
} from "./editorUtils";

export function Field({ label, help, children }) {
  return (
    <label className="grid min-w-0 gap-2">
      <span className="text-label font-medium uppercase tracking-caps-wide text-[var(--text-muted)]">
        {label}
      </span>
      {children}
      {help ? (
        <span className="min-w-0 break-words text-ui leading-5 text-[var(--text-muted)]">
          {help}
        </span>
      ) : null}
    </label>
  );
}

export function TextInput(props) {
  return (
    <input
      {...props}
      className="h-10 w-full min-w-0 rounded-card border border-[color:var(--border-soft)] bg-[var(--panel-bg)] px-3 text-body text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[color:var(--border-strong)]"
    />
  );
}

export function TextareaInput(props) {
  return (
    <textarea
      {...props}
      className="min-h-[104px] w-full min-w-0 rounded-card border border-[color:var(--border-soft)] bg-[var(--panel-bg)] px-3 py-3 text-body leading-6 text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[color:var(--border-strong)]"
    />
  );
}

export function ImagePositionFields({ label = "Recadrage", position, onChange }) {
  const { x, y } = parseImagePosition(position);

  return (
    <div className="grid min-w-0 gap-3 rounded-card border border-[color:var(--border-soft)] bg-[var(--panel-muted)] p-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-label font-medium uppercase tracking-caps-wide text-[var(--text-muted)]">
          {label}
        </span>
        <span className="text-ui text-[var(--text-secondary)]">{formatImagePosition(x, y)}</span>
      </div>

      <label className="grid min-w-0 gap-2">
        <span className="text-ui text-[var(--text-secondary)]">Horizontal</span>
        <input
          type="range"
          className="range-field"
          min="0"
          max="100"
          step="1"
          value={x}
          onChange={(event) => onChange(formatImagePosition(event.target.value, y))}
        />
      </label>

      <label className="grid min-w-0 gap-2">
        <span className="text-ui text-[var(--text-secondary)]">Vertical</span>
        <input
          type="range"
          className="range-field"
          min="0"
          max="100"
          step="1"
          value={y}
          onChange={(event) => onChange(formatImagePosition(x, event.target.value))}
        />
      </label>
    </div>
  );
}

export function ImageZoomField({ value = DEFAULT_IMAGE_ZOOM, onChange }) {
  const zoom = clampZoom(value);

  return (
    <div className="grid min-w-0 gap-3 rounded-card border border-[color:var(--border-soft)] bg-[var(--panel-muted)] p-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-label font-medium uppercase tracking-caps-wide text-[var(--text-muted)]">
          Zoom
        </span>
        <span className="text-ui text-[var(--text-secondary)]">{Math.round(zoom * 100)}%</span>
      </div>

      <label className="grid min-w-0 gap-2">
        <span className="text-ui text-[var(--text-secondary)]">Niveau</span>
        <input
          type="range"
          className="range-field"
          min="1"
          max="2"
          step="0.01"
          value={zoom}
          onChange={(event) => onChange(clampZoom(event.target.value))}
        />
      </label>
    </div>
  );
}

export function AlignmentFields({ value = DEFAULT_BLOCK_ALIGN, onChange }) {
  const options = [
    { value: "left", label: "Gauche" },
    { value: "center", label: "Centre" },
    { value: "right", label: "Droite" },
  ];

  return (
    <div className="grid gap-2">
      <span className="text-label font-medium uppercase tracking-caps-wide text-[var(--text-muted)]">
        Alignement
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-label={`Aligner ${option.label.toLowerCase()}`}
              aria-pressed={isActive}
              className={`inline-flex h-9 items-center rounded-card border px-3 text-ui transition-colors ${
                isActive
                  ? "border-[color:var(--border-strong)] text-[var(--text-primary)]"
                  : "border-[color:var(--border-soft)] text-[var(--text-secondary)] hover:border-[color:var(--border-strong)] hover:text-[var(--text-primary)]"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function DisplayModeFields({ label, value, options, onChange }) {
  return (
    <div className="grid gap-2">
      <span className="text-label font-medium uppercase tracking-caps-wide text-[var(--text-muted)]">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-label={`${label} : ${option.label}`}
              aria-pressed={isActive}
              className={`inline-flex h-9 items-center rounded-card border px-3 text-ui transition-colors ${
                isActive
                  ? "border-[color:var(--border-strong)] text-[var(--text-primary)]"
                  : "border-[color:var(--border-soft)] text-[var(--text-secondary)] hover:border-[color:var(--border-strong)] hover:text-[var(--text-primary)]"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
