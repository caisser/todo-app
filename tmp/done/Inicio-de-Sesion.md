# SDD: Inicio de Sesión (Login Screen)

## Overview

Full-screen centered login form for the Monochrome Task System. Single-purpose screen — no navigation, no sidebar. Serves as the app entry point for authentication and account creation.

---

## ASCII Layout

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│                  [task_alt icon]                    │
│                     Tasks                           │
│              MONOCHROME TASK SYSTEM                 │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │                                               │  │
│  │  EMAIL                                        │  │
│  │  ─────────────────────────────────────────    │  │
│  │  nombre@compania.com                          │  │
│  │                                               │  │
│  │  CONTRASEÑA          ¿OLVIDASTE TU CONTRASEÑA?│  │
│  │  ─────────────────────────────────────────    │  │
│  │  ••••••••                                     │  │
│  │                                               │  │
│  │  ┌─────────────────────────────────────────┐  │  │
│  │  │           Iniciar Sesión                │  │  │
│  │  └─────────────────────────────────────────┘  │  │
│  │                                               │  │
│  │  ┌─────────────────────────────────────────┐  │  │
│  │  │             Crear cuenta                │  │  │
│  │  └─────────────────────────────────────────┘  │  │
│  │                                               │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  ░░░░░░░░░░░░ blurred bg image ░░░░░░░░░░░░░░░░░░   │
└─────────────────────────────────────────────────────┘
```

---

## Component Table

| Component | Type | Description |
|---|---|---|
| `AppIcon` | Visual | 48×48px black square (rounded-lg), `task_alt` Material Symbol in white |
| `AppTitle` | Heading | "Tasks" — `font-headline-lg`, `text-headline-lg`, `text-primary` |
| `AppSubtitle` | Label | "MONOCHROME TASK SYSTEM" — `font-label-caps`, `text-label-caps`, `text-secondary` |
| `LoginCard` | Container | White card, no border at rest, shadow-diffused on hover only, `rounded-lg`, max-width 400px |
| `EmailField` | Input | `type="email"`, bottom-border only, label "EMAIL" in label-caps |
| `PasswordField` | Input | `type="password"`, bottom-border only, label "CONTRASEÑA" in label-caps |
| `ForgotPasswordLink` | Link | "¿OLVIDASTE TU CONTRASEÑA?" — inline with password label, `text-primary`, label-caps |
| `SubmitButton` | Button | Full-width, black fill, "Iniciar Sesión", `font-body-lg`, `rounded` |
| `CreateAccountButton` | Link styled as Button | Full-width, outlined (border-primary), "Crear cuenta", `font-body-lg`, `rounded` |
| `DecorativeBackground` | Visual | Fixed bottom overlay, grayscale blurred image, `opacity-20`, `pointer-events-none` |

---

## Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| Mobile (< 768px) | Same layout; card fills width with `px-gutter` (1.5rem) side padding |
| Desktop (≥ 768px) | Card constrained to `max-w-[400px]`, centered on screen |

No navigation (sidebar or top bar) on this screen at any breakpoint — auth screens are navigation-free.

---

## Typography & Color Tokens

| Element | Font | Size Token | Color Token |
|---|---|---|---|
| "Tasks" heading | Manrope | `text-headline-lg` (32px) | `text-primary` (#000) |
| "MONOCHROME TASK SYSTEM" | JetBrains Mono | `text-label-caps` (12px) | `text-secondary` (#5d5e66) |
| Field labels ("EMAIL", "CONTRASEÑA") | JetBrains Mono | `text-label-caps` (12px) | `text-secondary` |
| Forgot password link | JetBrains Mono | `text-label-caps` (12px) | `text-primary` |
| Input text | Inter | `text-body-md` (14px) | `text-on-surface` |
| Input placeholder | Inter | `text-body-md` (14px) | `text-secondary` |
| "Iniciar Sesión" button | Inter | `text-body-lg` (16px, semibold) | `text-on-primary` (#fff) |
| "Crear cuenta" button | Inter | `text-body-lg` (16px, semibold) | `text-primary` |
| Card background | — | — | `bg-surface-container-lowest` (#fff) |
| Page background | — | — | `bg-background` (#f9f9fa) |

---

## Interaction Specs

| Element | State | Behavior |
|---|---|---|
| `LoginCard` | Hover | Ambient shadow `0px 10px 30px rgba(0,0,0,0.04)` — flat at rest |
| Email / Password input | Focus | Bottom border transitions to `border-primary` (black); no outline or glow |
| "Iniciar Sesión" button | Hover | `opacity-90` |
| "Iniciar Sesión" button | Active | `scale-[0.98]` |
| "Crear cuenta" button | Hover | `bg-surface-container-low` fill |
| "Crear cuenta" button | Active | `scale-[0.98]` |
| Forgot password link | Hover | `opacity-70` |

---

## Spacing

| Area | Value |
|---|---|
| Branding → card gap | `mb-xl` (4rem) |
| Icon → title gap | `mb-md` (1.5rem) |
| Card internal padding | `p-lg` (2.5rem) |
| Between form fields | `space-y-md` (1.5rem) |
| Label → input gap | `space-y-xs` (0.5rem) |
| Input vertical padding | `py-sm` (1rem) |
| "Iniciar Sesión" top margin | `mt-md` (1.5rem) |
| "Crear cuenta" top margin | `mt-sm` (1rem) |

---

## Accessibility Notes

- `<label for="email">` and `<label for="password">` correctly associated with inputs via `id`
- Password input uses `type="password"` (browser-native masking)
- Forgot password link is an `<a>` element — keyboard focusable
- Both buttons are semantically correct (`<button type="submit">` and `<a>` styled as button)
- Decorative background image has `pointer-events-none` and no required alt text (presentational)
- Screen should trap focus within the form; no skip-nav needed (no page navigation present)

---

## Notes

- No social login (Google, GitHub, etc.) — placeholders exist in HTML as empty comments
- No footer link — placeholder exists in HTML as empty comment
- The "Crear cuenta" CTA links to a separate registration flow (not yet designed)
- Forgot password links to a recovery flow (not yet designed)
- Form `action` / `onSubmit` handler to be wired to Supabase Auth at implementation time
