## Why

The app has no authentication entry point — users currently land directly in the task UI with no way to sign in or create an account. The login screen is the required first step before any Supabase Auth integration can be wired up.

## What Changes

- Add a new `/login` route (Next.js App Router page) with a full-screen centered login form
- Implement email/password fields with bottom-border-only styling (matching the design system)
- Provide "Iniciar Sesión" (submit) and "Crear cuenta" (link to registration) CTAs
- Add a "¿Olvidaste tu contraseña?" forgot-password link
- Include a decorative blurred background image overlay
- No navigation bar — auth screens are navigation-free

## Capabilities

### New Capabilities

- `login-screen`: Full-screen centered login form serving as the app entry point for authentication and account creation

### Modified Capabilities

<!-- None — this is a net-new screen with no existing spec to delta -->

## Impact

- New file: `app/login/page.tsx`
- New UI components: `components/ui/TextField.tsx` (if not yet created), login-specific layout components
- Supabase Auth (`onSubmit` handler) will be wired in a follow-on change — form is structurally complete but not functionally connected
- No sidebar or top nav rendered on this route
