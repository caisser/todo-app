## Why

New users have no way to create an account in the app. The registration screen is the entry point to the auth flow, and without it users cannot sign up for the Monochrome Task System.

## What Changes

- Add a full-page registration screen (`/register`) with fields for full name, email, and password
- Add a `registerUser` Server Action that validates input and creates a new Supabase Auth user
- Wire the registration form to the Server Action with loading, validation error, and success states
- Add a link from the sign-in page to the registration screen

## Capabilities

### New Capabilities

- `user-registration`: Full-page form at `/register` — collects full name, email, and password; submits via Server Action; handles validation errors, loading state, and post-registration redirect

### Modified Capabilities

<!-- None — no existing spec requirements are changing -->

## Impact

- **New page:** `app/register/page.tsx`
- **New Server Action:** `app/register/actions.ts` (`registerUser`)
- **New components:** registration form card (auth layout pattern, no TopAppBar/BottomNavBar)
- **Dependency:** Supabase Auth (`@supabase/ssr`) — not yet installed; must be added
- **Env vars required:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
