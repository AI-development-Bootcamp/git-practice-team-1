# Implementation Tasks

## 1. Planning and Setup
- [x] Create OpenSpec proposal and spec files
- [x] 1.1 Review existing components and API endpoints
- [x] 1.2 Design component hierarchy for board view
- [x] 1.3 Install @dnd-kit dependencies (core and sortable)

## 2. Core Components
- [x] 2.1 Create TodoCard component with CSS module (TodoCard.module.css)
- [x] 2.2 Create BoardColumn component with CSS module (BoardColumn.module.css)
- [x] 2.3 Create Board component with CSS module (Board.module.css)
- [x] 2.4 Ensure all components follow existing CSS module patterns

## 3. API Service Updates
- [x] 3.1 Add getStatuses() method to api.todos service
- [x] 3.2 Update getAll() method to support status query parameter
- [ ] 3.3 Test API service methods with backend endpoints

## 4. Drag-and-Drop Functionality
- [x] 4.1 Set up DndContext in Board component
- [x] 4.2 Wrap TodoCard with useDraggable hook from @dnd-kit
- [x] 4.3 Configure BoardColumn as droppable with useDroppable hook
- [x] 4.4 Implement onDragEnd handler to update todo status
- [x] 4.5 Add DragOverlay for visual feedback during drag
- [x] 4.6 Style drag states with CSS modules

## 5. Board View Page
- [ ] 5.1 Create BoardView page component with CSS module (BoardView.module.css)
- [ ] 5.2 Fetch statuses from API on mount
- [ ] 5.3 Integrate Board component with data management
- [ ] 5.4 Add loading and error states
- [ ] 5.5 Connect to API service

## 6. Navigation and View Switching
- [ ] 6.1 Add navigation component to switch between views (with CSS module)
- [ ] 6.2 Update App.jsx to support view routing/switching
- [ ] 6.3 Preserve selected view in component state
- [ ] 6.4 Add visual indicator for active view

## 7. Polish and Validation
- [ ] 7.1 Test drag-and-drop in different browsers
- [ ] 7.2 Ensure responsive design works on mobile
- [ ] 7.3 Verify column counts update correctly
- [ ] 7.4 Test error handling when API fails during drag
- [ ] 7.5 Verify CSS modules are properly scoped
- [ ] 7.6 Manual testing of all scenarios from spec

## Notes
- Backend API endpoints are assumed to exist (GET /api/todos?status=X and GET /api/todos/statuses)
- Using @dnd-kit library for drag-and-drop (better UX, accessibility, and mobile support)
- @dnd-kit packages needed: @dnd-kit/core and @dnd-kit/sortable
- Use CSS modules for all board components (following project convention)
- Maintain consistency with existing visual design
- Focus on workshop-friendly, readable code
