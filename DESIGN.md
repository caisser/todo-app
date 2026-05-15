# Design System: Minimalist Grayscale Tasks
**Project ID:** 17862287041839336738

---
name: Monochrome Task System
colors:
  # Base surfaces
  surface: '#f9f9fa'
  surface-dim: '#dadadb'
  surface-bright: '#f9f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeef'
  surface-container-high: '#e8e8e9'
  surface-container-highest: '#e2e2e3'
  surface-variant: '#e2e2e3'
  surface-tint: '#5f5e5e'
  background: '#f9f9fa'
  on-background: '#1a1c1d'
  # On-surface
  on-surface: '#1a1c1d'
  on-surface-variant: '#444748'
  inverse-surface: '#2f3132'
  inverse-on-surface: '#f0f1f2'
  # Outline
  outline: '#747878'
  outline-variant: '#c4c7c7'
  # Primary
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474646'
  # Secondary
  secondary: '#5d5e66'
  on-secondary: '#ffffff'
  secondary-container: '#e3e1ec'
  on-secondary-container: '#63646c'
  secondary-fixed: '#e3e1ec'
  secondary-fixed-dim: '#c6c5cf'
  on-secondary-fixed: '#1a1b22'
  on-secondary-fixed-variant: '#46464e'
  # Tertiary
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1a1b22'
  on-tertiary-container: '#83838c'
  tertiary-fixed: '#e2e1eb'
  tertiary-fixed-dim: '#c6c6cf'
  on-tertiary-fixed: '#1a1b22'
  on-tertiary-fixed-variant: '#45464e'
  # Error
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
typography:
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 26px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 0.5rem
  sm: 1rem
  md: 1.5rem
  lg: 2.5rem
  xl: 4rem
  gutter: 1.5rem
  container-max: 800px
---

## 1. Visual Theme & Atmosphere

The interface embodies **calm-tech minimalism** — an aesthetic philosophy that treats the UI as a receding frame, placing all visual weight on the content itself. The mood is quiet, ordered, and deliberately restrained: no color distractions, no decorative flourishes, no noise. Every element earns its place through function alone.

The emotional register is **focused confidence**: the kind of tool a senior professional reaches for precisely because it does not demand attention. Whitespace is generously employed not as emptiness, but as structured silence that gives the eye a place to rest between tasks. Depth is implied through tonal layering rather than heavy shadow, producing a paper-like tactility that feels grounded without being heavy.

Screens observed across the project — Inbox, Today, Projects, and Task Detail — share a unified two-zone layout: a narrow left sidebar for navigation and a maximally readable center content area capped at 800px. The result feels like a well-typeset document, not an application.

---

## 2. Color Palette & Roles

All interaction states are expressed through gray-value shifts exclusively. There are no accent colors anywhere in the system.

| Descriptive Name | Hex | Semantic Token | Functional Role |
|---|---|---|---|
| **Pure Black** | `#000000` | `primary` | Primary actions, checked states, focused borders, high-level headings |
| **Near-Black** | `#1a1c1d` | `on-surface` | Body text on light surfaces; primary readable text |
| **Charcoal** | `#444748` | `on-surface-variant` | Secondary text, icon fills, on-surface-variant labels |
| **Slate Gray** | `#5d5e66` | `secondary` | Tertiary text, disabled labels, secondary metadata |
| **Medium Gray** | `#747878` | `outline` | Dividers, outlines, unfocused border strokes |
| **Muted Border** | `#c4c7c7` | `outline-variant` | Subtle structural dividers, input bottom borders at rest |
| **Whisper Gray** | `#dadadb` | `surface-dim` | Dim surface backgrounds, skeleton states |
| **Container Low** | `#f3f3f4` | `surface-container-low` | Task row hover state, list item backgrounds |
| **Container** | `#eeeeef` | `surface-container` | Structural section backgrounds, grouping containers |
| **Container High** | `#e8e8e9` | `surface-container-high` | Pressed or selected row backgrounds |
| **Container Highest** | `#e2e2e3` | `surface-container-highest` / `surface-variant` | Chip/tag backgrounds, meta-label surfaces |
| **Off-White Canvas** | `#f9f9fa` | `surface` / `background` | Page background — the primary layout surface |
| **Pure White** | `#ffffff` | `surface-container-lowest` | Card surfaces, modal overlays, elevated panels |
| **Error Red** | `#ba1a1a` | `error` | Destructive actions only (delete confirmations, error states) |

