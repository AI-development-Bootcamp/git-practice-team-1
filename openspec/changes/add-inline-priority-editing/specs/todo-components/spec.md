## MODIFIED Requirements

### Requirement: TodoItem Component
The TodoItem component SHALL display a single todo with actions and inline priority editing.

#### Scenario: Display todo
- **WHEN** todo is rendered
- **THEN** title, toggle button, priority badge, and delete button are shown

#### Scenario: Done styling
- **WHEN** todo status is done
- **THEN** title has strikethrough and opacity is reduced

#### Scenario: Toggle action
- **WHEN** toggle button is clicked
- **THEN** onToggle callback is invoked with todo ID

#### Scenario: Delete action
- **WHEN** delete button is clicked
- **THEN** onDelete callback is invoked with todo ID

#### Scenario: Priority badge clickable
- **WHEN** priority badge is displayed
- **THEN** badge shows cursor pointer on hover indicating it is clickable

#### Scenario: Open priority dropdown
- **WHEN** priority badge is clicked
- **THEN** dropdown menu appears with all priority options (low, medium, high)

#### Scenario: Current priority highlighted
- **WHEN** priority dropdown is open
- **THEN** current priority option is visually highlighted

#### Scenario: Change priority
- **WHEN** user selects a different priority from dropdown
- **THEN** onPriorityChange callback is invoked with todo ID and new priority
- **AND** dropdown closes automatically

#### Scenario: Close dropdown on outside click
- **WHEN** priority dropdown is open and user clicks outside
- **THEN** dropdown closes without changing priority

#### Scenario: Priority update persists
- **WHEN** priority is changed via dropdown
- **THEN** new priority is saved to backend and badge updates immediately

## MODIFIED Requirements

### Requirement: TodoList Component
The TodoList component SHALL display todos grouped by status and pass priority change events.

#### Scenario: Empty state
- **WHEN** no todos exist
- **THEN** message "No todos yet. Add one above!" is shown

#### Scenario: Grouped display
- **WHEN** todos exist
- **THEN** they are grouped into "To Do" and "Done" sections

#### Scenario: Section counts
- **WHEN** sections are displayed
- **THEN** each section header shows item count

#### Scenario: Priority change propagation
- **WHEN** TodoItem triggers priority change
- **THEN** onPriorityChange callback is propagated to parent App component

## MODIFIED Requirements

### Requirement: App Component
The App component SHALL manage todo state, coordinate child components, and handle priority updates.

#### Scenario: Initial load
- **WHEN** app mounts
- **THEN** todos are fetched from API and displayed

#### Scenario: Loading state
- **WHEN** todos are being fetched
- **THEN** loading indicator is shown

#### Scenario: Error display
- **WHEN** API error occurs
- **THEN** error message is displayed with dismiss button

#### Scenario: Priority change handling
- **WHEN** user changes todo priority via inline dropdown
- **THEN** App component updates todo via API
- **AND** local state is updated with new priority
- **AND** UI reflects the change immediately
