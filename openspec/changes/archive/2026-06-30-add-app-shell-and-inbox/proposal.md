## Why

After registration and login, users currently have no authenticated destination in the app — there is no shared shell chrome, no protected route group, and no first-screen experience. This change introduces the persistent app shell (side nav, top nav, mobile FAB) and the Inbox screen users land on after signing in, and wires up the Supabase session handshake so protected routes actually gate on auth.

## What Changes

- Add an authenticated route group `app/(app)/` with a shared server-rendered shell layout (`SideNavBar`, `TopNavBar`, `MobileFAB`, `MainContent`).
- Add the Inbox screen at `app/(app)/inbox/page.tsx` displaying tasks grouped by priority (High Priority / Other Tasks) with mock data (persistence is out of scope).
- Add Next.js `middleware.ts` that reads the Supabase session on every request and redirects unauthenticated users away from `/(app)` routes and authenticated users away from `/login` and `/register`.
- Read the current user session in `app/(app)/layout.tsx` via the Supabase server client and pass avatar/email data to the shell.
- Add a sign-out Server Action invoked from the shell that calls `supabase.auth.signOut()` and redirects to `/login`.
- **BREAKING** Migrate `app/login/page.tsx` from client-only `useState` to a Server Action that calls `supabase.auth.signInWithPassword(...)` and redirects to `/inbox` on success (matches the `app/register/actions.ts` pattern).
- Update `app/register/actions.ts` (or its redirect target) so post-registration success also lands on `/inbox`.

## Capabilities

### New Capabilities
- `app-shell`: Persistent authenticated chrome — desktop side nav, top nav, mobile hamburger + FAB, `MainContent` container, `UserAvatar`, `NewProjectButton`, sign-out action.
- `inbox-screen`: First post-login content screen that displays tasks grouped into "High Priority" and "Other Tasks" with checkbox, title, due date, and project tag per row.
- `route-protection`: Middleware + server-side session read that enforces `/(app)` routes require an authenticated Supabase session and that `/login` / `/register` redirect to `/inbox` when a session already exists.

### Modified Capabilities
- `login-screen`: Replace the stub submit handler with a Server Action that authenticates against Supabase and redirects to `/inbox` on success; surface inline server-returned error messages on failure.

## Impact

- **Code**: New `app/(app)/layout.tsx`, `app/(app)/inbox/page.tsx`, `middleware.ts`, `components/app-shell/*` (SideNavBar, TopNavBar, MobileFAB, NavItem, UserAvatar, NewProjectButton), `components/inbox/*` (TaskGroup, TaskRow, TaskCheckbox), plus a sign-out Server Action and updated `app/login/{actions.ts,page.tsx}`.
- **APIs**: New Supabase Auth flow endpoints exercised — `signInWithPassword`, `signOut`, server-side `getUser()`; no new HTTP routes exposed by the app itself.
- **Dependencies**: Uses already-installed `@supabase/ssr` and existing `libs/supabase/{client,server}.ts` clients; no new packages.
- **Routing**: All authenticated screens now live under the `/(app)` route group; `/inbox` becomes the canonical landing route after auth. Existing `/login` and `/register` behavior changes (they now redirect if a session is present).
- **Design tokens**: Consumes existing `brand-*` Tailwind tokens defined in `DESIGN.md`; no token additions required.
