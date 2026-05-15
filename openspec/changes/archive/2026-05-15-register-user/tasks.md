## 1. Dependencies & Configuration

- [x] 1.1 Install `@supabase/ssr` with pnpm
- [x] 1.2 Create `libs/supabase/client.ts` (browser Supabase client)
- [x] 1.3 Create `libs/supabase/server.ts` (server Supabase client using cookies)
- [x] 1.4 Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local` (document required vars in README or `.env.example`)

## 2. Server Action

- [x] 2.1 Create `app/register/actions.ts` with `registerUser` Server Action
- [x] 2.2 Implement input validation (required fields, email format) returning field-level errors
- [x] 2.3 Call `supabase.auth.signUp()` with email, password, and full name in user metadata
- [x] 2.4 Handle "email already registered" error from Supabase and return a structured error
- [x] 2.5 On success, redirect to the app home (e.g., `/`)

## 3. Registration Page & Form

- [x] 3.1 Create `app/register/page.tsx` — full-page layout, no TopAppBar or BottomNavBar
- [x] 3.2 Build the auth card: brand icon (`check_box`), title "Crear cuenta", subtitle "Únete a Monochrome Task System"
- [x] 3.3 Add full name, email, and password inputs with bottom-border-only styling and `label-caps` labels matching the SDD tokens
- [x] 3.4 Wire the form to `registerUser` via `useActionState` (React 19) to handle pending and error states
- [x] 3.5 Disable the submit button and show a loading indicator while the action is pending
- [x] 3.6 Render inline field-level validation errors below affected inputs in `error` color (`#ba1a1a`)
- [x] 3.7 Render global error message (e.g., "email already in use") near the submit button
- [x] 3.8 Add the "¿Ya tienes una cuenta? Iniciar sesión" section below the divider, linking to `/login`
- [x] 3.9 Add "TASKFOCUS V.1.0" version label below the card at 40% opacity

## 4. Polish & Verification

- [x] 4.1 Verify all typography tokens match the SDD (Manrope headlines, Inter body, JetBrains Mono labels)
- [x] 4.2 Verify spacing tokens match the SDD (card padding, field gaps, divider margins)
- [x] 4.3 Verify responsive behavior: `p-lg` on mobile, `p-xl` on `md+`; card max-width `420px` centered
- [x] 4.4 Verify input focus state: bottom border darkens to `#1a1c1d`, no outline ring
- [x] 4.5 Run `pnpm build` to confirm no type or compile errors
