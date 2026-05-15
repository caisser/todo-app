'use client'

import { InputHTMLAttributes } from 'react'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  labelAction?: React.ReactNode
}

export function TextField({ id, label, labelAction, className = '', ...props }: TextFieldProps) {
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
        className={`w-full border-0 border-b border-brand-outline-variant bg-transparent py-sm font-body-md text-brand-on-surface placeholder:text-brand-secondary outline-none transition-colors focus:border-brand-primary ${className}`}
        {...props}
      />
    </div>
  )
}
