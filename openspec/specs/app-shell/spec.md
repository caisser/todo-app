# app-shell Specification

## Purpose

Defines the persistent shell layout, navigation, and sign-out semantics shared by every authenticated route in the app.

## Requirements

### Requirement: Authenticated route group shares a persistent shell layout
The system SHALL render every authenticated screen inside `app/(app)/layout.tsx`, which wraps its children with a `SideNavBar` (desktop only), a `TopNavBar` (all breakpoints), a `MainContent` container, and a `MobileFAB` (mobile only). The layout SHALL be a Server Component. It SHALL rely on the middleware-verified session and obtain the user via `supabase.auth.getSession()` (cookie-only, no network round-trip), because middleware has already validated the user with `getUser()` on the same request. Untyped provider fields on `user.user_metadata` (e.g. `avatar_url`) MUST be narrowed with a runtime `typeof` check rather than asserted with `as`.

#### Scenario: Authenticated user visits a route under /(app)
- **WHEN** an authenticated user visits any route rendered by `app/(app)/layout.tsx`
- **THEN** the page renders with `SideNavBar` visible on viewports ≥ 768px, `TopNavBar` fixed at the top, `MobileFAB` visible on viewports < 768px, and the page content inside `MainContent`

#### Scenario: Layout obtains the current user via getSession
- **WHEN** `app/(app)/layout.tsx` renders
- **THEN** it calls `supabase.auth.getSession()` on the Supabase server client (not `getUser()`), reads `data.session?.user`, and passes `{ email, avatarUrl }` down to shell components

#### Scenario: Layout narrows avatar_url without an unsafe cast
- **WHEN** the layout constructs the `avatarUrl` field for the shell
- **THEN** it evaluates `typeof user.user_metadata?.avatar_url === 'string' ? user.user_metadata.avatar_url : null` and never uses an `as string` cast

#### Scenario: Layout guards against a missing session as defense-in-depth
- **WHEN** `app/(app)/layout.tsx` renders and the Supabase server client returns no session or no user on the session
- **THEN** the layout server-side redirects to `/login`

### Requirement: SideNavBar displays branding, primary navigation, and a New Project action
The `SideNavBar` SHALL be a fixed 256px-wide column on desktop (`hidden md:flex`) with full viewport height. It SHALL contain `SideNavBranding` at the top, a vertical list of `NavItem`s below it, and a `NewProjectButton` pinned to the bottom via `mt-auto`. The sidebar SHALL also render the sign-out form in the bottom cluster alongside the `NewProjectButton` and SHALL control the visual spacing between them via its own flex gap or explicit margin — the sign-out form's own root element MUST NOT carry layout margins (e.g. `mt-xs`) that belong to the parent.

#### Scenario: Desktop viewport shows the sidebar
- **WHEN** the viewport is ≥ 768px
- **THEN** `SideNavBar` is visible, fixed to the left edge, and 256px wide

#### Scenario: Mobile viewport hides the sidebar
- **WHEN** the viewport is < 768px
- **THEN** `SideNavBar` is not rendered in the DOM flow (`hidden`)

#### Scenario: Sidebar lists the four primary nav items
- **WHEN** `SideNavBar` renders
- **THEN** it renders exactly four `NavItem` entries in order: Inbox, Today, Upcoming, Projects

#### Scenario: New Project button is pinned to the bottom
- **WHEN** `SideNavBar` renders
- **THEN** the `NewProjectButton` appears below the nav list with `mt-auto` so it hugs the bottom of the sidebar column

#### Scenario: Sign-out spacing lives on the sidebar, not the form
- **WHEN** the sidebar renders the sign-out form in the bottom cluster alongside the `NewProjectButton`
- **THEN** the vertical spacing between them is applied by the sidebar (e.g. via `gap-*` on its flex column) and the sign-out form's root element carries no vertical-margin utility of its own

### Requirement: Active NavItem is visually distinguished and announced to assistive tech
Each `NavItem` SHALL determine whether it is active by comparing its `href` to the current pathname. The active variant SHALL apply `bg-surface-container-high`, `text-primary`, `font-bold`, a filled Material Symbols icon (`font-variation-settings: 'FILL' 1`), and the `aria-current="page"` attribute.

#### Scenario: NavItem matching the current route is active
- **WHEN** the current pathname equals a `NavItem`'s `href`
- **THEN** that `NavItem` renders with the active styling and `aria-current="page"`

#### Scenario: Inactive NavItem hovers to a subtle fill
- **WHEN** a pointer hovers an inactive `NavItem`
- **THEN** its background transitions to `bg-surface-container-low`

#### Scenario: Inactive NavItem nudges on active press
- **WHEN** an inactive `NavItem` is in the `:active` state
- **THEN** it translates right by 1 unit (`translate-x-1`) with a 200ms duration

### Requirement: TopNavBar renders desktop and mobile variants
The `TopNavBar` SHALL be fixed to the top with `h-[64px]`, `border-b border-outline-variant`, and `z-50`. On mobile it SHALL span `w-full` and contain `MobileHamburger`, `MobileBrand`, and `MobileSearchIcon`. On desktop it SHALL span `md:w-[calc(100%-16rem)]` and contain `DesktopSearch`, `AddTaskButton`, and `UserAvatar`.

