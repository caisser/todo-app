'use client';

export function AddTaskButton() {
  return (
    <button
      type="button"
      className="hidden md:flex items-center gap-xs bg-brand-primary text-brand-on-primary px-md py-xs rounded-lg font-body-md transition-all hover:opacity-90 active:scale-[0.98]"
    >
      <span
        aria-hidden="true"
        className="material-symbols-outlined"
        style={{ fontSize: '18px', fontVariationSettings: "'FILL' 0, 'wght' 300" }}
      >
        add
      </span>
      Add Task
    </button>
  );
}
