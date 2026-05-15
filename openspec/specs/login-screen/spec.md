## ADDED Requirements

### Requirement: Login page renders at /login route
The system SHALL render a full-screen, navigation-free login page at the `/login` route. The page SHALL display the app branding (icon + "Tasks" heading + "MONOCHROME TASK SYSTEM" subtitle), a login card, and a decorative background image.

#### Scenario: Visiting /login shows login UI
- **WHEN** a user navigates to `/login`
- **THEN** the full-screen login layout is displayed with no sidebar or top navigation bar

#### Scenario: Branding is visible above the card
- **WHEN** the login page is rendered
- **THEN** a 48×48px black rounded icon, "Tasks" headline, and "MONOCHROME TASK SYSTEM" label-caps subtitle are displayed above the card

### Requirement: Login form collects email and password
The system SHALL render an email field and a password field inside the login card. Each field SHALL have a visible label in label-caps style and use bottom-border-only styling that transitions to `brand-primary` on focus.

#### Scenario: Email field is present and correctly typed
- **WHEN** the login card is rendered
- **THEN** an `<input type="email">` with label "EMAIL" is visible and associated via `for`/`id`

#### Scenario: Password field is present and masked
- **WHEN** the login card is rendered
- **THEN** an `<input type="password">` with label "CONTRASEÑA" is visible, associated via `for`/`id`, and input is masked by the browser

#### Scenario: Input border transitions on focus
- **WHEN** a user focuses an email or password field
- **THEN** the bottom border transitions to `brand-primary` (black)

### Requirement: Forgot password link is displayed inline with password label
The system SHALL display a "¿OLVIDASTE TU CONTRASEÑA?" link on the same row as the "CONTRASEÑA" label, right-aligned. The link SHALL be keyboard-focusable.

#### Scenario: Forgot password link is visible
- **WHEN** the login card is rendered
- **THEN** a "¿OLVIDASTE TU CONTRASEÑA?" link appears inline with the password label on the right side

### Requirement: Login card provides submit and account-creation CTAs
The login card SHALL contain a full-width "Iniciar Sesión" submit button (black fill) and a full-width "Crear cuenta" outlined button below it.

#### Scenario: Submit button is present
- **WHEN** the login card is rendered
- **THEN** a full-width black "Iniciar Sesión" button is displayed below the password field

#### Scenario: Create account button is present
- **WHEN** the login card is rendered
- **THEN** a full-width outlined "Crear cuenta" button is displayed below the submit button

#### Scenario: Form submission is handled (stub)
- **WHEN** a user submits the form
- **THEN** the default browser submission is prevented and a stub handler is invoked (no redirect or error until Supabase is wired)

### Requirement: Login page is responsive
The system SHALL render the login card full-width with `px-gutter` padding on mobile (< 768px) and constrain it to `max-w-[400px]` centered on desktop (≥ 768px).

#### Scenario: Mobile layout — card fills width
- **WHEN** the viewport is narrower than 768px
- **THEN** the login card fills the available width with 1.5rem side padding

#### Scenario: Desktop layout — card is centered and constrained
- **WHEN** the viewport is 768px or wider
- **THEN** the login card is horizontally centered and no wider than 400px

### Requirement: Decorative background is presentational only
The system SHALL render a fixed, blurred, grayscale background image at 20% opacity. The image SHALL have `aria-hidden="true"` and `pointer-events-none` so it does not interfere with interaction or assistive technology.

#### Scenario: Background image does not affect interaction
- **WHEN** the login page is rendered
- **THEN** the decorative background image has `pointer-events-none` and `aria-hidden="true"` applied
