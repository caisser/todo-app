## Context

PR #3 landed the authenticated shell, the Inbox screen, and the Supabase-backed middleware that gates `app/(app)/*`. Post-merge review turned up one real correctness bug plus a handful of medium-severity issues around performance, safety, and a11y. All of the shell's building blocks (`middleware.ts`, `app/(app)/layout.tsx`, `components/app-shell/*`, `components/inbox/*`, `app/register/actions.ts`) are already in place and covered by existing spec capabilities, so this change is exclusively remediation — no new capabilities, no new dependencies.

The current constraints matter here:
- Supabase's SSR helper (`@supabase/ssr`) mutates cookies on the outgoing `response` object during `getUser()` when it refreshes tokens. Any code path that discards `response` in favour of a new `NextResponse` also discards those cookies — that is the root of the blocker.
- CLAUDE.md's boundary-validation guidance means untyped provider input (`user.user_metadata.*`) must be narrowed with a runtime check, not asserted with `as`.
- The React Compiler is enabled, so no `useMemo`/`useCallback` gymnastics are needed for any tweaks here.

## Goals / Non-Goals

**Goals:**
- Eliminate the middleware cookie-loss bug so refresh-token rotation never signs a user out mid-redirect.
- Reduce per-request auth overhead: skip Supabase for static assets, and stop double-calling `getUser()` on every protected navigation.
- Tighten runtime safety and a11y in the shell/inbox: no unsafe casts, no promised-but-unimplemented ARIA state, exactly one `<h1>` per page.
- Fix a pre-existing but review-flagged issue in the register action so genuine 422 validation errors aren't misclassified as duplicate-email.

**Non-Goals:**
- Not implementing the mobile navigation drawer that `MobileHamburger` would open — the state is removed until the drawer exists.
- Not persisting task completion state — the `TaskRow` remains client-local until Supabase mutations land.
- No visual redesign, no new components, no new routes.
- No changes to the auth flow itself (sign-in, sign-out, session lifecycle) beyond the cookie-carryover fix.

## Decisions

### 1. Preserve Supabase-mutated cookies on every middleware redirect

The `setAll` callback bound to the Supabase server client writes onto the `response` created at the top of `middleware.ts`. Both redirect branches (unauth → `/login`, auth → `/inbox`) currently build a fresh `NextResponse.redirect(...)` and drop `response`, which discards any rotated tokens.

The fix is to copy cookies from `response` onto the redirect response before returning it:

```ts
const redirect = NextResponse.redirect(new URL('/login', request.url));
response.cookies.getAll().forEach((c) => redirect.cookies.set(c.name, c.value));
return redirect;
```

Extract this into a small local helper (e.g. `redirectWithCookies(request, path, response)`) so both branches use the same call site — the duplication is one line but the invariant is important enough to name.

**Alternatives considered:** mutating `response` in-place to a redirect via `NextResponse.rewrite`/`response.headers.set('location', ...)` — rejected because `NextResponse.redirect` is the documented Next.js API and the cookie-copy is a small, explicit step. Also considered pushing this into a shared helper module — deferred, since middleware is the only caller today.

### 2. Cookie-only session read in the layout, not a second `getUser()`

Middleware runs `supabase.auth.getUser()` (verified, network round-trip) before `app/(app)/layout.tsx` ever renders. Repeating `getUser()` in the layout doubles Auth traffic on every navigation. Since the trust boundary has already been crossed, the layout only needs the *identity* of the user for `shellUser`, which `getSession()` provides from the cookie without a network call.

