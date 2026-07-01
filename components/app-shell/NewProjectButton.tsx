export function NewProjectButton() {
  return (
    <button
      type="button"
      className="mt-auto flex w-full items-center justify-center gap-xs rounded-lg border border-brand-outline-variant py-xs px-sm font-body-md text-brand-primary transition-colors hover:bg-brand-surface-container-low"
    >
      <span
        aria-hidden="true"
        className="material-symbols-outlined"
        style={{ fontSize: '18px', fontVariationSettings: "'FILL' 0, 'wght' 300" }}
      >
        add
      </span>
      New Project
    </button>
  );
}
