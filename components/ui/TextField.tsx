'use client';

import type { InputHTMLAttributes } from 'react';
import { useId } from 'react';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  labelAction?: React.ReactNode;
  error?: string;
}

export function TextField({ label, labelAction, error, className = '', ...props }: TextFieldProps) {
  const generatedId = useId();
  const id = props.id ?? generatedId;
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-xs">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="font-label-caps font-medium text-brand-secondary">
          {label}
        </label>
        {labelAction}
      </div>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`w-full border-0 border-b border-brand-outline-variant bg-transparent py-sm font-body-md text-brand-on-surface placeholder:text-brand-secondary outline-none transition-colors focus:border-brand-primary ${error ? 'border-brand-error' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p id={errorId} role="alert" className="font-label-caps text-brand-error">
          {error}
        </p>
      )}
    </div>
  );
}