---

## 3. Typography Rules

Three typefaces form a deliberate hierarchy, each assigned a distinct cognitive role:

### Manrope — Structural Headings
Used for all page-level and section-level titles. Its geometric warmth prevents the all-grayscale palette from feeling cold. Applied at semi-bold (600) weight for primary headings and medium (500) for sub-headings.

| Style | Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|
| `headline-lg` (desktop) | 32px | 600 | 1.2 | −0.02em |
| `headline-lg` (mobile) | 26px | 600 | 1.2 | — |
| `headline-md` | 24px | 600 | 1.3 | — |
| `headline-sm` | 18px | 500 | 1.4 | — |

### Inter — Task Body & Lists
The workhorse typeface for all task titles, descriptions, and navigational labels. Its neutral utility ensures legibility at small sizes across long list views. Regular weight (400) throughout; bold weight signals active or selected states only.

| Style | Size | Weight | Line Height |
|---|---|---|---|
| `body-lg` | 16px | 400 | 1.6 |
| `body-md` | 14px | 400 | 1.5 |

### JetBrains Mono — Meta Labels & Chips
Reserved for categorical tags, date stamps, status badges, and count indicators. Its monospaced precision lends a technical, data-forward character that distinguishes meta-information from human-readable prose. Always uppercase, always tight letter-spacing.

| Style | Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|
| `label-caps` | 12px | 500 | 1 | +0.05em |

---

## 4. Component Stylings

### Buttons
- **Primary:** Solid Pure Black (`#000000`) fill, Pure White (`#ffffff`) text in Inter medium. Gently squared corners at 4px radius (DEFAULT roundness). No gradients. Hover state shifts background to Near-Black (`#1a1c1d`).
- **Secondary / Ghost:** Transparent fill with a 1px Muted Border (`#c4c7c7`) stroke and Charcoal (`#444748`) text. Hover shifts border to Medium Gray (`#747878`).
- **Icon Buttons (inline):** Icon-only affordances (add, delete, attach) use no visible border; hover reveals a Container Low (`#f3f3f4`) background at 4px radius.
- **Destructive:** Text or icon in Error Red (`#ba1a1a`) — reserved strictly for delete/remove confirmations.

### Task Rows
Each task occupies a full-width row separated from adjacent rows by a 1px Muted Border (`#c4c7c7`) horizontal rule. At rest, the row background is transparent over the Off-White Canvas. On hover, the background shifts to Container Low (`#f3f3f4`) with a whisper-soft ambient shadow (`0px 10px 30px rgba(0,0,0,0.04)`) that lifts the row without introducing color.

Completed tasks receive two simultaneous treatments: strikethrough on the task title text and 50% opacity applied to the entire row, visually retiring the item without removing it from context.

### Checkboxes
Custom square checkbox with a subtle 2px radius (sm roundness) — barely-there rounding that keeps the form precise without sharp aggression. At rest: 1px Muted Border (`#c4c7c7`) stroke, transparent fill. Checked state: Pure Black (`#000000`) fill with a crisp white checkmark. No animation — the state change is instant and decisive.

### Input Fields
Minimalist bottom-border-only treatment: no visible box, no background fill, only a single 1px horizontal stroke at Muted Border (`#c4c7c7`) at rest. On focus, the bottom border transitions to Pure Black (`#000000`), directing attention without visual noise. Placeholder text uses Slate Gray (`#5d5e66`). Label text sits above in Inter body-md.

