## MODIFIED Requirements

### Requirement: Next.js middleware runs on every non-static request
The system SHALL define a Next.js `middleware.ts` at the repository root that runs on every request path except static assets. Its matcher SHALL exclude `_next/static`, `_next/image`, `favicon.ico`, common image file extensions (`svg`, `png`, `jpg`, `jpeg`, `gif`, `webp`, `ico`), stylesheet and script chunks (`css`, `js`), and font files (`woff`, `woff2`, `ttf`).

#### Scenario: Middleware runs on a page request
- **WHEN** the browser requests any HTML page route
- **THEN** `middleware.ts` executes before the route handler

#### Scenario: Middleware skips static assets
- **WHEN** the browser requests a file under `_next/static`, `_next/image`, `/favicon.ico`, or with an image extension (`svg`, `png`, `jpg`, `jpeg`, `gif`, `webp`, `ico`)
- **THEN** `middleware.ts` does not execute for that request

#### Scenario: Middleware skips fonts, stylesheets, and script chunks
- **WHEN** the browser requests a file with a `.css`, `.js`, `.woff`, `.woff2`, or `.ttf` extension
- **THEN** `middleware.ts` does not execute for that request and no Supabase `getUser()` call is made

### Requirement: Middleware reads and refreshes the Supabase session
The middleware SHALL construct a Supabase server client bound to the incoming request cookies and call `supabase.auth.getUser()`. It SHALL write any refreshed auth cookies onto the outgoing `NextResponse` before returning. Any redirect response returned by the middleware SHALL carry forward every cookie that Supabase wrote onto the initial response, so rotated refresh tokens are never dropped mid-redirect.

#### Scenario: Session cookie is refreshed
- **WHEN** middleware runs for an authenticated request with a soon-to-expire session
- **THEN** the outgoing response carries updated Supabase auth cookies

#### Scenario: getUser is awaited on every request
- **WHEN** middleware runs
- **THEN** it awaits `supabase.auth.getUser()` before deciding whether to redirect

#### Scenario: Redirect carries forward refreshed cookies
- **WHEN** middleware issues a `NextResponse.redirect(...)` on a request where Supabase rotated the auth cookies during `getUser()`
- **THEN** the redirect response contains every cookie that Supabase wrote onto the initial `NextResponse`, so the user's next request sees the rotated tokens rather than being signed out

### Requirement: Unauthenticated users are redirected away from protected routes
The system SHALL treat every route under `app/(app)/` (i.e., every route sharing the shell layout) as protected. When middleware determines there is no authenticated user and the requested path is protected, it SHALL respond with a `NextResponse.redirect(new URL('/login', request.url))` that carries forward all Supabase-mutated cookies from the initial response.

#### Scenario: Signed-out user visits /inbox
- **WHEN** a user without a valid Supabase session requests `/inbox`
- **THEN** middleware redirects to `/login` and the redirect response carries the Supabase cookies from the initial response

#### Scenario: Signed-out user visits any future protected route
- **WHEN** a user without a valid Supabase session requests any route rendered by `app/(app)/layout.tsx`
- **THEN** middleware redirects to `/login` and the redirect response carries the Supabase cookies from the initial response

### Requirement: Authenticated users are bounced away from auth screens
When middleware determines the request has an authenticated user and the requested path is `/login` or `/register`, it SHALL respond with a `NextResponse.redirect(new URL('/inbox', request.url))` that carries forward all Supabase-mutated cookies from the initial response.

#### Scenario: Signed-in user visits /login
- **WHEN** a user with a valid Supabase session requests `/login`
- **THEN** middleware redirects to `/inbox` and the redirect response carries the Supabase cookies from the initial response

#### Scenario: Signed-in user visits /register
- **WHEN** a user with a valid Supabase session requests `/register`
- **THEN** middleware redirects to `/inbox` and the redirect response carries the Supabase cookies from the initial response
