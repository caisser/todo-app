# inbox-screen Specification

## Purpose

Defines the Inbox screen at `/inbox`, its header, task groups, task-row anatomy, and the data-fetching seam that will later be backed by Supabase.

## Requirements

### Requirement: Inbox screen renders at /inbox inside the authenticated shell
The system SHALL render the Inbox screen at `/inbox` as a Server Component page located at `app/(app)/inbox/page.tsx`. The page SHALL inherit the shell chrome from `app/(app)/layout.tsx` and SHALL display, in order: a page header, a "High Priority" task group, and an "Other Tasks" task group.

#### Scenario: Authenticated user visits /inbox
- **WHEN** an authenticated user navigates to `/inbox`
- **THEN** the shell renders around a page containing "Inbox" header, "High Priority" group, and "Other Tasks" group

#### Scenario: Inbox is the active sidebar item on /inbox
- **WHEN** the user is on `/inbox`
- **THEN** the sidebar's Inbox `NavItem` renders in its active variant with `aria-current="page"`

### Requirement: Inbox page header shows title and supporting subtitle
The `PageHeader` SHALL display the title "Inbox" using the `text-headline-lg` token in `text-primary`, followed by the subtitle "Your high-priority items demanding attention." using `text-body-md` in `text-secondary`. The title-to-subtitle gap SHALL be `mb-xs` and the header block SHALL have `mb-lg` beneath it.

#### Scenario: Header content and spacing
- **WHEN** the Inbox page renders
- **THEN** the DOM contains an `<h1>` (or `<h2>` when the shell already provides an `<h1>`) with text "Inbox" and a sibling paragraph "Your high-priority items demanding attention." with the specified typography and spacing

### Requirement: Tasks are organised into labelled groups
The system SHALL render each task group inside a `TaskGroup` component consisting of a `GroupLabel` (icon + uppercase caption in `font-label-caps text-label-caps text-secondary`) followed by a `TaskList`. The "High Priority" label SHALL use a flag icon; the "Other Tasks" label SHALL use a bars icon.

#### Scenario: High Priority group label
- **WHEN** the High Priority group renders
- **THEN** its `GroupLabel` contains a flag Material Symbol and the uppercase caption "HIGH PRIORITY"

#### Scenario: Other Tasks group label
- **WHEN** the Other Tasks group renders
- **THEN** its `GroupLabel` contains a bars Material Symbol and the uppercase caption "OTHER TASKS"

#### Scenario: Group heading hierarchy
- **WHEN** any `TaskGroup` renders
- **THEN** the group label is marked up as an `<h3>` so the document has h2 (page title) → h3 (group label) hierarchy

### Requirement: Task row displays checkbox, title, due date, and project tag
Each `TaskRow` SHALL render a `TaskCheckbox`, a `TaskTitle`, a `TaskDueDate`, and a `TaskProjectTag`, laid out as `flex items-start gap-sm py-sm px-xs border-b border-outline-variant bg-surface-bright rounded-sm`. The checkbox SHALL be associated with the title via matching `id` / `for` attributes.

#### Scenario: Row anatomy
- **WHEN** a `TaskRow` renders for a task
- **THEN** it contains one `TaskCheckbox`, one `TaskTitle` label bound to the checkbox via `for`/`id`, one `TaskDueDate` chip, and one `TaskProjectTag`

#### Scenario: Row hover elevation
- **WHEN** a pointer hovers a `TaskRow`
- **THEN** the row transitions to `bg-surface-container-low`, applies `shadow-[0px_10px_30px_rgba(0,0,0,0.04)]`, and shifts up by 1px (`translateY(-1px)`) over `all 0.2s ease`

### Requirement: Task checkbox animates on check and strikes through the title
The `TaskCheckbox` SHALL be a native `<input type="checkbox">` styled to 1.25em square with a 1.5px `border-outline` border and `rounded-[2px]`. When checked it SHALL fill `bg-primary` with a clip-path checkmark that animates `scale(0) → scale(1)` over 120ms `ease-in-out`. The associated `TaskTitle` SHALL receive `line-through` and `opacity-50` while checked.

#### Scenario: Checking a task marks it visually complete
- **WHEN** a user checks a `TaskCheckbox`
- **THEN** the checkbox fills black, the checkmark animates in over 120ms, and the associated `TaskTitle` renders with `line-through opacity-50`

#### Scenario: Unchecking a task restores the default state
- **WHEN** a user unchecks a previously checked `TaskCheckbox`
- **THEN** the checkbox returns to its unfilled state and the title's strikethrough and opacity are removed

### Requirement: Task due date colour reflects urgency
`TaskDueDate` SHALL render an `event` Material Symbol (14px) followed by the due-date label using `font-body-md`. When the task is due today the chip SHALL use `text-error`; otherwise it SHALL use `text-secondary`.

#### Scenario: Due-today chip is error-coloured
- **WHEN** a task's due date is today
- **THEN** its `TaskDueDate` renders in `text-error`

#### Scenario: Future or other due-date chip is secondary
- **WHEN** a task's due date is not today
- **THEN** its `TaskDueDate` renders in `text-secondary`

### Requirement: Project tag is rendered as a mono-uppercase pill
`TaskProjectTag` SHALL render the task's project name in `font-label-caps text-label-caps` with `bg-surface-container-low`, `px-2 py-1`, `rounded`, and `text-secondary`.

#### Scenario: Project tag styling
- **WHEN** a `TaskRow` renders a task with a project
- **THEN** the project name appears in the specified mono-uppercase pill styling

### Requirement: Inbox reads tasks from a single fetch seam
The Inbox page SHALL obtain its task list by calling `getInboxTasks()` exported from `app/(app)/inbox/data.ts`. This function SHALL return an array of tasks shaped `{ id, title, dueDate, projectName, priority, completed }`. The initial implementation SHALL return mock data; the function signature SHALL be the sole change surface when Supabase persistence is introduced.

#### Scenario: Page reads tasks via getInboxTasks
- **WHEN** `app/(app)/inbox/page.tsx` renders
- **THEN** it awaits `getInboxTasks()` and passes the resulting array (partitioned by `priority`) into the two `TaskGroup`s

#### Scenario: Mock task shape matches contract
- **WHEN** `getInboxTasks()` runs in the mock implementation
- **THEN** it returns tasks whose fields match `{ id: string, title: string, dueDate: Date | string, projectName: string, priority: 'high' | 'other', completed: boolean }`

### Requirement: Inbox canvas is constrained and centered
The `InboxCanvas` SHALL apply `pt-[80px] pb-xl px-sm md:px-lg max-w-container-max mx-auto mt-lg` so the content sits below the fixed top navigation, is padded horizontally, is constrained to the container max-width (800px), and is centered inside the main content area.

#### Scenario: Canvas layout
- **WHEN** the Inbox page renders
- **THEN** the content wrapper has classes equivalent to `pt-[80px] pb-xl px-sm md:px-lg max-w-container-max mx-auto mt-lg`
