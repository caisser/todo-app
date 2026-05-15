## Context

The app currently has no account creation flow. The Stitch SDD (`tmp/Pantalla-de-Registro.md`) defines the full visual spec for the registration screen. Supabase Auth (`@supabase/ssr`) is planned but not yet installed; this change installs it and uses it to create new users. All mutations go through Server Actions per project conventions.

## Goals / Non-Goals

**Goals:**
- Render the `/register` page matching the Stitch SDD exactly (fonts, spacing, tokens, card layout)
- Collect full name, email, and password; submit via a `registerUser` Server Action
- Handle loading state (disabled button), field validation errors (inline, `error` token `#ba1a1a`), and post-registration redirect
- Install and configure `@supabase/ssr` with browser and server clients

**Non-Goals:**
- Email verification flow (Supabase handles this async; out of scope for now)
- OAuth / social sign-in
- Password strength indicator or complexity rules beyond what Supabase enforces
- Server-side redirect guard (already-authenticated users hitting `/register`)

## Decisions

### 1. Server Action for form submission (not Route Handler)
Server Actions are the project standard for mutations. The form's `action` prop will point to `registerUser` defined in `app/register/actions.ts`. This keeps the form progressively enhanced and avoids a client-side fetch wrapper.

*Alternative considered:* API Route Handler — rejected because it requires a client-side `fetch` call, adds boilerplate, and bypasses the project's Server Action convention.

### 2. Supabase `auth.signUp()` for user creation
`signUp` creates the Auth user and optionally stores extra metadata (full name). The full name is passed via `options.data` as user metadata, which Supabase stores in `auth.users.raw_user_meta_data`.

*Alternative considered:* Insert directly into a `profiles` table — deferred; the profiles table doesn't exist yet. Name metadata can be migrated later.

### 3. Inline validation errors via `useFormState` / `useActionState`
React 19's `useActionState` hook pairs with Server Actions to return structured error objects (field-level). The form re-renders with errors below affected fields styled in `error` color.

### 4. Install `@supabase/ssr` (not `@supabase/supabase-js` directly)
`@supabase/ssr` is the Supabase-recommended package for Next.js App Router; it handles cookie-based session management correctly in both Server Components and Server Actions.

## Risks / Trade-offs

- **Supabase not yet installed** → Must `pnpm add @supabase/ssr` and set env vars before the action works. Local dev requires a `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- **Full name stored as auth metadata** → If a `profiles` table is added later, a migration or trigger will be needed to sync metadata. Acceptable now given the MVP scope.
- **No redirect guard** → An authenticated user visiting `/register` will not be redirected. Low-risk for now; middleware can add this later.
