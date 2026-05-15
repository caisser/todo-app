'use client';

import { useActionState } from 'react';
import { TextField } from '@/components/ui/TextField';
import { type RegisterState, registerUser } from './actions';

const initialState: RegisterState = {};

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerUser, initialState);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-brand-surface-container-low px-sm">
      {/* Auth card */}
      <div className="w-full max-w-105 overflow-hidden rounded-lg border border-brand-outline-variant bg-brand-surface-container-lowest shadow-[0px_10px_30px_rgba(0,0,0,0.04)]">
        {/* Brand header */}
        <div className="p-lg md:p-xl text-center">
          <span
            aria-hidden="true"
            className="material-symbols-outlined text-brand-on-surface"
            style={{ fontSize: '48px', fontVariationSettings: "'FILL' 0, 'wght' 300" }}
          >
            check_box
          </span>
          <h1 className="font-headline-md font-semibold text-brand-on-surface mb-0 mt-md">Crear cuenta</h1>
          <p className="font-body-md text-brand-on-surface-variant mt-xs">Únete a Monochrome Task System</p>
        </div>

        <hr className="border-brand-outline-variant" />

        {/* Form */}
        <div className="p-lg md:p-xl">
          <form action={formAction} noValidate>
            <div className="space-y-md">
              <TextField
                name="full_name"
                label="Nombre completo"
                type="text"
                placeholder="John Doe"
                autoComplete="name"
                error={state.errors?.fullName}
              />
              <TextField
                name="email"
                label="Correo electrónico"
                type="email"
                placeholder="email@example.com"
                autoComplete="email"
                error={state.errors?.email}
              />
              <TextField
                name="password"
                label="Contraseña"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                error={state.errors?.password}
              />
            </div>

            {state.errors?.global && (
              <div className="mt-md">
                <p className="font-body-md text-brand-error">{state.errors.global}</p>
                <a
                  href="/login"
                  className="font-body-md text-brand-primary underline underline-offset-4 decoration-1 hover:opacity-70 transition-opacity"
                >
                  Iniciar sesión
                </a>
              </div>
            )}

            <div className="pt-md">
              <button
                type="submit"
                disabled={isPending}
                className="w-full rounded bg-brand-primary py-sm font-headline-sm font-medium text-brand-on-primary transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isPending ? 'Registrando...' : 'Registrarse'}
              </button>
            </div>
          </form>
        </div>

        <hr className="border-brand-outline-variant" />

        {/* Sign-in link */}
        <div className="p-lg md:p-xl text-center">
          <p className="font-body-md text-brand-on-surface-variant">¿Ya tienes una cuenta?</p>
          <a
            href="/login"
            className="font-headline-sm font-medium text-brand-primary transition-opacity hover:underline hover:underline-offset-4 hover:decoration-1"
          >
            Iniciar sesión
          </a>
        </div>
      </div>

      {/* Version label */}
      <span className="mt-lg font-label-caps text-brand-on-surface opacity-40">TASKFOCUS V.1.0</span>
    </main>
  );
}
