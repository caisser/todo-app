## MODIFIED Requirements

### Requirement: Registration form validates input
The system SHALL validate all required fields and surface inline errors below affected fields using the `error` color token (`#ba1a1a`). Password MUST be at least 6 characters; shorter values SHALL be rejected with an inline error before the request reaches Supabase. Duplicate-account detection SHALL rely exclusively on Supabase's `error.code` (e.g. `'user_already_exists'`) and MUST NOT match on `error.status === 422`, because `422` is also returned for other validation failures such as weak-password rejections and would mask them behind the duplicate-account UX.

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
- **AND** Supabase returns an error with `error.code === 'user_already_exists'`
- **THEN** an error message appears near the submit button indicating the account already exists, and a link to the sign-in page is shown

#### Scenario: Weak password is not misclassified as duplicate account
- **WHEN** Supabase returns an error with `error.status === 422` but no `error.code === 'user_already_exists'` (e.g. a weak-password rejection)
- **THEN** the registration action does NOT display the "account already exists" message and instead surfaces the underlying error via the generic error path