#### Scenario: Desktop top bar layout
- **WHEN** the viewport is ≥ 768px
- **THEN** `TopNavBar` renders `DesktopSearch` on the left and `AddTaskButton` + `UserAvatar` on the right, with a computed width of `calc(100% - 16rem)`

#### Scenario: Mobile top bar layout
- **WHEN** the viewport is < 768px
- **THEN** `TopNavBar` renders `MobileHamburger` on the left, `MobileBrand` centered, and `MobileSearchIcon` on the right

#### Scenario: Desktop search focus darkens the underline
- **WHEN** a user focuses `DesktopSearch`
- **THEN** its bottom border transitions from `border-outline-variant` to `border-primary` with no ring or glow

### Requirement: UserAvatar displays the current user's profile image
The `UserAvatar` SHALL render a 32×32px `rounded-full` element with `border border-outline-variant` and `overflow-hidden`. It SHALL use `user.user_metadata.avatar_url` as the image source when present, and fall back to initials derived from the user's email otherwise. When the email local-part contains a separator (`.`, `_`, `-`), the initials SHALL be composed from the first character of the first two tokens (e.g. `first.last` → `FL`). When the local-part has no separator, the fallback SHALL render a single uppercased first character (e.g. `luisdavidcardona` → `L`), never two arbitrary letters from the local-part.

#### Scenario: Avatar renders the user's image
- **WHEN** `user.user_metadata.avatar_url` is a non-empty string
- **THEN** `UserAvatar` renders an `<img>` with that src and a meaningful `alt` (e.g. `alt="User profile"`)

#### Scenario: Avatar falls back to two-letter initials for multi-token local-parts
- **WHEN** `user.user_metadata.avatar_url` is missing and the email local-part contains `.`, `_`, or `-`
- **THEN** `UserAvatar` renders the first character of the first two tokens, uppercased (e.g. `first.last@x.com` → `FL`)

#### Scenario: Avatar falls back to a single initial for single-token local-parts
- **WHEN** `user.user_metadata.avatar_url` is missing and the email local-part contains no separator
- **THEN** `UserAvatar` renders exactly one uppercased character taken from the first character of the local-part (e.g. `luisdavidcardona@x.com` → `L`)

### Requirement: MobileFAB is visible only on mobile and triggers task creation
The `MobileFAB` SHALL render only on viewports < 768px (`md:hidden`), be fixed at `bottom-6 right-6`, sized 56×56px `rounded-full`, filled `bg-primary text-on-primary`, elevated with `shadow-[0px_10px_30px_rgba(0,0,0,0.1)]`, and layered at `z-50`. It SHALL carry `aria-label="Add task"`.

#### Scenario: Mobile viewport shows the FAB
- **WHEN** the viewport is < 768px
- **THEN** `MobileFAB` is visible at the bottom-right of the viewport

#### Scenario: Desktop viewport hides the FAB
- **WHEN** the viewport is ≥ 768px
- **THEN** `MobileFAB` is not rendered (`md:hidden`)

#### Scenario: FAB press provides tactile feedback
- **WHEN** the FAB is in the `:active` state
- **THEN** it scales to `0.95`

### Requirement: Sign-out is performed by a Server Action
The system SHALL expose a `signOut` Server Action that calls `supabase.auth.signOut()` on the server and redirects the user to `/login`. The shell SHALL invoke this action via an HTML `<form action={signOut}>` so the browser cookie is cleared atomically.

#### Scenario: User invokes sign-out from the shell
- **WHEN** the user submits the sign-out form rendered by the shell
- **THEN** the `signOut` Server Action clears the Supabase session cookie server-side and issues a `redirect('/login')`

#### Scenario: Signed-out user cannot re-enter /(app) via back button
- **WHEN** a user completes sign-out and then attempts to visit any `/(app)` route
- **THEN** middleware redirects them to `/login`

### Requirement: Shell components meet baseline accessibility semantics
The system SHALL wrap the sidebar in a `<nav>` landmark, the top bar in a `<header>` landmark, and the page content in a `<main>` landmark. The sidebar navigation SHALL use `<ul>` / `<li>` / `<a>` semantics. `DesktopSearch` SHALL declare `aria-label="Search tasks"` (or use a visually-hidden `<label>`). `MobileHamburger` SHALL declare `aria-label="Open navigation"`. Because no mobile drawer is currently implemented, `MobileHamburger` MUST NOT declare `aria-expanded` and MUST NOT hold internal open/closed state; when a drawer ships, `aria-expanded` bound to the drawer state and the associated state MUST be reintroduced together.

#### Scenario: Landmarks are present
- **WHEN** any `app/(app)` route renders
- **THEN** the DOM contains exactly one `<nav>` (sidebar), one `<header>` (top bar), and one `<main>` (content) landmark

#### Scenario: Sidebar list uses correct semantics
- **WHEN** the sidebar renders
- **THEN** the nav items are contained in a `<ul>` with each item as `<li><a>...</a></li>`

#### Scenario: MobileHamburger is labelled without misleading state
- **WHEN** `MobileHamburger` renders in its current (drawer-less) form
- **THEN** it has `aria-label="Open navigation"`, it does NOT declare `aria-expanded`, and its component holds no `open`/`setOpen` state
