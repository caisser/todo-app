# SDD: App Shell Layout + Inbox Screen

## Overview

The authenticated app shell is the persistent chrome that wraps every screen after login. It consists of a fixed `SideNavBar` on desktop and a fixed `TopNavBar` at all breakpoints, plus a mobile floating action button. The `Inbox` screen is the first content screen a user lands on after authenticating — it displays all tasks organized into priority groups.

This document covers both the shared layout components and the Inbox screen content, as well as the Supabase Auth handshake that connects the Login page to these protected screens.

---

## ASCII Layout

### Desktop (≥ 768px)

```
┌──────────────────┬──────────────────────────────────────────────────────┐
│   SideNavBar     │  TopNavBar (fixed, full width minus sidebar)          │
│  (fixed, 256px)  │  ┌─────────────────────────────────────────────────┐  │
│                  │  │  [search____________]         [Add Task] [avatar]│  │
│  Tasks           │  └─────────────────────────────────────────────────┘  │
│  Stay Focused    │                                                        │
│                  │  ── Canvas (pt-[80px] md:ml-64) ──────────────────    │
│  ▣ Inbox  ←active│                                                        │
│    Today         │  Inbox                                                 │
│    Upcoming      │  Your high-priority items demanding attention.         │
│    Projects      │                                                        │
│                  │  ⚑ HIGH PRIORITY                                       │
│                  │  ┌────────────────────────────────────────────────┐    │
│                  │  │ □  Finalize Q3 Marketing Budget                │    │
│                  │  │    📅 Today (red)     Marketing                │    │
│                  │  ├────────────────────────────────────────────────┤    │
│                  │  │ □  Review Design System Updates                │    │
│  ┌─────────────┐ │  │    📅 Tomorrow        Design                   │    │
│  │ + New Project│ │  └────────────────────────────────────────────────┘    │
│  └─────────────┘ │                                                        │
│                  │  ≡ OTHER TASKS                                          │
│                  │  ┌────────────────────────────────────────────────┐    │
│                  │  │ □  Draft Engineering All-Hands Agenda           │    │
│                  │  │    📅 Oct 12          Engineering               │    │
│                  │  ├────────────────────────────────────────────────┤    │
│                  │  │ □  Approve Contractor Invoices                  │    │
│                  │  │    📅 Oct 15          Finance                   │    │
│                  │  └────────────────────────────────────────────────┘    │
└──────────────────┴──────────────────────────────────────────────────────┘
```

### Mobile (< 768px)

```
┌─────────────────────────────────────────────────────┐
│  TopNavBar (fixed)                                  │
│  ┌─────────────────────────────────────────────┐    │
│  │ [≡]  Minimalist To-Do          [🔍]         │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ── Canvas (pt-[80px]) ──────────────────────────   │
│                                                     │
│  Inbox                                              │
│  Your high-priority items demanding attention.      │
│                                                     │
│  ⚑ HIGH PRIORITY                                    │
│  ┌───────────────────────────────────────────────┐  │
│  │ □  Finalize Q3 Marketing Budget               │  │
│  │    📅 Today (red)     Marketing               │  │
│  ├───────────────────────────────────────────────┤  │
│  │ □  Review Design System Updates               │  │
│  │    📅 Tomorrow        Design                  │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  ≡ OTHER TASKS                                      │
│  ┌───────────────────────────────────────────────┐  │
│  │ □  Draft Engineering All-Hands Agenda         │  │
│  │    📅 Oct 12          Engineering             │  │
│  ├───────────────────────────────────────────────┤  │
│  │ □  Approve Contractor Invoices                │  │
│  │    📅 Oct 15          Finance                 │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│                                     ┌───┐           │
│                                     │ + │ ← FAB     │
│                                     └───┘           │
└─────────────────────────────────────────────────────┘
```

---

## Component Table

### App Shell

