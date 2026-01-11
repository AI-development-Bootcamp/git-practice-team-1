## 1. Update AddTodo Component
- [ ] 1.1 Add priority state with default 'medium'
- [ ] 1.2 Add priority select/dropdown UI element
- [ ] 1.3 Update form submission to include priority
- [ ] 1.4 Reset priority to 'medium' after form submission

## 2. Update AddTodo Styles
- [ ] 2.1 Add `.prioritySelect` styles matching form design
- [ ] 2.2 Ensure responsive layout (stack on mobile if needed)
- [ ] 2.3 Match existing input styling (border, padding, colors)

## 3. Update API Service
- [ ] 3.1 Change `api.todos.create(title)` to `api.todos.create({ title, priority })`
- [ ] 3.2 Ensure backward compatibility with backend

## 4. Update App Component
- [ ] 4.1 Update `handleAdd` to accept object `{ title, priority }`
- [ ] 4.2 Pass priority to API call

## 5. Verification
- [ ] 5.1 Can create todos with low priority
- [ ] 5.2 Can create todos with medium priority (default)
- [ ] 5.3 Can create todos with high priority
- [ ] 5.4 Priority dropdown resets to medium after creation
- [ ] 5.5 New todos display correct priority badge
- [ ] 5.6 Form validation still works (empty title disabled)
