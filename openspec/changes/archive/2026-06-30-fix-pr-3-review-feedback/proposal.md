## Why

PR #3 shipped the app shell, inbox screen, and route protection, but code review surfaced one correctness blocker in the auth middleware and a set of smaller quality issues across the shell, inbox, and registration flow. The middleware bug can log users out prematurely when Supabase rotates refresh tokens mid-redirect, so it must be fixed before further work builds on the current auth gate.

## What Changes

- Preserve Supabase-mutated cookies on both redirect branches in `middleware.ts` so rotated refresh tokens survive redirects (**correctness fix**).
- Broaden the middleware matcher to skip common static assets (`.woff2`, `.css`, `.js`, `.ico`, fonts, `favicon.ico`) and avoid a Supabase `getUser()` round-trip on every asset request.
- Replace the duplicate `getUser()` call in `app/(app)/layout.tsx` with a cookie-only session read now that middleware already verified the user, cutting the per-navigation Auth call count in half.
- Narrow the `user_metadata.avatar_url` access in `app/(app)/layout.tsx` with a `typeof === 'string'` check instead of an unsafe cast, matching the boundary-validation guidance in `CLAUDE.md`.
- Remove the unused `open`/`setOpen` state and misleading `aria-expanded` from `MobileHamburger` until the mobile drawer is actually wired up.
- Fix the inbox heading hierarchy so the page has a single top-level `<h1>` (a11y).
- Move the `mt-xs` layout concern off `SignOutButton`'s form and onto the parent `SideNavBar`'s flex gap.
- Adjust `getInitials` in `UserAvatar` so the fallback for single-token emails returns real initials (e.g. first letter only), not `local.slice(0, 2)`.
- Add a `// TODO: wire mutation` note on `TaskRow` to make the intentionally non-persisted `checked` state obvious to readers.
- Tighten the register action's 422 catch-all (`app/register/actions.ts`) to trust `error.code` instead of matching on `error.status === 422`, so genuine validation errors (e.g. weak password) aren't masked.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `route-protection`: middleware must preserve Supabase-mutated cookies across redirects and skip static assets in its matcher.
- `app-shell`: layout must not double-call `getUser()`, must safely narrow untyped provider metadata, and interactive shell components must not expose state/ARIA that promises unimplemented behavior.
- `inbox-screen`: page must expose a single top-level `<h1>` for a11y.
- `user-registration`: duplicate-email detection must rely on Supabase's `error.code` rather than HTTP status code matching.

## Impact

- **Code:** `middleware.ts`, `app/(app)/layout.tsx`, `components/app-shell/MobileHamburger.tsx`, `components/app-shell/UserAvatar.tsx`, `components/app-shell/SideNavBar.tsx`, `components/app-shell/SignOutButton.tsx`, `components/inbox/PageHeader.tsx`, `components/inbox/TaskRow.tsx`, `app/register/actions.ts`.
- **APIs / dependencies:** none — no new packages, no schema changes, no public API changes.
- **User-visible behavior:** silent auth-session loss on token rotation stops; a11y improves with a proper `<h1>`; no other UI changes.
- **Performance:** fewer Supabase Auth round-trips per protected navigation and per static-asset request.
