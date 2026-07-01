'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { TextField } from '@/components/ui/TextField';
import { type LoginState, login } from './actions';

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, initialState);

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
        <p className="mt-xs font-label-caps font-medium text-brand-secondary">Monochrome Task System</p>
      </div>

      {/* Login card */}
      <div className="w-full max-w-100 rounded-lg bg-brand-surface-container-lowest p-lg shadow-none transition-shadow hover:shadow-[0px_10px_30px_rgba(0,0,0,0.04)]">
        <form action={formAction} noValidate>
          <TextField name="email" label="Email" type="email" placeholder="nombre@compania.com" autoComplete="email" />

          <div className="mt-md">
            <TextField
              name="password"
              label="Contraseña"
              type="password"
              autoComplete="current-password"
              labelAction={
                <Link
                  href="/forgot-password"
                  className="font-label-caps font-medium text-brand-primary transition-opacity hover:opacity-70"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              }
            />
          </div>

          {state.error && (
            <p role="alert" className="mt-md font-body-md text-brand-error">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="mt-md w-full rounded bg-brand-primary py-sm font-body-lg font-semibold text-brand-on-primary transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>

          <Link
            href="/register"
            className="mt-sm flex w-full items-center justify-center rounded border border-brand-primary py-sm font-body-lg font-semibold text-brand-primary transition-all hover:bg-brand-surface-container-low active:scale-[0.98]"
          >
            Crear cuenta
          </Link>
        </form>
      </div>

      {/* Decorative background — presentational only */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-0 left-0 right-0 h-72 bg-linear-to-t from-brand-surface-container to-transparent opacity-20 blur-3xl"
      />
    </main>
  );
}
