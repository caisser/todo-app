## Context

The app currently has two public screens (`/login`, `/register`) and no authenticated experience. `libs/supabase/server.ts` and `libs/supabase/client.ts` are both implemented but the app never reads the session at request time — there is no middleware and no protected layout. The login page is client-only with a `// TODO: wire Supabase Auth` stub.

The design has been fully specified in `tmp/pending/layout-and-inbox.md` (SDD): a fixed 256px `SideNavBar` on desktop, a 64px `TopNavBar` at all breakpoints, a mobile FAB, and an Inbox screen showing two priority-grouped task lists. All visual tokens already exist in `DESIGN.md` under the `brand-*` Tailwind namespace.

Stakeholders: the user (David) is transitioning the project from design into build; the register flow was recently completed as the pattern reference (`app/register/actions.ts` + `useActionState`).

## Goals / Non-Goals

**Goals:**
- Serve `/inbox` as a protected server-rendered page inside a route group that shares a persistent shell.
- Enforce auth at the middleware boundary so a logged-out user cannot reach any `/(app)` route, and a logged-in user is bounced from `/login` / `/register` to `/inbox`.
- Migrate `/login` to the `useActionState` + Server Action pattern already used by `/register`.
- Read the Supabase session once at the layout level and pass a minimal user object (email, avatar url) down to shell components — avoid re-querying in each child.
- Render Inbox task rows with mock data behind a single, easy-to-remove seam so the persistence layer can be plugged in later without restructuring the components.

**Non-Goals:**
- Real task persistence (Supabase mutations for check/uncheck, create task).
- The mobile sidebar drawer, the user-avatar dropdown menu, and the Add Task creation flow — all called out as separate designs in the SDD.
- Any new nav destinations beyond Inbox (Today / Upcoming / Projects nav items link to `#`).
- Password reset, OAuth providers, or email verification flows.

## Decisions

### 1. Route group `app/(app)/` for authenticated screens
The Next.js route group syntax lets us share `layout.tsx` (the shell) across every authenticated screen without a URL-visible segment. Alternative: a top-level `/app` prefix — rejected because it pollutes URLs (`/app/inbox` vs `/inbox`) and forces us to rewrite every future protected route. The route group scales cleanly as we add Today, Upcoming, Projects.

### 2. Auth enforced in `middleware.ts` (not per-page)
A single Next.js middleware runs on every request, calls the Supabase server client's `getUser()` (which refreshes the session cookie as a side effect), and decides:
- No session + path under `/(app)` (i.e., matcher-matched protected paths) → `NextResponse.redirect('/login')`.
- Session present + path is `/login` or `/register` → `NextResponse.redirect('/inbox')`.
- Otherwise → `NextResponse.next()` with the refreshed cookie.

Alternative considered: per-page `getUser()` + redirect in each Server Component. Rejected — it duplicates the check, misses static assets refresh timing, and Supabase's SSR docs specifically call out middleware as the correct place to refresh the auth cookie.

The `layout.tsx` still calls `getUser()` server-side (defense in depth + it needs the user object for the avatar), but treats a missing user as an unreachable state and hard-redirects.

### 3. Session hydration: layout fetches, components consume via props
`app/(app)/layout.tsx` is a Server Component that awaits `supabase.auth.getUser()` once and passes `{ email, avatarUrl }` into `SideNavBar` / `TopNavBar`. Alternative: a React Context provider — unnecessary here because the shell is server-rendered and the shape is stable per request. Props keep the components pure and testable and dodge the client-boundary "provider" ceremony.

### 4. Sign-out is a Server Action, not a client fetch
A `signOut` Server Action lives in `app/(app)/actions.ts`, calls `supabase.auth.signOut()`, and `redirect('/login')`. It is invoked from a small `<form action={signOut}>` in the shell (or avatar dropdown when that ships). Alternative: client-side `supabase.auth.signOut()` in a click handler — rejected because it requires the browser client to also clear cookies and doesn't guarantee the redirect happens before rehydration; the Server Action version is atomic and hits the same cookie writer as login.

### 5. Login migration mirrors the register pattern exactly
The `login` action returns `{ error?: string }` and is consumed by `useActionState` on the (still client) page. Success calls `redirect('/inbox')` — which throws inside the action, so no return is needed on the success path. This matches `app/register/actions.ts` line-for-line, minimizing cognitive load and keeping test coverage patterns identical.

### 6. Inbox uses mock data behind a single fetch seam
The Inbox page imports `getInboxTasks()` from `app/(app)/inbox/data.ts`, which currently returns a hardcoded array shaped like the future DB row. When persistence lands, only this file changes. Alternative: inline the array in the page — rejected because it couples the component to the data shape and forces a refactor at swap-time.

### 7. Component layout
```
components/
  app-shell/
    SideNavBar.tsx           (server)
    NavItem.tsx              (client — needs pathname for active state)
    NewProjectButton.tsx     (server, no-op onClick — future)
    TopNavBar.tsx            (server)
    MobileHamburger.tsx      (client — will open drawer later)
    DesktopSearch.tsx        (client — controlled input)
    AddTaskButton.tsx        (client — future onClick)
    UserAvatar.tsx           (server)
    MobileFAB.tsx            (client — future onClick)
    SignOutButton.tsx        (client — wraps the Server Action form)
  inbox/
    TaskGroup.tsx            (server)
    TaskRow.tsx              (client — checkbox toggle is local state for now)
    TaskCheckbox.tsx         (client, controlled)
```
Rationale: default to Server Components, mark client only where interaction requires it. `NavItem` needs `usePathname()` so it must be client, but its parent list stays server-rendered.

### 8. Active nav item uses `usePathname()`
`NavItem` compares its `href` against `usePathname()` and applies the active styling + `aria-current="page"` accordingly. Icon fill is toggled via `font-variation-settings: 'FILL' 1` inline style on the active variant.

### 9. Middleware matcher
```
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)']
}
```
Standard Supabase SSR recipe — excludes static assets so we don't pay the auth roundtrip for every image. Login/register redirect logic lives inside the middleware function itself, not the matcher.

## Risks / Trade-offs

- **[Risk] Middleware auth check on every dynamic request adds latency** → Mitigation: `getUser()` uses Supabase's local JWT verification path when the cookie is fresh; only expired sessions round-trip to Supabase. Acceptable at this app's scale.
- **[Risk] Server-side `getUser()` in the layout duplicates the middleware check** → Mitigation: cheap when cookie is fresh; kept as defense-in-depth so that any future middleware misconfiguration doesn't leak the shell to unauthenticated users.
- **[Risk] `NavItem` becoming a client component forces the sidebar list into a client boundary** → Mitigation: only `NavItem` itself is `'use client'`; the sidebar container remains server-rendered and simply passes children — verified this pattern works in Next 16.
- **[Trade-off] Mock data in `getInboxTasks()` means the Inbox is not visually "empty state" testable** → Accepted. The empty state is a separate concern that will land with real persistence; documenting the future swap point (`data.ts`) makes the boundary explicit.
- **[Trade-off] Sign-out as a form + Server Action requires a small client wrapper (`SignOutButton`) to render the button styling and disable-during-pending UX** → Accepted; matches the login/register pattern.
- **[Risk] Route group naming collision if we ever add a `(marketing)` group** → Not a real risk today; noting for future.
