## Context

The registration flow (`app/register/`) was implemented in PR #2. A code review surfaced correctness and code-quality issues that need to be addressed before merge: no feedback when Supabase email confirmation is pending, fragile error-string matching, missing password minimum-length check, `<a>` tags instead of `<Link>`, a duplicate sign-in anchor in the error state, and an overly broad `.env` read hook.

All fixes are scoped to three files. There are no new dependencies, no data model changes, and no migrations needed.

## Goals / Non-Goals

**Goals:**
- Correct silent failure when Supabase email confirmation is required
- Replace string-based Supabase error detection with `error.code` / `error.status`
- Enforce 6-character password minimum client-side before hitting Supabase
- Replace plain `<a>` navigation with Next.js `<Link>` for SPA navigation
- Remove duplicate sign-in anchor from the global error block
- Tighten the `.env` hook regex to allow `.env.example`

**Non-Goals:**
- Restyling the registration card
- Adding new form fields
- Changes to Supabase project configuration (email confirmation settings)
- Changes to the login screen

## Decisions

**Email confirmation check via `data.session` (not `error`)**
After `supabase.auth.signUp()`, a `null` session with no error means Supabase accepted the signup but email confirmation is pending. Checking `!error && !data.session` is the idiomatic Supabase pattern and does not depend on error message strings.

**Error detection via `error.code` over `error.status`**
Supabase Auth v2 returns typed error codes (e.g. `'user_already_exists'`) on the `AuthError` object. Prefer `error.code` as the primary check; fall back to `error.status === 422` only if the code is absent. This is more stable than substring matching on `error.message`.

**Password minimum length in the Server Action, not just the client**
The server action is the authoritative validation boundary. A `password.length < 6` guard there ensures the Supabase 6-character minimum is surfaced consistently regardless of how the form is submitted.

**`<Link>` from `next/link`**
The register page is already a `'use client'` component. Swapping `<a>` for `<Link>` requires no architectural change and prevents full page reloads.

**Remove duplicate sign-in anchor, not the error message**
The error message copy is valuable context for the user; only the redundant navigation anchor inside the error block should be removed.

**Hook: exact suffix and substring matching**
Using `readPath.endsWith('.env') || readPath.includes('.env.local')` blocks the files that actually contain secrets while leaving `.env.example` readable.

## Risks / Trade-offs

- **Confirmation info state** → The action now has three return shapes: `{ error }`, `{ info }`, and implicit redirect. The page must handle all three. → Keep the type explicit and render `info` alongside `error` states.
- **`error.code` availability** → Older Supabase client versions may not expose `error.code`. → The project already uses `@supabase/ssr`; verify the installed version exposes `AuthError.code` before removing the string fallback entirely.