| Component | Type | Description |
|---|---|---|
| `SideNavBar` | Nav | Fixed left column, 256px wide, full screen height. Hidden on mobile (`hidden md:flex`). Contains branding, nav links, and "New Project" button. |
| `SideNavBranding` | Visual | Title "Tasks" (`headline-sm`, bold, `text-primary`) + subtitle "Stay Focused" (`body-md`, `text-secondary`). Margin `mb-lg px-xs`. |
| `NavItem` | Link | `flex items-center gap-sm px-sm py-xs rounded-lg`. Active variant: `bg-surface-container-high text-primary font-bold`, filled icon. Inactive: `text-secondary font-normal`, hover `bg-surface-container-low`. `active:translate-x-1 duration-200`. |
| `NavIcon` | Icon | Material Symbols Outlined, thin-stroke. Active icon uses `FILL 1` via `font-variation-settings`. |
| `NewProjectButton` | Button | `mt-auto`, full-width, outlined (`border border-outline-variant`), `rounded-lg`, `text-primary`, `font-body-md`. Hover: `bg-surface-container-low`. `+` icon left. |
| `TopNavBar` | Header | Fixed top, `h-[64px]`, `border-b border-outline-variant`, `z-50`. Width `w-full` on mobile, `md:w-[calc(100%-16rem)]` on desktop. |
| `MobileHamburger` | Button | Visible on mobile only (`md:hidden`). `menu` icon, `text-on-surface-variant`. Triggers mobile nav drawer (not yet designed). |
| `MobileBrand` | Heading | "Minimalist To-Do" — `font-headline-md text-headline-md font-bold text-primary`. Visible mobile only. |
| `DesktopSearch` | Input | Hidden on mobile (`hidden md:flex`). Borderless, bottom-border only (`border-b border-outline-variant`). `search` icon left, focus darkens to `border-primary`. `max-w-md`. |
| `MobileSearchIcon` | Button | Visible on mobile only. `search` icon, `text-on-surface-variant`. |
| `AddTaskButton` | Button | Desktop only (`hidden md:flex`). Black fill (`bg-primary text-on-primary`), `px-md py-xs rounded-lg`, `font-body-md`. Hover: `opacity-90`, active: `scale-[0.98]`. |
| `UserAvatar` | Visual | 32×32px circle (`rounded-full`), `border border-outline-variant`, `overflow-hidden`. Contains user profile image. |
| `MobileFAB` | Button | Mobile only (`md:hidden`). Fixed `bottom-6 right-6`, 56×56px circle (`rounded-full`), `bg-primary text-on-primary`, `shadow-[0px_10px_30px_rgba(0,0,0,0.1)]`. `+` icon 24px. Active: `scale-[0.95]`. `z-50`. |
| `MainContent` | Container | `flex-grow md:ml-64 relative`. Offset from sidebar on desktop. |

### Inbox Screen

| Component | Type | Description |
|---|---|---|
| `InboxCanvas` | Container | `pt-[80px] pb-xl px-sm md:px-lg max-w-container-max mx-auto mt-lg`. Inner content area below the fixed top nav. |
| `PageHeader` | Visual | Title "Inbox" (`headline-lg`, `text-primary`, `mb-xs`) + subtitle "Your high-priority items demanding attention." (`body-md`, `text-secondary`). Margin `mb-lg`. |
| `TaskGroup` | Section | `mb-xl`. Contains a group label row and a task list. |
| `GroupLabel` | Label | `flex items-center gap-xs mb-sm px-xs`. Icon (`text-[16px] text-secondary`) + text (`font-label-caps text-label-caps text-secondary uppercase`). |
| `TaskList` | List | `flex flex-col` container for task rows. |
| `TaskRow` | Row | `flex items-start gap-sm py-sm px-xs border-b border-outline-variant bg-surface-bright rounded-sm`. Hover: `bg-surface-container-low shadow-[0px_10px_30px_rgba(0,0,0,0.04)] translateY(-1px)`. Transition: `all 0.2s ease`. |
| `TaskCheckbox` | Input | `type="checkbox"`, 1.25em square, 1.5px `border-outline` border, `rounded-[2px]`. Checked: fills `bg-primary border-primary` with clip-path checkmark. |
| `TaskTitle` | Label | `font-body-lg text-body-lg text-primary block cursor-pointer`. Associated to checkbox via `for`/`id`. Completed tasks: `line-through opacity-50`. |
| `TaskDueDate` | Chip | `font-body-md text-body-md flex items-center gap-1`. `event` icon 14px. Due today: `text-error`. Future/other: `text-secondary`. |
| `TaskProjectTag` | Tag | `font-label-caps text-label-caps bg-surface-container-low px-2 py-1 rounded text-secondary`. |

---

## Responsive Behavior

