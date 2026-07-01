## MODIFIED Requirements

### Requirement: Login card provides submit and account-creation CTAs
The login card SHALL contain a full-width "Iniciar Sesión" submit button (black fill) and a full-width "Crear cuenta" outlined button below it. The form SHALL be submitted to a Server Action that authenticates against Supabase; on success the action SHALL `redirect('/inbox')`, and on failure it SHALL return an error message that is displayed inline above the submit button. The page SHALL consume the action via React 19's `useActionState`, mirroring the pattern in `app/register/actions.ts`.

#### Scenario: Submit button is present
- **WHEN** the login card is rendered
- **THEN** a full-width black "Iniciar Sesión" button is displayed below the password field

#### Scenario: Create account button is present
- **WHEN** the login card is rendered
- **THEN** a full-width outlined "Crear cuenta" button is displayed below the submit button

#### Scenario: Successful login redirects to /inbox
- **WHEN** a user submits the form with credentials accepted by `supabase.auth.signInWithPassword`
- **THEN** the Server Action clears any prior error state, writes the Supabase session cookie, and issues `redirect('/inbox')`

#### Scenario: Failed login surfaces an inline error
- **WHEN** the Server Action's call to `supabase.auth.signInWithPassword` returns an error
- **THEN** the action returns `{ error: <message> }` and the page renders that message inline above the submit button without navigating

#### Scenario: Submit button reflects pending state
- **WHEN** the form is submitting
- **THEN** the submit button is disabled and its label reflects the pending state via the `useActionState` `pending` flag
