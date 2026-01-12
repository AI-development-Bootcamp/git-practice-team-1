## MODIFIED Requirements

### Requirement: List Todos Endpoint
The API SHALL provide an endpoint to list all todos with optional status filtering.

#### Scenario: Get all todos
- **WHEN** GET /api/todos is called
- **THEN** all todos are returned as JSON array

#### Scenario: Filter todos by status
- **WHEN** GET /api/todos?status=done is called
- **THEN** only todos with status 'done' are returned as JSON array

#### Scenario: Filter with invalid status
- **WHEN** GET /api/todos?status=invalid is called
- **THEN** empty array is returned

#### Scenario: Multiple status filters
- **WHEN** GET /api/todos?status=done&status=todo is called
- **THEN** todos matching any of the specified statuses are returned

## ADDED Requirements

### Requirement: Get Status List Endpoint
The API SHALL provide an endpoint to retrieve the list of available todo statuses.

#### Scenario: Get all statuses
- **WHEN** GET /api/todos/statuses is called
- **THEN** array of unique status names is returned (e.g., ["todo", "in-progress", "review", "done"])

#### Scenario: Empty todos list
- **WHEN** GET /api/todos/statuses is called and no todos exist
- **THEN** default statuses array is returned (["todo", "in-progress", "review", "done"])

#### Scenario: Dynamic statuses
- **WHEN** GET /api/todos/statuses is called
- **THEN** returned array includes all unique status values found in todos
