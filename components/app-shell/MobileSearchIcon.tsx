export function MobileSearchIcon() {
  return (
    <button
      type="button"
      aria-label="Search tasks"
      className="md:hidden inline-flex items-center justify-center rounded p-xs text-brand-on-surface-variant transition-colors hover:bg-brand-surface-container-low"
    >
      <span
        aria-hidden="true"
        className="material-symbols-outlined"
        style={{ fontSize: '24px', fontVariationSettings: "'FILL' 0, 'wght' 300" }}
      >
        search
      </span>
    </button>
  );
}
