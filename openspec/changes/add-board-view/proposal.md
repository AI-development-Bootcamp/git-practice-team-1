# Change: Add Board View

## Why
The current Todo app only supports a list view where todos are grouped by status. Users need a more visual way to manage their tasks using a Kanban-style board interface. This will provide better visual organization and make it easier to see task distribution across statuses at a glance.

## What Changes
- Add a new Board View page with column-based layout
- Display todos as cards in columns organized by status
- Show task count in each column header
- Enable drag-and-drop to move cards between columns using @dnd-kit library
- Update todo status when cards are moved
- Add navigation to switch between List and Board views
- Install and configure @dnd-kit for drag-and-drop functionality
- Consume backend API endpoints (assumed to exist):
  - GET /api/todos?status=X - Filter todos by status
  - GET /api/todos/statuses - Get list of status names

## Impact
- **Affected specs**: 
  - `board-view` (NEW) - Board interface specification
  - `todo-components` (MODIFIED) - Add view toggle navigation
  - `server-api` (MODIFIED) - Add status filtering and status list endpoint
- **Affected code**: 
  - `client/src/pages/` - New BoardView.jsx page
  - `client/src/components/` - New Board, BoardColumn, TodoCard components
  - `client/src/pages/App.jsx` - Add routing/view switching logic
  - `client/src/services/api.js` - Add methods to consume backend endpoints
  - CSS Modules for all board-related components

## Dependencies
- Depends on existing `todo-components`, `server-api`, and `client-setup` specifications
- **Assumes backend endpoints exist**: GET /api/todos?status=X and GET /api/todos/statuses
- **New library**: @dnd-kit/core and @dnd-kit/sortable for drag-and-drop functionality
- No breaking changes to existing functionality
- List view remains available alongside Board view
