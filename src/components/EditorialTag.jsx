function EditorialTag({ children, className = "" }) {
  return (
    <span
      className={`inline-flex min-h-7 items-center rounded-tag border border-[color:var(--border-soft)] px-2.5 text-label text-[var(--text-muted)] ${className}`.trim()}
    >
      {children}
    </span>
  );
}

export default EditorialTag;
