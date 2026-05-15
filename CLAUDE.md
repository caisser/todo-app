# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Lucho To-Do App** is a minimalist task management app. The project is transitioning from design into development — Stitch-generated screens guide the UI, and implementation is tracked via OpenSpec change artifacts in `openspec/`.

**Stitch Project ID:** `17862287041839336738`

## Skills (Slash Commands)

Three skills live in `.claude/skills/` and are invoked as slash commands:

| Command | Purpose |
|---|---|
| `/stitch-design` | Unified entry point for Stitch work — enhances prompts, routes to generate or edit workflows |
| `/design-md` | Reads the Stitch project, downloads screen HTML, and rewrites `DESIGN.md` |
| `/react-components` | Converts a Stitch screen into modular Vite + React components |

## Workflow

1. **Design system** is defined in `DESIGN.md` (source of truth for Stitch prompting)
2. **Screen specs** are documented in `sdd-preparation/` before generation (follow the SDD format: ASCII layout, component tables, responsive behavior, typography/color tokens, interaction specs, a11y notes)
3. **`/stitch-design`** generates or edits screens via Stitch MCP; exported HTML lands in `tmp/`
4. **`/design-md`** re-syncs `DESIGN.md` after new screens are added to the Stitch project
5. **`/react-components`** converts final screens to React when the design phase ends

### Generating a new screen with Stitch

Use the `mcp__stitch__*` tools (or run `/stitch-design`). Key steps:
- `list_projects` → `list_screens` → `get_screen` to retrieve existing assets
- Download HTML from `htmlCode.downloadUrl` via `WebFetch`
- Reference `DESIGN.md` tokens and the SDD spec when prompting `generate_screen_from_text` or `edit_screens`
- Prefer `edit_screens` for targeted adjustments over full re-generation

## Existing Screens (`tmp/`)

| File | Screen |
|---|---|
| `tmp/Proyectos.html` | Projects list view (reference implementation) |
| `tmp/Bandeja-de-Entrada.html` | Inbox |
| `tmp/Vista-Hoy.html` | Today view |
| `tmp/Detalle-de-Tarea.html` | Task detail overlay |

## Design System (`DESIGN.md`)

**Theme:** Monochrome Task System — high-end minimalism, grayscale only, "calm-tech" philosophy.

Key tokens:
- **Fonts:** Manrope (headings), Inter (body), JetBrains Mono (meta labels/chips)
- **Primary:** `#000000` / **Background:** `#f9f9fa` / **Secondary text:** `#5d5e66`
- **Spacing base unit:** 4px; container max-width: 800px
- **Border radius:** 4px standard (`DEFAULT`), 8px cards/larger containers (`lg`)
- **Shadows:** Highly diffused only — `0px 10px 30px rgba(0,0,0,0.04)`, hover states only

Tailwind is configured inline in generated HTML with all design tokens already mapped (see `tmp/Proyectos.html` as reference).

## Key Design Decisions

- **No accent colors** — interaction states use gray-value shifts only
- **Max-width 800px** container for focus
- **Responsive breakpoint at `md` (768px):** SideNavBar on desktop, TopNavBar on mobile
- **Material Symbols Outlined** for icons (thin-stroke, 1.5px, monochrome)
- Checkboxes: square, 2px radius, fills black when checked; completed tasks get strikethrough + 50% opacity
- Input fields: bottom-border only, darkens to black on focus

## OpenSpec Artifact Workflow (`openspec/`)

Changes are tracked as structured artifacts in `openspec/`:
- `openspec/changes/` — active change artifacts (proposal, spec, tasks)
- `openspec/archive/` — completed changes
- `openspec/config.yaml` — schema and project context

Use `/opsx:new` or `/opsx:propose` to start a new change, `/opsx:apply` to implement tasks, `/opsx:verify` then `/opsx:archive` to close it out.

---

## Development

### Commands

```bash
pnpm dev        # start dev server
pnpm build      # production build (run this to catch type/compile errors)
pnpm lint       # Biome lint check
pnpm format     # Biome auto-format (writes files)
```

### Tech Stack

- **Framework:** Next.js 16 App Router, React 19 — **Breaking changes from prior versions.** Read `node_modules/next/dist/docs/` before writing Next.js code.
- **React Compiler:** `babel-plugin-react-compiler` is configured — avoid manual `useMemo`/`useCallback` optimizations the compiler handles
- **Styling:** Tailwind CSS v4 — tokens use `brand-` prefix (e.g. `text-brand-primary`, `bg-brand-secondary`)
- **Linter/Formatter:** Biome (not ESLint/Prettier) — 2-space indent, single quotes, trailing commas
- **Package manager:** pnpm only

**Installed:** TanStack Query (`@tanstack/react-query` v5), Zustand v5. **Planned (not yet installed):** Supabase (`@supabase/ssr`) for Postgres, Auth, and Storage.

### Folder Conventions

| Path | Purpose |
|---|---|
| `app/{page}/page.tsx` | Next.js pages (App Router) |
| `components/ui/` | UI kit primitives (Button, TextField, Dropdown, Icons) |
| `components/{context}/` | Feature-specific components |
| `components/{Name}.tsx` | Generic, context-free components |
| `hooks/` | Custom hooks; nested folder if multiple hooks share one feature |
| `stores/` | Zustand stores |
| `types/` | Global/shared types — `.ts` only (no `.d.ts`), avoid `any` |
| `libs/` | Internal libraries (`request.ts`, `errors.ts`, etc.) |
| `utils/` | Generic utility functions |

### Supabase

- **Client:** create the Supabase browser client in `libs/supabase/client.ts` and the server client in `libs/supabase/server.ts` (using `@supabase/ssr`)
- **Auth:** use Supabase Auth; session is read server-side via the server client in Server Components and Server Actions
- **Database access:** always go through the Supabase client — never raw SQL from the app layer; keep RLS policies as the primary access-control layer
- **Storage:** use Supabase Storage for file uploads; generate signed URLs server-side
- **Env vars:** `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are required; service-role key (`SUPABASE_SERVICE_ROLE_KEY`) is server-only and must never be exposed to the client

### Data Fetching & Mutations

- **Server-critical pages:** fetch in the page component (server) via the Supabase server client or `libs/request.ts`
- **Everything else:** fetch on the client with TanStack Query, using the Supabase browser client
- **Mutations:** always use Server Actions; call the Supabase server client inside them (never expose service-role key to the client)

### State Management (in order of preference)

1. `useState` / `useReducer` — local component state
2. Context API — shared state in a simple component hierarchy
3. Zustand (`stores/`) — reactive state needed across unrelated components

### Programming Practices

- No business logic inside components — extract to a custom hook
- Avoid `useEffect`; prefer derived state, event handlers, or server-side solutions
- URL-based state via query params — page state must survive a browser refresh
- Naming: PascalCase for components and entity types (`User.ts`), camelCase for functions/hooks/files (`parseQueryParams.ts`), hyphen-case for non-entity types
- Types for function arguments and return values go in the same file as the function
- No unused variables or `console.log` left in committed code
- Installing packages: validate security, maintenance activity, and bundle-size impact before adding

### Error Classes (`libs/errors.ts`)

Pre-defined error classes: `UnauthorizedError`, `ForbiddenError`, `BadRequestError`, `InternalServerError`, `PreconditionFailed`.
