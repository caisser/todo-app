## MODIFIED Requirements

### Requirement: User can submit the registration form
The system SHALL allow a user to enter full name, email, and password and submit the form to create a new account via the `registerUser` Server Action. When Supabase returns a successful signup but no session (email confirmation pending), the system SHALL display an informational message instructing the user to check their email instead of redirecting to the app.

#### Scenario: Successful registration — session returned
- **WHEN** the user fills in a valid full name, email, and password and submits the form
- **AND** Supabase returns a session alongside the user record
- **THEN** the `registerUser` Server Action calls `supabase.auth.signUp()` with the provided credentials and the full name stored in user metadata, and the user is redirected to the app

#### Scenario: Successful registration — email confirmation required
- **WHEN** the user fills in a valid full name, email, and password and submits the form
- **AND** Supabase returns no error but also no session (email confirmation is enabled)
- **THEN** no redirect occurs and the page displays an informational message telling the user to check their email to confirm their account

#### Scenario: Submit button shows loading state
- **WHEN** the form is submitted and the Server Action is pending
- **THEN** the submit button is disabled and displays a loading indicator

### Requirement: Registration form validates input
The system SHALL validate all required fields and surface inline errors below affected fields using the `error` color token (`#ba1a1a`). Password MUST be at least 6 characters; shorter values SHALL be rejected with an inline error before the request reaches Supabase. Duplicate-account detection SHALL use `error.code` (e.g. `'user_already_exists'`) or `error.status === 422` rather than substring matching on `error.message`.

#### Scenario: Empty fields on submit
- **WHEN** the user submits the form with one or more empty required fields
- **THEN** an inline error message appears below each empty field and the account is not created

#### Scenario: Invalid email format
- **WHEN** the user submits the form with a malformed email address
- **THEN** an inline error message appears below the email field indicating the format is invalid

#### Scenario: Password too short
- **WHEN** the user submits the form with a password shorter than 6 characters
- **THEN** an inline error appears below the password field before any Supabase call is made

#### Scenario: Email already registered
- **WHEN** the user submits the form with an email address already in use
- **AND** Supabase returns an error with code `'user_already_exists'` or status `422`
- **THEN** an error message appears near the submit button indicating the account already exists, and a link to the sign-in page is shown

### Requirement: User can navigate to the sign-in screen
The system SHALL provide a link below the form divider that navigates to the login screen using client-side navigation (Next.js `<Link>`). No additional sign-in navigation link SHALL appear inside error state blocks.

#### Scenario: Sign-in link navigates to login
- **WHEN** the user clicks "Iniciar sesión" below the form divider
- **THEN** the browser navigates to `/login` without a full page reload

#### Scenario: Error block has no duplicate sign-in link
- **WHEN** a global error message is displayed
- **THEN** no additional "Iniciar sesión" anchor appears inside the error block
