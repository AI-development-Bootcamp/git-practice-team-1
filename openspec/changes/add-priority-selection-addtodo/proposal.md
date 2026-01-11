# Change: Add Priority Selection in AddTodo Form

## Why

Users need the ability to set priority when creating new todos. Currently, Phase 1 displays priority badges, but all new todos default to "medium" priority with no way to customize this during creation. This change enables users to explicitly choose the priority level (low, medium, high) when adding a new task.

## What Changes

- Add priority dropdown/select to AddTodo form
- Update AddTodo component to manage priority state
- Send priority field to backend API when creating todos
- Update API service to accept priority parameter
- Update App component to handle priority in todo creation
- Default priority remains "medium" as specified in requirements

## Impact

- **Affected specs**: `todo-components` (AddTodo component requirements)
- **Affected code**: 
  - `client/src/components/AddTodo.jsx` - Add priority selection UI
  - `client/src/components/AddTodo.module.css` - Style priority dropdown
  - `client/src/services/api.js` - Update create method signature
  - `client/src/pages/App.jsx` - Update handleAdd to pass priority
- **Breaking changes**: None (backward compatible - priority is optional in backend)
- **Dependencies**: Phase 1 (priority constants and display) must be complete
