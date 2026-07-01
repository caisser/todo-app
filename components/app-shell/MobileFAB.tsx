'use client';

export function MobileFAB() {
  return (
    <button
      type="button"
      aria-label="Add task"
      className="md:hidden fixed bottom-6 right-6 h-14 w-14 rounded-full bg-brand-primary text-brand-on-primary shadow-[0px_10px_30px_rgba(0,0,0,0.1)] z-50 flex items-center justify-center transition-transform active:scale-[0.95]"
    >
      <span
        aria-hidden="true"
        className="material-symbols-outlined"
        style={{ fontSize: '24px', fontVariationSettings: "'FILL' 0, 'wght' 300" }}
      >
        add
      </span>
    </button>
  );
}
