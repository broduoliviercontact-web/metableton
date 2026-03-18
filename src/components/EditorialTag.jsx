function EditorialTag({ children, className = "" }) {
  return (
    <span
      className={`inline-flex min-h-7 items-center rounded-[8px] border border-[color:var(--border-soft)] px-2.5 text-[12px] text-[var(--text-muted)] ${className}`.trim()}
    >
      {children}
    </span>
  );
}

export default EditorialTag;
