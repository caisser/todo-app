'use client';

import { useState } from 'react';

export function DesktopSearch() {
  const [value, setValue] = useState('');

  return (
    <div className="hidden md:flex items-center gap-xs max-w-md w-full border-b border-brand-outline-variant focus-within:border-brand-primary transition-colors">
      <span
        aria-hidden="true"
        className="material-symbols-outlined text-brand-on-surface-variant"
        style={{ fontSize: '20px', fontVariationSettings: "'FILL' 0, 'wght' 300" }}
      >
        search
      </span>
      <input
        type="search"
        aria-label="Search tasks"
        placeholder="Search tasks"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full border-0 bg-transparent py-xs font-body-md text-brand-primary placeholder:text-brand-outline outline-none"
      />
    </div>
  );
}
