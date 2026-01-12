# board-view Specification

## Purpose
Provide a Kanban-style board interface for visualizing and managing todos across status columns, with drag-and-drop functionality for status updates.

## ADDED Requirements

### Requirement: Board Layout
The Board component SHALL display todos organized in columns by status.

#### Scenario: Column creation
- **WHEN** board is rendered
- **THEN** one column is created for each status returned by the statuses endpoint (default: 'todo', 'in-progress', 'review', 'done')

#### Scenario: Empty board
- **WHEN** no todos exist
- **THEN** empty columns are shown with message "No tasks yet"

#### Scenario: Card distribution
- **WHEN** todos exist
- **THEN** each todo is displayed as a card in its corresponding status column

### Requirement: Column Headers
Each column header SHALL display the status name and task count.

#### Scenario: Task count display
- **WHEN** column contains todos
- **THEN** header shows "Status Name (X)" where X is the number of todos

#### Scenario: Empty column count
- **WHEN** column contains no todos
- **THEN** header shows "Status Name (0)"

### Requirement: Todo Card Display
Todos SHALL be displayed as cards with essential information.

#### Scenario: Card content
- **WHEN** todo is displayed as card
- **THEN** card shows title and delete button

#### Scenario: Card visual state
- **WHEN** todo status is 'done'
- **THEN** card title has strikethrough styling

#### Scenario: Card interactivity
- **WHEN** user hovers over card
- **THEN** card shows visual feedback (shadow/highlight)

### Requirement: Drag-and-Drop
Users SHALL be able to drag cards between columns to change status.

#### Scenario: Start drag
- **WHEN** user starts dragging a card
- **THEN** card becomes semi-transparent and cursor changes

#### Scenario: Drag over column
- **WHEN** card is dragged over a different column
- **THEN** column highlights to indicate valid drop zone

#### Scenario: Drop card
- **WHEN** card is dropped in a different column
- **THEN** todo status is updated via API and card moves to new column

#### Scenario: Drop in same column
- **WHEN** card is dropped in its original column
- **THEN** no API call is made and card returns to original position

#### Scenario: Drag failure
- **WHEN** API update fails during drop
- **THEN** error message is shown and card returns to original column

### Requirement: View Navigation
Users SHALL be able to switch between List and Board views.

#### Scenario: View toggle
- **WHEN** user clicks view toggle button
- **THEN** interface switches between List and Board views

#### Scenario: Active view indicator
- **WHEN** viewing a specific view
- **THEN** corresponding navigation button is visually highlighted

#### Scenario: View persistence
- **WHEN** user switches views
- **THEN** selected view remains active until user changes it

### Requirement: Board View Page Integration
The Board view SHALL integrate with existing app infrastructure.

#### Scenario: Data loading
- **WHEN** board view loads
- **THEN** todos are fetched from API using existing service

#### Scenario: Loading state
- **WHEN** data is being fetched
- **THEN** loading indicator is displayed

#### Scenario: Error handling
- **WHEN** API error occurs
- **THEN** error message is displayed with dismiss button

#### Scenario: Real-time updates
- **WHEN** todo is deleted or status changed
- **THEN** board columns update immediately to reflect changes

### Requirement: Responsive Design
Board view SHALL be usable on different screen sizes.

#### Scenario: Desktop view
- **WHEN** viewed on desktop (>768px)
- **THEN** columns are displayed side-by-side with equal width

#### Scenario: Mobile view
- **WHEN** viewed on mobile (<768px)
- **THEN** columns stack vertically or become horizontally scrollable

#### Scenario: Visual consistency
- **WHEN** board view is displayed
- **THEN** styling matches existing app theme (colors, fonts, spacing)
