## MODIFIED Requirements

### Requirement: AddTodo Component
The AddTodo component SHALL provide a form to create new todos with priority selection.

#### Scenario: Form submission
- **WHEN** form is submitted with non-empty title
- **THEN** onAdd callback is invoked with title and priority, and input is cleared

#### Scenario: Empty validation
- **WHEN** input is empty
- **THEN** add button is disabled

#### Scenario: Priority selection
- **WHEN** user creates a new todo
- **THEN** user can select priority level (low, medium, high) from dropdown

#### Scenario: Default priority
- **WHEN** AddTodo form is displayed
- **THEN** priority dropdown defaults to "medium"

#### Scenario: Priority reset
- **WHEN** todo is successfully created
- **THEN** priority dropdown resets to "medium" for next todo
