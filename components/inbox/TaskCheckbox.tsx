'use client';

interface TaskCheckboxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function TaskCheckbox({ id, checked, onChange }: TaskCheckboxProps) {
  return (
    <label
      htmlFor={id}
      className={`relative inline-flex h-[1.25em] w-[1.25em] flex-shrink-0 cursor-pointer items-center justify-center rounded-[2px] border-[1.5px] transition-colors ${
        checked ? 'bg-brand-primary border-brand-primary' : 'border-brand-outline bg-transparent'
      }`}
    >
      <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span
        aria-hidden="true"
        style={{
          transform: checked ? 'scale(1)' : 'scale(0)',
          transition: 'transform 120ms ease-in-out',
          clipPath: 'polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0, 43% 62%)',
        }}
        className="block h-[0.75em] w-[0.75em] bg-brand-on-primary"
      />
    </label>
  );
}
