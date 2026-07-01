## 1. Middleware correctness and matcher

- [x] 1.1 In `middleware.ts`, add a small local helper (e.g. `redirectWithCookies(request, path, response)`) that builds a `NextResponse.redirect(new URL(path, request.url))` and copies every cookie from the passed-in `response` onto it via `response.cookies.getAll().forEach((c) => redirect.cookies.set(c.name, c.value))`
- [x] 1.2 Replace the unauthenticated → `/login` redirect in `middleware.ts` with a call to the helper, so rotated Supabase cookies survive the redirect
- [x] 1.3 Replace the authenticated → `/inbox` redirect in `middleware.ts` with a call to the helper
- [x] 1.4 Broaden the `config.matcher` regex in `middleware.ts` to also exclude `.ico`, `.css`, `.js`, `.woff`, `.woff2`, `.ttf` extensions, matching the delta spec's static-asset list
- [x] 1.5 Run `pnpm build` to confirm middleware still compiles

## 2. Layout: single session read + safe metadata narrowing

- [x] 2.1 In `app/(app)/layout.tsx`, replace the `supabase.auth.getUser()` call with `supabase.auth.getSession()` and read the user off `data.session?.user`
- [x] 2.2 Keep the defense-in-depth `redirect('/login')` when `data.session?.user` is null/undefined
- [x] 2.3 Replace the `(user.user_metadata?.avatar_url as string | undefined) ?? null` cast with a `typeof user.user_metadata?.avatar_url === 'string' ? user.user_metadata.avatar_url : null` narrowing
- [x] 2.4 Run `pnpm build` and `pnpm lint` to confirm the layout still compiles and passes lint

## 3. MobileHamburger: drop dead state and ARIA

- [x] 3.1 In `components/app-shell/MobileHamburger.tsx`, remove the `useState` for `open`/`setOpen`
- [x] 3.2 Remove the `aria-expanded` attribute from the button (keep `aria-label="Open navigation"`)
- [x] 3.3 Remove the click handler that only toggled `open`, and — if the button had no other purpose beyond opening the not-yet-implemented drawer — leave it as a plain button with no `onClick` for now
- [x] 3.4 If `MobileHamburger` was marked `'use client'` solely because of the removed state, drop the directive and let it render as a Server Component

## 4. UserAvatar: correct single-token initials fallback

- [x] 4.1 In `components/app-shell/UserAvatar.tsx`, update `getInitials` so a local-part without `.`, `_`, or `-` returns `local.charAt(0).toUpperCase()` (a single letter) instead of `local.slice(0, 2)`
- [x] 4.2 Confirm the multi-token behaviour is unchanged (`first.last` still → `FL`)

## 5. SideNavBar: own the sign-out spacing

- [x] 5.1 In `components/app-shell/SignOutButton.tsx`, remove the `mt-xs` (or equivalent vertical-margin utility) from the form's root element
- [x] 5.2 In `components/app-shell/SideNavBar.tsx`, add a `gap-*` on the parent flex column (or an explicit `mt-xs` on the sign-out form wrapper) so the visual spacing between the `NewProjectButton` and the sign-out control is preserved
- [x] 5.3 Visually verify the sidebar spacing at ≥ 768px matches the pre-change layout

## 6. Inbox heading hierarchy

- [x] 6.1 In `components/inbox/PageHeader.tsx`, change the "Inbox" title element from `<h2>` to `<h1>`
- [x] 6.2 In `components/inbox/GroupLabel.tsx` (or wherever `GroupLabel` renders), promote group labels from `<h3>` to `<h2>` so the document reads `<h1>` → `<h2>`
- [x] 6.3 Confirm the document has exactly one `<h1>` when `/inbox` renders

## 7. TaskRow: mark the non-persisted state

- [x] 7.1 In `components/inbox/TaskRow.tsx`, add a single-line `// TODO: wire mutation` comment immediately above the `useState` that tracks `checked`, so the intentionally non-persisted state is obvious to future readers

## 8. Register action: trust error.code only

- [x] 8.1 In `app/register/actions.ts`, remove the `error.status === 422` branch from the duplicate-account detection and rely solely on `error.code === 'user_already_exists'`
- [x] 8.2 Confirm the generic error path handles any 422 that arrives without a matching `error.code` (e.g. weak-password) so the error surfaces rather than being masked

## 9. Verification

- [x] 9.1 Run `pnpm build` — must pass without type errors
- [x] 9.2 Run `pnpm lint` — must pass with no new warnings
- [x] 9.3 Manually walk `/inbox` in the browser: sidebar renders, sign-out spacing looks correct, hamburger button is present on mobile and does not claim to open anything via ARIA
- [x] 9.4 Manually walk `/register` with an already-registered email and confirm the "account already exists" copy still appears; confirm a weak-password submission now surfaces via the generic error path rather than the duplicate-account UX
- [x] 9.5 Run `openspec verify --change fix-pr-3-review-feedback` (or `/opsx:verify`) to confirm the change is coherent before archiving
