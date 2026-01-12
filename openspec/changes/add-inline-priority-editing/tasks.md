## 1. Update TodoItem Component
- [ ] 1.1 Add `showPriorityDropdown` state (boolean)
- [ ] 1.2 Make priority badge clickable (onClick handler)
- [ ] 1.3 Create dropdown component with 3 priority options
- [ ] 1.4 Show dropdown when badge is clicked
- [ ] 1.5 Highlight current priority in dropdown
- [ ] 1.6 Call `onPriorityChange(id, newPriority)` on selection
- [ ] 1.7 Close dropdown after selection
- [ ] 1.8 Add click-outside handler to close dropdown

## 2. Update TodoItem Styles
- [ ] 2.1 Add `.priorityBadgeClickable` (cursor pointer, hover effect)
- [ ] 2.2 Add `.priorityDropdown` (absolute positioning, shadow, border)
- [ ] 2.3 Add `.priorityOption` (hover state, padding)
- [ ] 2.4 Add `.priorityOptionActive` (current selection highlight)
- [ ] 2.5 Ensure dropdown doesn't break layout
- [ ] 2.6 Add z-index for dropdown overlay

## 3. Update TodoList Component
- [ ] 3.1 Accept `onPriorityChange` prop
- [ ] 3.2 Pass `onPriorityChange` to TodoItem components

## 4. Update App Component
- [ ] 4.1 Create `handlePriorityChange(id, priority)` function
- [ ] 4.2 Call `api.todos.update(id, { priority })` in handler
- [ ] 4.3 Update local state with new priority
- [ ] 4.4 Handle API errors gracefully
- [ ] 4.5 Pass `onPriorityChange` to TodoList

## 5. Verification
- [ ] 5.1 Click badge opens dropdown
- [ ] 5.2 Dropdown shows all 3 priorities
- [ ] 5.3 Current priority is highlighted
- [ ] 5.4 Selecting new priority updates todo
- [ ] 5.5 Dropdown closes after selection
- [ ] 5.6 Click outside closes dropdown
- [ ] 5.7 Priority persists after page reload
- [ ] 5.8 Multiple dropdowns don't interfere with each other
- [ ] 5.9 Dropdown positioning works on mobile
