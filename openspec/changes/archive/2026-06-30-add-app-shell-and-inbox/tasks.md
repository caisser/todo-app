## 1. Auth handshake (route protection + login migration)

- [x] 1.1 Create `middleware.ts` at the repo root that instantiates a Supabase server client bound to request cookies, awaits `supabase.auth.getUser()`, and writes refreshed cookies to the outgoing `NextResponse`
- [x] 1.2 Implement the redirect rules in `middleware.ts`: no session + protected path → `/login`; session + `/login` or `/register` → `/inbox`; otherwise `NextResponse.next()`
- [x] 1.3 Export the middleware `config.matcher` excluding `_next/static`, `_next/image`, `favicon.ico`, and image extensions (`svg|png|jpg|jpeg|gif|webp`)
- [x] 1.4 Create `app/login/actions.ts` exporting a `login(prevState, formData)` Server Action that calls `supabase.auth.signInWithPassword`, returns `{ error }` on failure, and `redirect('/inbox')` on success
- [x] 1.5 Refactor `app/login/page.tsx` to a client component that consumes the `login` action via `useActionState`, mirroring `app/register/page.tsx`; wire pending state to disable the submit button and surface `state.error` inline above the submit button
- [x] 1.6 Update the `/register` success path (Server Action redirect target) so a successful registration lands on `/inbox`
- [x] 1.7 Manually verify: signed-out visit to `/inbox` → `/login`; signed-in visit to `/login` and `/register` → `/inbox`; failing login shows inline error; successful login lands on `/inbox`

## 2. Route group + shell layout scaffolding

- [x] 2.1 Create the `app/(app)/` route group directory
- [x] 2.2 Create `app/(app)/layout.tsx` as a Server Component that awaits `supabase.auth.getUser()`, hard-redirects to `/login` if the user is missing, and renders `<SideNavBar user={...} /> <TopNavBar user={...} /> <MainContent>{children}</MainContent> <MobileFAB />`
- [x] 2.3 Wrap the layout markup with the correct landmarks: `<nav>` around `SideNavBar`, `<header>` around `TopNavBar`, `<main>` around `MainContent`
- [x] 2.4 Create `app/(app)/actions.ts` exporting a `signOut` Server Action that calls `supabase.auth.signOut()` then `redirect('/login')`

## 3. Shell components (`components/app-shell/`)

- [x] 3.1 Create `SideNavBar.tsx` (server) — fixed 256px column, `hidden md:flex`, full viewport height, contains `SideNavBranding`, nav `<ul>` with four `NavItem`s (Inbox → `/inbox`, Today/Upcoming/Projects → `#`), and `NewProjectButton` with `mt-auto`
- [x] 3.2 Create `SideNavBranding.tsx` — "Tasks" (headline-sm bold primary) + "Stay Focused" (body-md secondary), `mb-lg px-xs`
- [x] 3.3 Create `NavItem.tsx` (client, `'use client'`) — uses `usePathname()` to compute active state; active variant applies `bg-surface-container-high text-primary font-bold`, icon `font-variation-settings: 'FILL' 1`, and `aria-current="page"`; inactive hover → `bg-surface-container-low`; `:active` → `translate-x-1 duration-200`
- [x] 3.4 Create `NewProjectButton.tsx` — outlined, full-width, `+` icon, `text-primary`, hover `bg-surface-container-low`; onClick is a no-op today
- [x] 3.5 Create `TopNavBar.tsx` (server) — fixed top, `h-[64px]`, `border-b border-outline-variant`, `z-50`, `w-full md:w-[calc(100%-16rem)]`; renders desktop children (`DesktopSearch`, `AddTaskButton`, `UserAvatar`) or mobile children (`MobileHamburger`, `MobileBrand`, `MobileSearchIcon`)
- [x] 3.6 Create `MobileHamburger.tsx` (client) — `md:hidden`, `menu` icon, `aria-label="Open navigation"`, `aria-expanded` state (drawer wiring is out of scope; expose a local `useState` placeholder)
- [x] 3.7 Create `MobileBrand.tsx` — "Minimalist To-Do", `md:hidden`, `text-headline-md font-bold text-primary`
- [x] 3.8 Create `DesktopSearch.tsx` (client) — `hidden md:flex`, borderless with bottom border only, `search` icon left, focus transitions bottom border to `border-primary`, `max-w-md`, `aria-label="Search tasks"`
- [x] 3.9 Create `MobileSearchIcon.tsx` — `md:hidden`, `search` icon button, `text-on-surface-variant`
- [x] 3.10 Create `AddTaskButton.tsx` (client) — `hidden md:flex`, `bg-primary text-on-primary px-md py-xs rounded-lg`, hover `opacity-90`, active `scale-[0.98]`; onClick is a no-op today
- [x] 3.11 Create `UserAvatar.tsx` (server) — 32×32 `rounded-full` with `border border-outline-variant overflow-hidden`; renders `<img>` from `user.user_metadata.avatar_url` with `alt="User profile"`, else falls back to email initials
- [x] 3.12 Create `MobileFAB.tsx` (client) — `md:hidden`, fixed `bottom-6 right-6`, 56×56 `rounded-full bg-primary text-on-primary shadow-[0px_10px_30px_rgba(0,0,0,0.1)]`, `z-50`, `+` icon 24px, `aria-label="Add task"`, active `scale-[0.95]`; onClick is a no-op today
- [x] 3.13 Create `MainContent.tsx` — `flex-grow md:ml-64 relative` container
- [x] 3.14 Create `SignOutButton.tsx` (client wrapper) — renders `<form action={signOut}>` with a styled submit button; drop it into `SideNavBar` (or `UserAvatar` slot) so users can sign out