The layout will:
- Call `supabase.auth.getSession()` and read `data.session?.user`.
- Keep the defense-in-depth `redirect('/login')` if `user` is unexpectedly absent (this is cheap — it's only a null-check on the cookie payload).

**Alternatives considered:** dropping the guard entirely and trusting middleware — rejected, the guard is cheap and matches the existing spec ("Layout guards against a missing session as defense-in-depth"). Passing `user` down from middleware via headers — over-engineered for a boolean gate.

### 3. Narrow `user_metadata.avatar_url` with a `typeof` check

Replace the `as string | undefined` cast with a `typeof === 'string'` narrowing, so any non-string value (null, object, etc. — all legal in Supabase's untyped `user_metadata`) falls through to the `null` branch cleanly. This is a one-line change and matches the boundary-validation guidance from CLAUDE.md.

### 4. Broaden the middleware matcher to cover non-image static assets

The current negative lookahead only excludes `_next/static`, `_next/image`, `favicon.ico`, and image extensions. Fonts, stylesheets, JS chunks, and `.ico` files still hit Supabase for a wasted `getUser()` round-trip. Extend the regex to include `css`, `js`, `woff`, `woff2`, `ttf`, `ico`. The updated matcher lives on the exported `config` at the bottom of `middleware.ts` and requires no other code changes.

### 5. Remove dead `open`/`setOpen` state from `MobileHamburger`

`MobileHamburger` currently tracks `open` state and binds it to `aria-expanded`, but no drawer is rendered. This promises assistive tech that the button toggles something. Two options were considered:

1. **Build the drawer now** — out of scope; there is no design or interaction spec for it yet, and the shell has a `MobileFAB` covering the primary action.
2. **Drop the state and the `aria-expanded` attribute** — chosen. The button stays as a visual affordance with `aria-label="Open navigation"` and an inert click handler removed; when the drawer ships, the state and ARIA will come back together.

The existing app-shell spec currently requires `aria-expanded` on `MobileHamburger`. This change **modifies that requirement** to only require `aria-expanded` when a drawer is present — otherwise the button MUST NOT expose it.

### 6. Inbox heading hierarchy: promote to `<h1>`

`PageHeader` currently renders the "Inbox" title as `<h2>` under the assumption the shell owns the `<h1>`. It does not — the shell has no page-level heading, so the document has no `<h1>`. Promote `PageHeader` to `<h1>` and update the corresponding scenarios in the inbox-screen spec. The existing "Group heading hierarchy" scenario (group labels are `<h3>`) is unaffected — but the intermediate `<h2>` slot becomes empty, which is acceptable per WCAG (no requirement to use every level).

### 7. Register action: trust `error.code`, drop status-based fallback

The current spec allows either `error.code === 'user_already_exists'` or `error.status === 422` for duplicate-email detection. In practice `error.status === 422` also fires for weak-password rejections, so it swallows those into a "duplicate account" UX. Tighten the requirement (and the code) to only trust `error.code`. This is a behaviour narrowing — a `error.status === 422` with no matching `error.code` will now fall through to the generic error path, which is the correct outcome.

### 8. Small hygiene fixes bundled with the review issues

- `getInitials` in `UserAvatar` returns `local.slice(0, 2)` when the email local-part has no separator (`luisdavidcardona` → `LU`). Change the fallback to `local.charAt(0).toUpperCase()` so single-token locals render one real initial rather than two arbitrary letters.
- Move the `mt-xs` currently on `SignOutButton`'s `<form>` up to `SideNavBar`'s flex-gap so layout concerns live with the layout owner.
- Add a single-line `// TODO: wire mutation` comment on `TaskRow`'s `useState` for `checked`, per CLAUDE.md's exception ("subtle invariant / would surprise a reader"). Everyone reading the code should immediately know this state does not persist.

These are hygiene fixes bundled with the review, not new capabilities, and don't need new spec scenarios — the existing scenarios still describe the behaviour correctly.

## Risks / Trade-offs

- **[Removing `aria-expanded` from `MobileHamburger` could regress a11y when the drawer ships]** → the delta spec explicitly requires the attribute to return when the drawer is implemented; a linter/test won't catch its absence today, so this is a documentation-and-trust safeguard.
- **[Cookie carryover fix is only exercised on real refresh-token rotation]** → hard to reproduce locally without waiting for token TTL. Mitigation: keep the fix minimal, review against Supabase SSR docs, and confirm the two redirect paths both go through the same helper so there's only one code path to reason about.
- **[Switching to `getSession()` in the layout loses the "user actually still exists in Supabase" check on every navigation]** → mitigated by middleware already having run `getUser()` on this request; the trust boundary is not weakened, only de-duplicated. If middleware ever changes to `getSession()`, the layout must revert to `getUser()`.
- **[Tightening the register 422 heuristic to code-only]** → if Supabase ever returns a duplicate-account error without a `code` (unlikely per current SDK behaviour), users would see the generic error instead of the tailored "account already exists" copy. Acceptable trade-off vs. masking weak-password errors.
