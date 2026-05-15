# SDD: Pantalla de Registro

## Overview

Full-page registration screen for new user account creation. Task-focused layout — no TopAppBar or BottomNavBar. Centers a single auth card vertically and horizontally on the viewport.

---

## ASCII Layout

```
┌─────────────────────────────────────────────────────────┐
│                     (bg: surface-container-low)         │
│                                                         │
│              ┌──────────────────────────┐               │
│              │   [check_box icon 48px]  │               │
│              │      Crear cuenta        │               │
│              │  Únete a Monochrome...   │               │
│              │──────────────────────────│               │
│              │  NOMBRE COMPLETO         │               │
│              │  ________________________│               │
│              │                          │               │
│              │  CORREO ELECTRÓNICO      │               │
│              │  ________________________│               │
│              │                          │               │
│              │  CONTRASEÑA              │               │
│              │  ________________________│               │
│              │                          │               │
│              │  ┌──────────────────┐    │               │
│              │  │   Registrarse    │    │               │
│              │  └──────────────────┘    │               │
│              │──────────────────────────│               │
│              │  ¿Ya tienes una cuenta?  │               │
│              │      Iniciar sesión      │               │
│              └──────────────────────────┘               │
│                      TASKFOCUS V.1.0                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Components

| Component | Element | Notes |
|---|---|---|
| Brand anchor | `material-symbols-outlined` icon `check_box` at 48px | Centered above title |
| Page title | `<h1>` — "Crear cuenta" | `headline-md` scale |
| Page subtitle | `<p>` — "Únete a Monochrome Task System" | `body-md`, `on-surface-variant` |
| Full name field | `<input type="text">` id `full_name` | Bottom-border only; placeholder "John Doe" |
| Email field | `<input type="email">` id `email` | Bottom-border only; placeholder "email@example.com" |
| Password field | `<input type="password">` id `password` | Bottom-border only; placeholder "••••••••" |
| Submit button | `<button type="submit">` — "Registrarse" | Full-width, `bg-primary`, `text-on-primary` |
| Sign-in link | `<a>` — "Iniciar sesión" | Below divider; links to login screen |
| Version label | `<span>` — "TASKFOCUS V.1.0" | `label-caps`, 40% opacity, below card |

---

## Card Container

- Max width: `420px`
- Background: `surface-container-lowest` (`#ffffff`)
- Padding: `p-lg` (mobile) → `p-xl` (md+)
- Border radius: `rounded-xl` (`0.5rem`)
- Border: `1px solid outline-variant`
- Shadow: `0px 10px 30px rgba(0, 0, 0, 0.04)`

---

## Input Fields

All three inputs share identical styling:

| Property | Value |
|---|---|
| Background | transparent |
| Border | bottom only, `border-outline-variant` |
| Border on focus | bottom darkens to `#1a1c1d` (on-surface) |
| Padding | `px-0 py-xs` |
| Text scale | `body-lg` (16px) |
| Placeholder color | `outline-variant` |
| Focus ring | none (`focus:ring-0`) |
| Label | `label-caps` (12px, JetBrains Mono, 0.05em tracking, uppercased) |
| Label color | `on-surface-variant` |

---

## Typography & Color Tokens

| Element | Font | Size token | Color token |
|---|---|---|---|
| Page title | Manrope | `headline-md` (24px/600) | `on-surface` |
| Page subtitle | Inter | `body-md` (14px/400) | `on-surface-variant` |
| Field labels | JetBrains Mono | `label-caps` (12px/500) | `on-surface-variant` |
| Field values | Inter | `body-lg` (16px/400) | `on-surface` |
| Submit button | Manrope | `headline-sm` (18px/500) | `on-primary` (`#ffffff`) |
| Sign-in prompt | Inter | `body-md` | `on-surface-variant` |
| Sign-in link | Manrope | `headline-sm` | `primary` (`#000000`) |
| Version label | JetBrains Mono | `label-caps` | `on-surface` @ 40% opacity |

---

## Spacing

| Area | Token | Value |
|---|---|---|
| Between brand icon and title text | `mb-md` | 1.5rem |
| Between brand block and form | `mb-lg` | 2.5rem |
| Between form fields | `space-y-md` | 1.5rem |
| Label-to-input gap | `gap-xs` | 0.5rem |
| Top padding before submit button | `pt-md` | 1.5rem |
| Divider section top margin | `mt-lg` + `pt-lg` | 2.5rem each |
| Version label top margin | `mt-lg` | 2.5rem |

---

## Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| Mobile (default) | Card padding `p-lg` (2.5rem); full-width within `px-sm` page gutter |
| `md` (768px+) | Card padding grows to `p-xl` (4rem) |
| All breakpoints | Card constrained to `max-w-[420px]`; centered via flex |

No navigation bars are rendered on this screen at any breakpoint.

---

## Interaction Specs

| Interaction | Behavior |
|---|---|
| Input focus | Bottom border transitions to `#1a1c1d`; no outline ring |
| Submit button hover | `opacity-90` |
| Submit button active | `scale-[0.98]` |
| Sign-in link hover | `underline` with `underline-offset-4`, 1px decoration |
| Form submit | `action="#"` (placeholder — to be wired to Server Action) |

---

## Accessibility Notes

- All inputs have explicit `<label>` elements linked via `for`/`id` pairs
- `<h1>` used for the page title (one per page)
- Submit is a `<button type="submit">` inside a `<form>` (keyboard-accessible by default)
- `lang="es"` set on `<html>` for screen readers
- Color contrast: black text on white card — passes WCAG AA

---

## States to Implement

| State | Notes |
|---|---|
| Default | Empty form, all fields neutral |
| Field focus | Bottom border darkens to `on-surface` |
| Field filled | Value text in `on-surface` |
| Loading | Submit button disabled + loading indicator (TBD) |
| Validation error | Inline error below field, `error` color token (`#ba1a1a`) |
| Success | Redirect to app (or confirmation screen) |
| Already registered | Error message near submit or redirect to sign-in |

---

## Links

- **Sign in:** `href="#"` → `/login` (to be implemented)
- **Form action:** Server Action `registerUser` (to be implemented)
