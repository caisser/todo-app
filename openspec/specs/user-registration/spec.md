## ADDED Requirements

### Requirement: Registration page renders correctly
The system SHALL render a full-page registration screen at `/register` with no TopAppBar or BottomNavBar, centered card layout, and all fields defined in the SDD (full name, email, password).

#### Scenario: Page loads with empty form
- **WHEN** a user navigates to `/register`
- **THEN** the page renders the registration card with empty full name, email, and password fields and an enabled "Registrarse" submit button

#### Scenario: Page renders without navigation bars
- **WHEN** a user navigates to `/register`
- **THEN** no TopAppBar or BottomNavBar is present at any breakpoint

### Requirement: User can submit the registration form
The system SHALL allow a user to enter full name, email, and password and submit the form to create a new account via the `registerUser` Server Action.

#### Scenario: Successful registration
- **WHEN** the user fills in a valid full name, email, and password and submits the form
- **THEN** the `registerUser` Server Action calls `supabase.auth.signUp()` with the provided credentials and the full name stored in user metadata, and the user is redirected to the app

#### Scenario: Submit button shows loading state
- **WHEN** the form is submitted and the Server Action is pending
- **THEN** the submit button is disabled and displays a loading indicator

### Requirement: Registration form validates input
The system SHALL validate all required fields and surface inline errors below affected fields using the `error` color token (`#ba1a1a`).

#### Scenario: Empty fields on submit
- **WHEN** the user submits the form with one or more empty required fields
- **THEN** an inline error message appears below each empty field and the account is not created

#### Scenario: Invalid email format
- **WHEN** the user submits the form with a malformed email address
- **THEN** an inline error message appears below the email field indicating the format is invalid

#### Scenario: Email already registered
- **WHEN** the user submits the form with an email address already in use
- **THEN** an error message appears near the submit button indicating the account already exists, and a link to the sign-in page is shown

### Requirement: User can navigate to the sign-in screen
The system SHALL provide a link below the form divider that navigates to the login screen.

#### Scenario: Sign-in link navigates to login
- **WHEN** the user clicks "Iniciar sesión" below the form divider
- **THEN** the browser navigates to `/login`
