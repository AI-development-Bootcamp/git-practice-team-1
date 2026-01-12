## Context
Board View adds a Kanban-style visualization for existing todos. The frontend must remain simple and workshop-friendly, reuse the current data-loading patterns, and use CSS Modules for styling.

This change assumes the backend provides:
- `GET /api/todos?status=X` (optional filter)
- `GET /api/todos/statuses` (list of status names)

## Goals / Non-Goals

### Goals
- Provide a Board View with one column per status.
- Render each todo as a draggable card in the matching status column.
- Allow moving a card between columns to update the todo status (via existing `PUT /api/todos/:id`).
- Keep a single source of truth for todo data (avoid duplicated state between views).
- Use `@dnd-kit` for drag-and-drop and CSS Modules for styling.

### Non-Goals
- Backend implementation (endpoints are assumed to exist).
- Advanced kanban features (ordering within a column, multi-select, swimlanes).
- Persisting board UI preferences (e.g., last selected view) beyond the current session.

## Component Hierarchy

### Pages
- `App.jsx`
  - Owns shared state: `todos`, `loading`, `error`, and `currentView`.
  - Provides handlers: `handleAdd`, `handleDelete`, `handleStatusChange` (used by both List and Board views).
  - Renders:
    - `AddTodo`
    - `ViewToggle` (List / Board)
    - `TodoList` (when List view is active)
    - `BoardView` (when Board view is active)

- `BoardView.jsx`
  - Fetches `statuses` via `api.todos.getStatuses()` on mount.
  - Uses `Board` for rendering columns + cards.
  - Receives from `App.jsx`:
    - `todos`
    - `loading` / `error` (or renders its own simple state if needed)
    - `onStatusChange(todoId, nextStatus)`
    - `onDelete(todoId)`

### Components
- `ViewToggle.jsx`
  - Two buttons: List / Board.
  - Visual active state via CSS Module.

- `Board.jsx`
  - Sets up `@dnd-kit` `DndContext` + `DragOverlay`.
  - Renders one `BoardColumn` per status.
  - Responsible for drag lifecycle and mapping drag events to a status change:
    - `onDragStart`: store active todo id (for overlay)
    - `onDragEnd`: if dropped on a different column, call `onStatusChange(todoId, nextStatus)`

- `BoardColumn.jsx`
  - Wraps the column as a droppable target (id = status name).
  - Renders header: `Status Label (count)`.
  - Renders list of `TodoCard` for that status.

- `TodoCard.jsx`
  - Renders the todo similarly to `TodoItem`, but as a “card”.
  - Uses `useDraggable` (id = todo id).
  - Shows title and delete button.

## Data Flow

### Source of Truth
- `App.jsx` remains the single source of truth for `todos`.
- Board View receives `todos` via props; it does not own a separate copy.

### Fetching
- `App.jsx` continues to load todos once on mount (current pattern).
- `BoardView.jsx` loads statuses on mount:
  - `api.todos.getStatuses()`
  - Fallback to `['todo', 'in-progress', 'review', 'done']` if request fails.

### Updates (Move Card)
- Board drag-and-drop emits `(todoId, nextStatus)`.
- `App.jsx` performs:
  - Optimistic update of local `todos` (move card instantly).
  - `api.todos.update(todoId, { status: nextStatus })`.
  - On failure: show error and rollback (either revert the single todo or refetch all todos).

## Drag-and-Drop Mapping (dnd-kit)
- Draggable id: todo id (string/number normalized to string).
- Droppable id: status name (string).
- On drag end:
  - `active.id` → todo id
  - `over?.id` → next status
  - If `over` is null or next status equals current status: do nothing.

## Styling (CSS Modules)
- Each new component has a CSS Module:
  - `BoardView.module.css`, `Board.module.css`, `BoardColumn.module.css`, `TodoCard.module.css`, `ViewToggle.module.css`
- Keep visual language consistent with current app:
  - White cards, subtle shadow, hover shadow, same primary color `#4361ee`.
