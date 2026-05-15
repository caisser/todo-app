## Why

The user registration flow has several correctness and code-quality issues surfaced in PR #2 review: silent failure when Supabase email confirmation is required, fragile error-string matching, missing password minimum-length validation, and plain `<a>` tags that cause full page reloads in a client component. These need to be fixed before the branch is merged.

## What Changes

- Add a confirmation-pending state: after a successful `signUp` with no session, return an info message instructing the user to check their email instead of redirecting to `/`
- Replace string-matching on Supabase error messages with `error.code` / `error.status` checks for stable error detection
- Add a `password.length < 6` guard in the server action to surface a consistent validation error before hitting Supabase
- Replace `<a href="/login">` anchors with Next.js `<Link>` to avoid full-page reloads
- Remove the duplicate "Iniciar sesión" anchor inside the global error block (the static bottom link is sufficient)
- Tighten the `.env` read hook so it blocks `.env` / `.env.local` but not `.env.example`

## Capabilities

### New Capabilities
<!-- none — all changes are corrections to the existing registration flow -->

### Modified Capabilities
- `user-registration`: email-confirmation feedback, validation rules, error-code handling, and navigation anchors are all changing

## Impact

- `app/register/actions.ts` — server action logic
- `app/register/page.tsx` — UI component
- `scripts/read_hook.js` — Claude hook script
