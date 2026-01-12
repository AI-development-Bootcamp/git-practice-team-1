## MODIFIED Requirements

### Requirement: App Component
The App component SHALL manage todo state, coordinate child components, and handle view switching.

#### Scenario: Initial load
- **WHEN** app mounts
- **THEN** todos are fetched from API and displayed

#### Scenario: Loading state
- **WHEN** todos are being fetched
- **THEN** loading indicator is shown

#### Scenario: Error display
- **WHEN** API error occurs
- **THEN** error message is displayed with dismiss button

#### Scenario: View switching
- **WHEN** user toggles between List and Board views
- **THEN** appropriate view component is rendered with same data

## ADDED Requirements

### Requirement: View Navigation Component
The app SHALL provide a navigation component to switch between List and Board views.

#### Scenario: Navigation display
- **WHEN** app is rendered
- **THEN** view toggle buttons are displayed in header

#### Scenario: View selection
- **WHEN** user clicks a view button
- **THEN** the corresponding view becomes active

#### Scenario: Active view highlight
- **WHEN** a view is active
- **THEN** its button is visually highlighted

#### Scenario: Initial view
- **WHEN** app first loads
- **THEN** List view is displayed by default
