# Change: Add Inline Priority Editing

## Why

Users need the ability to change priority on existing todos without opening a separate modal or form. Currently, Phase 1 displays priority badges and Phase 2 allows setting priority on creation, but there's no way to update priority after a todo is created. This change enables quick, inline priority editing by clicking the priority badge to reveal a dropdown menu.

## What Changes

- Make priority badge clickable in TodoItem
- Add dropdown menu with 3 priority options (low, medium, high)
- Show dropdown on badge click
- Highlight current priority in dropdown
- Update todo priority via API when selection changes
- Close dropdown after selection or click outside
- Add priority change handler in App component
- Pass priority change callback through TodoList to TodoItem

## Impact

- **Affected specs**: `todo-components` (TodoItem component requirements)
- **Affected code**: 
  - `client/src/components/TodoItem.jsx` - Add dropdown state and click handlers
  - `client/src/components/TodoItem.module.css` - Style clickable badge and dropdown
  - `client/src/components/TodoList.jsx` - Pass onPriorityChange prop
  - `client/src/pages/App.jsx` - Add handlePriorityChange function
- **Breaking changes**: None (backward compatible - adds new optional prop)
- **Dependencies**: 
  - Phase 1 (priority display) must be complete
  - Phase 2 (priority selection in AddTodo) should be complete for consistency
