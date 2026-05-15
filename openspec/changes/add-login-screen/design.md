## Context

The app is in design phase with no auth layer yet. The Stitch-generated HTML for the login screen (`tmp/Inicio-de-Sesion.md` SDD) is the visual reference. The tech stack is Next.js 16 App Router + React 19 + Tailwind v4 with `brand-` prefixed tokens. Supabase Auth is planned but not yet installed — form submission will be stubbed.

## Goals / Non-Goals

**Goals:**
- Render the login page at `/login` matching the SDD layout exactly (branding, card, two fields, two CTAs, decorative background)
- Use existing design system tokens (`brand-primary`, `brand-secondary`, font utilities, spacing)
- Components are structurally complete and accessible (labels, focus states, keyboard nav)
- No navigation bar rendered on this route

**Non-Goals:**
- Wiring Supabase Auth (deferred to a follow-on change)
- Registration or forgot-password flows (links present, destinations TBD)
- Social login

## Decisions

**Route structure — dedicated `/login` page, not a modal**
The SDD specifies a full-screen, navigation-free layout. A dedicated App Router page at `app/login/page.tsx` naturally removes the sidebar/topbar layout by placing it outside the `app/(app)/layout.tsx` shell (once that exists). Alternative of a modal over the main layout would force nav suppression logic across layouts.

**TextField component — create `components/ui/TextField.tsx`**
The bottom-border-only input with animated label appears on multiple screens (task detail, etc.). Extracting it as a primitive now avoids duplication when those screens are built. It accepts `label`, `type`, `placeholder`, `id`, and standard input props.

**Form state — `useState` only, no server action yet**
`onSubmit` will call `e.preventDefault()` and log credentials as a placeholder. React Compiler handles memoization; no `useCallback` needed. A server action replaces this stub when Supabase is wired.

**Decorative background — `<img>` with `aria-hidden`**
A fixed, blurred, grayscale image at 20% opacity. Using a plain `<img>` with `aria-hidden="true"` and `pointer-events-none` is simpler than `next/image` for a purely decorative asset with no CLS concern (fixed positioning).

## Risks / Trade-offs

- **Stub form handler** → No risk at this stage; the form can't submit to a real endpoint. Mitigation: clearly comment the placeholder and link the follow-on change in code.
- **TextField primitive scope** → If the design evolves significantly on other screens, the primitive may need rework. Mitigation: keep it minimal — no internal state beyond value/focus.

## Migration Plan

No data migrations. Deploy by merging the new page; it is unreachable until routing guards redirect unauthenticated users here (a future change).