## 4. Inbox screen (`app/(app)/inbox/`)

- [x] 4.1 Create `app/(app)/inbox/data.ts` exporting `getInboxTasks()` returning a mock `Task[]` with shape `{ id, title, dueDate, projectName, priority: 'high' | 'other', completed }` matching the SDD's sample rows
- [x] 4.2 Add a `Task` type in `app/(app)/inbox/data.ts` (colocated) with the shape above
- [x] 4.3 Create `app/(app)/inbox/page.tsx` (Server Component) that awaits `getInboxTasks()`, partitions by `priority`, and renders `PageHeader` + High Priority `TaskGroup` + Other Tasks `TaskGroup`
- [x] 4.4 Create `components/inbox/InboxCanvas.tsx` — wrapper with `pt-[80px] pb-xl px-sm md:px-lg max-w-container-max mx-auto mt-lg`
- [x] 4.5 Create `components/inbox/PageHeader.tsx` — `<h2>Inbox</h2>` (`text-headline-lg text-primary mb-xs`) + subtitle (`text-body-md text-secondary`); `mb-lg` on the header block
- [x] 4.6 Create `components/inbox/TaskGroup.tsx` (server) — accepts `{ label, icon, tasks }`; renders `GroupLabel` + `TaskList`; `mb-xl`
- [x] 4.7 Create `components/inbox/GroupLabel.tsx` — `<h3>` styled as `flex items-center gap-xs mb-sm px-xs font-label-caps text-label-caps text-secondary uppercase`; icon 16px
- [x] 4.8 Create `components/inbox/TaskList.tsx` — `flex flex-col` container for `TaskRow`s
- [x] 4.9 Create `components/inbox/TaskRow.tsx` (client) — `flex items-start gap-sm py-sm px-xs border-b border-outline-variant bg-surface-bright rounded-sm`; hover transitions to `bg-surface-container-low` + shadow + `translateY(-1px)` over `all 0.2s ease`; owns the local `checked` state
- [x] 4.10 Create `components/inbox/TaskCheckbox.tsx` (client, controlled) — native `<input type="checkbox">`, 1.25em square, 1.5px `border-outline`, `rounded-[2px]`; checked fills `bg-primary border-primary` with clip-path checkmark animating `scale(0) → scale(1)` over 120ms `ease-in-out`
- [x] 4.11 Create `components/inbox/TaskTitle.tsx` — `<label htmlFor={id}>` styled `font-body-lg text-primary block cursor-pointer`; when `completed` add `line-through opacity-50`
- [x] 4.12 Create `components/inbox/TaskDueDate.tsx` — `event` icon 14px + label; `text-error` when due today (comparing to `new Date()` at day precision), else `text-secondary`
- [x] 4.13 Create `components/inbox/TaskProjectTag.tsx` — `font-label-caps text-label-caps bg-surface-container-low px-2 py-1 rounded text-secondary`

## 5. Verification

- [x] 5.1 Run `pnpm lint` and fix any Biome warnings introduced by the new files
- [x] 5.2 Run `pnpm build` and resolve any TypeScript / Next.js compile errors
- [x] 5.3 Start `pnpm dev`, sign in with a real Supabase user, and verify: `/inbox` renders shell + two groups, Inbox nav item is active, hover elevates task rows, checking a task strikes it through, sign-out redirects to `/login`
- [x] 5.4 Verify responsive behaviour by resizing the browser: sidebar disappears below 768px, mobile nav (hamburger + brand + search icon) appears, FAB appears fixed bottom-right, canvas padding switches from `px-sm` to `px-lg`
- [x] 5.5 Verify auth redirects in the browser: signed-out `/inbox` → `/login`; signed-in `/login` and `/register` → `/inbox`
