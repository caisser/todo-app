'use client'

import { FormEvent, useState } from 'react'
import { TextField } from '@/components/ui/TextField'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    // TODO: wire Supabase Auth
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-brand-background px-gutter">
      {/* Branding */}
      <div className="flex flex-col items-center mb-xl">
        <div className="mb-md flex h-12 w-12 items-center justify-center rounded-lg bg-brand-primary">
          <span
            aria-hidden="true"
            className="material-symbols-outlined text-brand-on-primary"
            style={{ fontSize: '24px', fontVariationSettings: "'FILL' 1, 'wght' 300" }}
          >
            task_alt
          </span>
        </div>
        <h1 className="font-headline-lg font-semibold text-brand-primary">Tasks</h1>
        <p className="mt-xs font-label-caps font-medium text-brand-secondary">
          Monochrome Task System
        </p>
      </div>

      {/* Login card */}
      <div className="w-full max-w-[400px] rounded-lg bg-brand-surface-container-lowest p-lg shadow-none transition-shadow hover:shadow-[0px_10px_30px_rgba(0,0,0,0.04)]">
        <form onSubmit={handleSubmit} noValidate>
          <TextField
            id="email"
            label="Email"
            type="email"
            placeholder="nombre@compania.com"
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <div className="mt-md">
            <TextField
              id="password"
              label="Contraseña"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              labelAction={
                <a
                  href="#"
                  className="font-label-caps font-medium text-brand-primary transition-opacity hover:opacity-70"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              }
            />
          </div>

          <button
            type="submit"
            className="mt-md w-full rounded bg-brand-primary py-sm font-body-lg font-semibold text-brand-on-primary transition-all hover:opacity-90 active:scale-[0.98]"
          >
            Iniciar Sesión
          </button>

          <a
            href="#"
            className="mt-sm flex w-full items-center justify-center rounded border border-brand-primary py-sm font-body-lg font-semibold text-brand-primary transition-all hover:bg-brand-surface-container-low active:scale-[0.98]"
          >
            Crear cuenta
          </a>
        </form>
      </div>

      {/* Decorative background — presentational only */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-0 left-0 right-0 h-72 bg-gradient-to-t from-brand-surface-container to-transparent opacity-20 blur-3xl"
      />
    </main>
  )
}
