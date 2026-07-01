# PR #3 Review — feat: add app shell, inbox screen, and route protection

**PR:** https://github.com/caisser/todo-app/pull/3
**Reviewer:** Code review pass
**Date:** 2026-06-30

## Overview

Adds the authenticated `(app)` route group with a responsive Side/Top nav shell and the Inbox screen backed by mock data. Introduces Supabase-backed middleware for route protection and migrates `/login` to a React 19 Server Action, mirroring the existing register flow. Also adds new OpenSpec artifacts for the shipped work.

Scope is coherent and code is well-factored — small single-purpose components, consistent Tailwind token usage, and correct Server/Client boundaries.

---

## Issues

### 🔴 Blocker — Middleware drops rotated Supabase cookies on redirect

**File:** `middleware.ts:36-41`

When `supabase.auth.getUser()` refreshes the session, the new cookies are written to `response` via the `setAll` callback. But both redirect branches build a fresh `NextResponse.redirect(...)` and return it, discarding those cookies. Per the Supabase SSR docs, redirects must carry over the cookies from the response Supabase mutated.

**Fix:**

```ts
if (!user && isProtected) {
  const redirect = NextResponse.redirect(new URL('/login', request.url));
  response.cookies.getAll().forEach((c) => redirect.cookies.set(c.name, c.value));
  return redirect;
}
```

Apply the same to the authenticated → `/inbox` branch. In practice this can log users out prematurely when the refresh token rotates during a redirect.

---

### 🟡 Dead state in `MobileHamburger`

**File:** `components/app-shell/MobileHamburger.tsx:6-13`

`open` is toggled but never used to render a drawer. Either wire up the mobile nav drawer or drop the state to avoid a misleading `aria-expanded` on a button that opens nothing.

---

### 🟡 Middleware matcher misses non-image static assets

**File:** `middleware.ts:48`

The regex excludes `_next/static`, `_next/image`, and image extensions, but every request for `.woff2`, `.css`, `.js` chunks, `.ico`, etc., still runs a Supabase `getUser()` round-trip. Broaden the negative lookahead:

```ts
matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf)$).*)']
```

Cuts per-request auth cost.

---

### 🟡 Double `getUser()` on every protected request

**File:** `app/(app)/layout.tsx:11-13`

Middleware already guarantees an authenticated `user` before the layout runs, yet the layout re-fetches to build `shellUser`. Fine as defense-in-depth, but note it doubles the Supabase Auth calls on every protected navigation. If you keep it, consider `getSession()` in the layout (uses the cookie directly, no network) since the trust boundary was already crossed in middleware.

---

### 🟡 Unsafe cast on `user_metadata.avatar_url`

**File:** `app/(app)/layout.tsx:21`

```ts
avatarUrl: (user.user_metadata?.avatar_url as string | undefined) ?? null,
```

Bypasses the fact that `user_metadata` is untyped provider input. A `typeof x === 'string' ? x : null` narrowing is safer and matches the boundary-validation guidance in `CLAUDE.md`.

---

## Nits

- **`getInitials` naming** (`components/app-shell/UserAvatar.tsx:6-12`) — falls back to `local.slice(0, 2)` which isn't really "initials" (`luisdavidcardona` → `LU`). Rename or adjust logic.
- **Task completion is not persisted** (`components/inbox/TaskRow.tsx:15`) — `checked` lives in `useState` and resets on navigation. Expected while API isn't wired, but a `// TODO: wire mutation` would prevent confusion.
- **Layout concern leaks into `SignOutButton`** (`components/app-shell/SignOutButton.tsx:28`) — `mt-xs` on the form belongs on the parent `SideNavBar`'s flex gap.
- **Heading hierarchy** (`components/inbox/PageHeader.tsx:4`) — page starts with `<h2>` and has no `<h1>`. Promote to `<h1>` for a11y.
- **Register 422 catch-all** (`app/register/actions.ts:47`) — `error.status === 422` is a broad match that could mask other validation failures (e.g. weak password). Prefer trusting `error.code` alone. (Note: pre-existing, not new in this PR.)

---

## Positive

- Clean atomic component decomposition in `components/app-shell/` and `components/inbox/` — each file does one thing.
- Correct Server/Client boundaries: only interactive pieces are `'use client'`.
- Proper `useActionState` + `useFormStatus` wiring in login and sign-out forms.
- Middleware uses `getUser()` (verified) not `getSession()` (cookie-only) — correct for an auth gate.
- Type-only imports (`import type { Task }`) keep the server-only `data.ts` out of client bundles.

---

## Recommendation

Fix the middleware cookie-carryover issue before merging (real correctness bug). Everything else can land as follow-ups.