| Breakpoint | SideNavBar | TopNavBar | Main Content | FAB |
|---|---|---|---|---|
| Mobile (< 768px) | Hidden (`hidden`) | Full width, shows hamburger + brand + search icon | No left margin; `px-sm` padding | Visible, fixed bottom-right |
| Desktop (≥ 768px) | Visible, fixed 256px left | Width `calc(100% - 16rem)`, shows desktop search + Add Task button | Left margin `ml-64`; `px-lg` padding | Hidden (`md:hidden`) |

Sidebar on mobile requires a slide-in drawer (not yet designed — out of scope for this SDD).

---

## Typography & Color Tokens

| Element | Font | Size Token | Color Token |
|---|---|---|---|
| Sidebar title "Tasks" | Manrope | `text-headline-sm` (18px) | `text-primary` (#000) |
| Sidebar subtitle "Stay Focused" | Inter | `text-body-md` (14px) | `text-secondary` (#5d5e66) |
| Nav item label | Inter | `text-body-md` (14px) | `text-primary` (active) / `text-secondary` (inactive) |
| Nav icon | Material Symbols | 24px (default) | `text-primary` (active) / `text-secondary` (inactive) |
| "New Project" button | Inter | `text-body-md` (14px) | `text-primary` |
| Mobile brand "Minimalist To-Do" | Manrope | `text-headline-md` (24px) | `text-primary` |
| Desktop search placeholder | Inter | `text-body-md` (14px) | `text-outline` |
| Desktop search input | Inter | `text-body-md` (14px) | `text-primary` |
| "Add Task" button | Inter | `text-body-md` (14px) | `text-on-primary` (#fff) |
| Page title "Inbox" | Manrope | `text-headline-lg` (32px) | `text-primary` |
| Page subtitle | Inter | `text-body-md` (14px) | `text-secondary` |
| Group label text | JetBrains Mono | `text-label-caps` (12px) | `text-secondary` |
| Task title | Inter | `text-body-lg` (16px) | `text-primary` |
| Due date (today) | Inter | `text-body-md` (14px) | `text-error` (#ba1a1a) |
| Due date (other) | Inter | `text-body-md` (14px) | `text-secondary` |
| Project tag | JetBrains Mono | `text-label-caps` (12px) | `text-secondary` |
| Sidebar background | — | — | `bg-surface-container-lowest` (#fff) |
| TopNavBar background | — | — | `bg-surface-lowest` |
| Canvas background | — | — | `bg-background` (#f9f9fa) |
| Task row background | — | — | `bg-surface-bright` (#f9f9fa) |

---

## Interaction Specs

| Element | State | Behavior |
|---|---|---|
| Active `NavItem` | Default | `bg-surface-container-high`, `text-primary font-bold`, icon `FILL 1` |
| Inactive `NavItem` | Hover | `bg-surface-container-low` fill |
| Inactive `NavItem` | Active (click) | `translate-x-1` |
| `NewProjectButton` | Hover | `bg-surface-container-low` fill |
| Desktop search | Focus | Bottom border transitions to `border-primary` (black); no ring or glow |
| `AddTaskButton` | Hover | `opacity-90` |
| `AddTaskButton` | Active | `scale-[0.98]` |
| `MobileFAB` | Active | `scale-[0.95]` |
| `TaskRow` | Hover | `bg-surface-container-low`, `shadow-[0px_10px_30px_rgba(0,0,0,0.04)]`, `translateY(-1px)` — via `all 0.2s ease` transition |
| `TaskCheckbox` | Checked | Background fills `bg-primary`, border becomes `border-primary`; clip-path checkmark animates in via `scale(0) → scale(1)`, `120ms ease-in-out` |
| `TaskCheckbox` | Checked (label) | `TaskTitle` gets `line-through opacity-50` |

---

## Spacing

### App Shell

| Area | Value |
|---|---|
| SideNavBar internal padding | `p-md` (1.5rem) |
| SideNavBar gap between items | `gap-xs` (0.5rem) |
| SideNavBar branding bottom margin | `mb-lg` (2.5rem) |
| SideNavBar branding horizontal padding | `px-xs` (0.5rem) |
| SideNavBar nav list gap | `gap-unit` (4px) |
| Nav item padding | `px-sm py-xs` (1rem / 0.5rem) |
| TopNavBar height | `h-[64px]` |
| TopNavBar internal padding | `px-md py-sm` (1.5rem / 1rem) |
| Main content left offset (desktop) | `ml-64` (16rem / 256px) |
| Main content top offset | `pt-[80px]` |

### Inbox Screen

| Area | Value |
|---|---|
| Canvas padding (mobile) | `px-sm` (1rem) |
| Canvas padding (desktop) | `px-lg` (2.5rem) |
| Canvas bottom padding | `pb-xl` (4rem) |
| Canvas top margin | `mt-lg` (2.5rem) |
| Page header bottom margin | `mb-lg` (2.5rem) |
| Title → subtitle gap | `mb-xs` (0.5rem) |
| Task group bottom margin | `mb-xl` (4rem) |
| Group label bottom margin | `mb-sm` (1rem) |
| Task row vertical padding | `py-sm` (1rem) |
| Task row horizontal padding | `px-xs` (0.5rem) |
| Checkbox → content gap | `gap-sm` (1rem) |
| Due date / tag gap | `gap-sm` (1rem) |
| Due date top margin | `mt-1` (4px) |

---

## Accessibility Notes

- `<nav>` landmark wraps `SideNavBar`; `<header>` wraps `TopNavBar`; `<main>` wraps `MainContent`
- `SideNavBar` nav list uses `<ul>` / `<li>` / `<a>` semantics
- Active `NavItem` should carry `aria-current="page"` on the active link
- `MobileHamburger` button needs `aria-label="Open navigation"` and `aria-expanded` tied to drawer state
- Desktop search `<input>` needs an associated `<label>` (visually hidden acceptable) or `aria-label="Search tasks"`
- Each `TaskCheckbox` is associated to `TaskTitle` via matching `id` / `for` attributes
- `TaskRow` hover effects are purely visual — no keyboard-only state changes required (focus lands on checkbox)
- Group labels use `<h3>` wrapped in label-caps styling for correct heading hierarchy (h2 = Inbox, h3 = group names)
- `UserAvatar` `<img>` requires a meaningful `alt` (e.g., `alt="User profile"`)
- `MobileFAB` needs `aria-label="Add task"`

---

## Auth Connection

The Login screen and the Inbox screen are connected through Supabase Auth using the SSR cookie pattern.

| Step | Location | What happens |
|---|---|---|
| 1. Submit login | `app/login/` (Server Action) | `supabase.auth.signInWithPassword({ email, password })` called with credentials. On success, Supabase sets a session cookie. Action redirects to `/inbox`. On error, action returns error message to display inline. |
| 2. Route protection | `middleware.ts` | Reads session via server Supabase client on every request. If no valid session and route is under `/(app)`, redirects to `/login`. If session exists and route is `/login` or `/register`, redirects to `/inbox`. |
| 3. Shell layout session | `app/(app)/layout.tsx` | Server Component fetches user session via Supabase server client. Passes `user` data (email, avatar URL) to shell components. If session is missing (should not happen past middleware), hard redirect to `/login`. |
| 4. Avatar | `UserAvatar` | Displays `user.user_metadata.avatar_url` if present, else initials fallback. |
| 5. Sign out | Sidebar or avatar dropdown | Server Action calls `supabase.auth.signOut()`, then redirects to `/login`. |

**Route group:** All authenticated screens live under `app/(app)/` — a Next.js route group that shares `app/(app)/layout.tsx` (the shell layout). The Inbox page is at `app/(app)/inbox/page.tsx`.

**Login page migration:** `app/login/page.tsx` currently uses client-side `useState` with a `// TODO: wire Supabase Auth` comment. It must be migrated to use a Server Action (matching the pattern in `app/register/actions.ts`) before this auth flow is functional.

---

## Notes

- The mobile sidebar drawer (triggered by the hamburger button) is not specified here — it is a separate screen/overlay to be designed
- The `UserAvatar` dropdown menu (sign out, profile, settings) is not specified here — out of scope for this SDD
- "New Project" button in the sidebar has no target screen yet
- Task completion (checking the checkbox) triggers a visual strikethrough + opacity change; the persistence layer (Supabase mutation) is outside the scope of this SDD
- The `Add Task` button (desktop) and FAB (mobile) trigger a task creation flow not yet designed
- Container max-width is `800px` (`max-w-container-max`); the sidebar is outside this constraint (fixed, full height)
- All nav route targets (Today, Upcoming, Projects) point to `#` placeholders — actual routes to be defined when those screens are designed