### Cards (Project Cards)
White (`#ffffff`) surface on the Off-White Canvas background, creating a gentle one-step tonal lift. Corners at 8px radius (lg roundness) for a slightly more approachable feel than standard components. No border at rest. Hover state applies the standard ambient shadow (`0px 10px 30px rgba(0,0,0,0.04)`). Progress indicators and task counters appear inside as JetBrains Mono label-caps.

### Chips / Category Tags
JetBrains Mono label-caps text in Near-Black (`#1a1c1d`) on a Container Highest (`#e2e2e3`) background. No border, no shadow — pure padding and background color. 4px radius (DEFAULT). Always uppercase. Used for task categories (DEEP WORK, MEETING, COMMS, REVIEW) and project status badges (HIGH PRIORITY, WEEKEND).

### Icons
Material Symbols Outlined, rendered at thin stroke weight (1.5px equivalent). Always monochrome — filled variant used only to signal an active toggle state. Icon color follows contextual text: Near-Black for primary actions, Charcoal for secondary, Slate Gray for inactive.

### Modal / Task Detail Overlay
Pure White (`#ffffff`) panel elevated over a semi-transparent dimmed background. Corners at 8px radius (lg roundness). Standard ambient shadow scaled up for the elevated context. Sections (Notes, Sub-tasks, Attachments) are vertically stacked with generous `md` (24px) spacing between them. A sub-task progress counter (e.g., "1/3") uses JetBrains Mono label-caps.

### Navigation Sidebar
Fixed-width left panel in Off-White Canvas (`#f9f9fa`) or Container Low (`#f3f3f4`) background. Nav items are icon + Inter body-md label pairs. Active item uses Pure Black text and a left-edge indicator bar or Container High (`#e8e8e9`) row background. Inactive items use Charcoal (`#444748`).

---

## 5. Layout Principles

### Container & Max-Width
All primary content is constrained to a **maximum width of 800px**, centered within the viewport. This prevents task titles from spanning uncomfortably wide lines and preserves the document-like reading experience regardless of screen size.

### Baseline Grid
A **4px unit grid** governs all spacing decisions. The spacing scale in use:

| Token | Value | Typical Use |
|---|---|---|
| `xs` | 8px (0.5rem) | Icon padding, tight inline gaps |
| `sm` | 16px (1rem) | Internal component padding, row insets |
| `md` | 24px (1.5rem) | Section padding, card interiors, gutter |
| `lg` | 40px (2.5rem) | Between major sections (e.g., Today vs. Upcoming groups) |
| `xl` | 64px (4rem) | Page-level top/bottom breathing room |

### Two-Zone Layout
Every screen uses the same structural template: a **narrow left sidebar** (navigation) and a **wide main content area**. The sidebar contains only wayfinding — no content. The main area is always single-column and never exceeds 800px.

### Responsive Breakpoint
At **768px (md breakpoint)**: the left SideNavBar collapses and is replaced by a TopNavBar. Horizontal margins reduce from `md` (24px) to `sm` (16px). Headlines scale from desktop to mobile sizes (e.g., 32px → 26px). Content never becomes fully edge-to-edge; a minimum side margin is always preserved to maintain the minimalist framing effect.

### Whitespace Philosophy
Whitespace is used structurally, not decoratively. Large `lg` and `xl` gaps between logical task groups (e.g., "High Priority" vs. "Other Tasks") replace visual dividers as the primary means of sectioning. The eye navigates through space, not through lines or colors.

### Elevation & Depth
Three tonal layers create all depth:
1. **Base:** Off-White Canvas `#f9f9fa` — the page surface
2. **Surface:** Pure White `#ffffff` — elevated cards, modals, sidebar panels
3. **Interaction:** Ambient shadow `0px 10px 30px rgba(0,0,0,0.04)` on hover only — never at rest

Shadows appear exclusively on interactive or floating elements. Static surfaces are always flat.
