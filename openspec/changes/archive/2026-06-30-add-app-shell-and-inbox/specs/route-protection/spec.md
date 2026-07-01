## ADDED Requirements

### Requirement: Next.js middleware runs on every non-static request
The system SHALL define a Next.js `middleware.ts` at the repository root that runs on every request path except static assets. Its matcher SHALL exclude `_next/static`, `_next/image`, `favicon.ico`, and image file extensions (`svg`, `png`, `jpg`, `jpeg`, `gif`, `webp`).

#### Scenario: Middleware runs on a page request
- **WHEN** the browser requests any HTML page route
- **THEN** `middleware.ts` executes before the route handler

#### Scenario: Middleware skips static assets
- **WHEN** the browser requests a file under `_next/static`, `_next/image`, `/favicon.ico`, or with an image extension
- **THEN** `middleware.ts` does not execute for that request

### Requirement: Middleware reads and refreshes the Supabase session
The middleware SHALL construct a Supabase server client bound to the incoming request cookies and call `supabase.auth.getUser()`. It SHALL write any refreshed auth cookies onto the outgoing `NextResponse` before returning.

#### Scenario: Session cookie is refreshed
- **WHEN** middleware runs for an authenticated request with a soon-to-expire session
- **THEN** the outgoing response carries updated Supabase auth cookies

#### Scenario: getUser is awaited on every request
- **WHEN** middleware runs
- **THEN** it awaits `supabase.auth.getUser()` before deciding whether to redirect

### Requirement: Unauthenticated users are redirected away from protected routes
The system SHALL treat every route under `app/(app)/` (i.e., every route sharing the shell layout) as protected. When middleware determines there is no authenticated user and the requested path is protected, it SHALL respond with `NextResponse.redirect(new URL('/login', request.url))`.

#### Scenario: Signed-out user visits /inbox
- **WHEN** a user without a valid Supabase session requests `/inbox`
- **THEN** middleware redirects to `/login`

#### Scenario: Signed-out user visits any future protected route
- **WHEN** a user without a valid Supabase session requests any route rendered by `app/(app)/layout.tsx`
- **THEN** middleware redirects to `/login`

### Requirement: Authenticated users are bounced away from auth screens
When middleware determines the request has an authenticated user and the requested path is `/login` or `/register`, it SHALL respond with `NextResponse.redirect(new URL('/inbox', request.url))`.

#### Scenario: Signed-in user visits /login
- **WHEN** a user with a valid Supabase session requests `/login`
- **THEN** middleware redirects to `/inbox`

#### Scenario: Signed-in user visits /register
- **WHEN** a user with a valid Supabase session requests `/register`
- **THEN** middleware redirects to `/inbox`

### Requirement: Public routes pass through unchanged
Requests to routes that are neither under `app/(app)/` nor `/login` / `/register` SHALL continue to their route handler with `NextResponse.next()` — carrying the refreshed cookies if any.

#### Scenario: Root or public route passes through
- **WHEN** an authenticated or unauthenticated user requests a public route not covered by the protected or auth-screen rules
- **THEN** middleware returns `NextResponse.next()` with the refreshed cookies attached
