'use client';

import { useFormStatus } from 'react-dom';
import { signOut } from '@/app/(app)/actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-xs rounded-lg py-xs px-sm font-body-md text-brand-secondary transition-colors hover:bg-brand-surface-container-low disabled:opacity-60"
    >
      <span
        aria-hidden="true"
        className="material-symbols-outlined"
        style={{ fontSize: '18px', fontVariationSettings: "'FILL' 0, 'wght' 300" }}
      >
        logout
      </span>
      {pending ? 'Signing out…' : 'Sign out'}
    </button>
  );
}

export function SignOutButton() {
  return (
    <form action={signOut}>
      <SubmitButton />
    </form>
  );
}
