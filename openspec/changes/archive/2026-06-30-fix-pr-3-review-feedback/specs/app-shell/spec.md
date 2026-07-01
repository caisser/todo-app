## MODIFIED Requirements

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
