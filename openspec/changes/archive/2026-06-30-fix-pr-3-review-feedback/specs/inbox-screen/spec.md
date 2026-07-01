## MODIFIED Requirements

### Requirement: Inbox page header shows title and supporting subtitle
The `PageHeader` SHALL display the title "Inbox" using the `text-headline-lg` token in `text-primary`, followed by the subtitle "Your high-priority items demanding attention." using `text-body-md` in `text-secondary`. The title-to-subtitle gap SHALL be `mb-xs` and the header block SHALL have `mb-lg` beneath it. The title MUST be rendered as `<h1>` — the shell layout does not own a page-level heading, so the Inbox page is responsible for the document's single `<h1>`.

#### Scenario: Header content and spacing
- **WHEN** the Inbox page renders
- **THEN** the DOM contains an `<h1>` with text "Inbox" and a sibling paragraph "Your high-priority items demanding attention." with the specified typography and spacing

#### Scenario: Document has exactly one h1
- **WHEN** the Inbox page renders inside the shell
- **THEN** the DOM contains exactly one `<h1>` element and it is the one rendered by `PageHeader`

### Requirement: Tasks are organised into labelled groups
The system SHALL render each task group inside a `TaskGroup` component consisting of a `GroupLabel` (icon + uppercase caption in `font-label-caps text-label-caps text-secondary`) followed by a `TaskList`. The "High Priority" label SHALL use a flag icon; the "Other Tasks" label SHALL use a bars icon. Group labels SHALL be marked up as `<h2>` so the document reads `<h1>` (page title) → `<h2>` (group label).

#### Scenario: High Priority group label
- **WHEN** the High Priority group renders
- **THEN** its `GroupLabel` contains a flag Material Symbol and the uppercase caption "HIGH PRIORITY"

#### Scenario: Other Tasks group label
- **WHEN** the Other Tasks group renders
- **THEN** its `GroupLabel` contains a bars Material Symbol and the uppercase caption "OTHER TASKS"

#### Scenario: Group heading hierarchy
- **WHEN** any `TaskGroup` renders
- **THEN** the group label is marked up as an `<h2>` so the document has `<h1>` (page title) → `<h2>` (group label) hierarchy
