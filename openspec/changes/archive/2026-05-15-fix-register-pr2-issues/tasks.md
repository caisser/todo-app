## 1. Server Action Fixes (`app/register/actions.ts`)

- [x] 1.1 Add `password.length < 6` validation guard that returns an inline field error before calling Supabase
- [x] 1.2 Replace substring matching on `error.message` with `error.code === 'user_already_exists'` (fallback: `error.status === 422`) for duplicate-account detection
- [x] 1.3 After `supabase.auth.signUp()`, check `!error && !data.session` and return `{ info: 'Check your email to confirm your account.' }` instead of redirecting

## 2. Page Component Fixes (`app/register/page.tsx`)

- [x] 2.1 Import `Link` from `next/link` and replace both `<a href="/login">` anchors with `<Link href="/login">`
- [x] 2.2 Remove the duplicate "Iniciar sesión" anchor inside the global error block, keeping only the error message text
- [x] 2.3 Handle the new `info` return shape from the server action — render an informational message (distinct from error styling) when `info` is present

## 3. Hook Fix (`scripts/read_hook.js`)

- [x] 3.1 Replace the `.env` path check so it blocks only `.env` (exact suffix) and `.env.local` (substring), leaving `.env.example` readable
