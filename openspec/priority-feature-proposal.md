# Implementation Proposal: Todo Priority Feature

## Executive Summary

This proposal outlines the implementation plan for adding priority levels to the todo system. The feature is **already partially implemented** in the schema layer but needs full integration across the application stack. The priority field will support three levels (low, medium, high) with "medium" as the default, enabling users to categorize and filter tasks by urgency.

---

## Current State Analysis

### What's Already Done ✅
- **Schema Definition**: `TodoPriorityEnum` is defined in [shared/types/todo.dto.js:13](shared/types/todo.dto.js#L13)
- **DTO Integration**: Priority field is included in:
  - `BaseTodoSchema` (line 41) - default: "medium"
  - `CreateTodoSchema` (line 60) - optional, default: "medium"
  - `UpdateTodoSchema` (line 79) - optional
  - `FilterTodosSchema` (line 107) - optional filter
- **Validation Helpers**: All validation utilities in [shared/types/validation.js](shared/types/validation.js) are ready to use

### What's Missing ❌
- **Backend Service Layer**: [server/src/services/todoService.js](server/src/services/todoService.js) doesn't handle priority
- **Backend Routes Layer**: [server/src/routes/todos.js](server/src/routes/todos.js) doesn't validate or process priority
- **Data Migration**: Existing todos in [server/src/data/todos.json](server/src/data/todos.json) lack priority field
- **Query Parameter Parsing**: No filtering by priority in GET /api/todos
- **Response Validation**: No schema validation on API responses

---

## Implementation Plan

### Phase 1: Backend Service Layer
**File**: [server/src/services/todoService.js](server/src/services/todoService.js)

#### Changes Required:

1. **Import Schemas**
```javascript
import { CreateTodoSchema, UpdateTodoSchema, FilterTodosSchema } from '../../../shared/types/todo.dto.js';
import { validateData } from '../../../shared/types/validation.js';
```

2. **Update `create()` method** (line 32-44)
   - Add `priority` field with default value "medium"
   - Optional: Validate input with `CreateTodoSchema`

3. **Update `update()` method** (line 46-58)
   - Allow `priority` to be updated
   - Ensure `updatedAt` timestamp updates (already implemented)

4. **Add Data Migration Logic**
   - In `readTodos()` (line 9-16), ensure existing todos get `priority: "medium"` if missing
   - This prevents breaking changes to existing data

5. **Enhance `getAll()` for Filtering** (line 23-25)
   - Accept filter parameters (status, priority, search, etc.)
   - Implement filtering logic based on `FilterTodosSchema`

**Example Migration Code**:
```javascript
function readTodos() {
  try {
    const data = readFileSync(DATA_FILE, 'utf-8');
    const todos = JSON.parse(data);

    // Migrate: ensure all todos have priority field
    return todos.map(todo => ({
      ...todo,
      priority: todo.priority || 'medium'
    }));
  } catch (error) {
    return [];
  }
}
```

---

### Phase 2: Backend Routes Layer
**File**: [server/src/routes/todos.js](server/src/routes/todos.js)

#### Changes Required:

1. **Import Validation Utilities**
```javascript
import { CreateTodoSchema, UpdateTodoSchema, FilterTodosSchema } from '../../../shared/types/todo.dto.js';
import { validateData } from '../../../shared/types/validation.js';
```

2. **Update POST /api/todos** (line 19-27)
   - Validate request body with `CreateTodoSchema`
   - Pass `priority` (if provided) to service layer
   - Return proper error response for validation failures

**Current vs. Proposed**:
```javascript
// CURRENT (line 20-26)
fastify.post('/', async (request, reply) => {
  const { title } = request.body;
  if (!title || !title.trim()) {
    return reply.status(400).send({ error: 'Title is required' });
  }
  const todo = todoService.create({ title: title.trim() });
  return reply.status(201).send(todo);
});

// PROPOSED
fastify.post('/', async (request, reply) => {
  const validation = validateData(CreateTodoSchema, request.body);

  if (!validation.success) {
    return reply.status(400).send({
      success: false,
      errors: validation.errors
    });
  }

  const todo = todoService.create(validation.data);
  return reply.status(201).send({
    success: true,
    data: todo
  });
});
```

3. **Update PUT /api/todos/:id** (line 29-36)
   - Validate request body with `UpdateTodoSchema`
   - Support partial updates including priority

4. **Update GET /api/todos** (line 6-8)
   - Parse query parameters (status, priority, search)
   - Validate with `FilterTodosSchema`
   - Pass filters to `todoService.getAll(filters)`

**Proposed Enhancement**:
```javascript
fastify.get('/', async (request, reply) => {
  const validation = validateData(FilterTodosSchema, request.query);

  if (!validation.success) {
    return reply.status(400).send({
      success: false,
      errors: validation.errors
    });
  }

  const todos = todoService.getAll(validation.data);
  return {
    success: true,
    data: {
      todos,
      total: todos.length
    }
  };
});
```

---

### Phase 3: Data Migration
**File**: [server/src/data/todos.json](server/src/data/todos.json)

#### Strategy:
- **Runtime Migration** (preferred): Use the migration logic in `readTodos()` to automatically add `priority: "medium"` to existing todos when read
- **Manual Migration** (alternative): Add `"priority": "medium"` to all existing todos in the JSON file

#### Current Data Issues:
- 4 todos exist without `priority` field
- All need `priority: "medium"` as default

**Manual Migration Example** (for reference):
```json
{
  "id": "1",
  "title": "Learn Git basics",
  "status": "done",
  "priority": "medium",  // ← ADD THIS
  "createdAt": "2024-01-15T09:00:00.000Z",
  "updatedAt": "2026-01-11T11:59:18.287Z"
}
```

---

### Phase 4: Testing & Validation

#### Test Scenarios:

| Test Case | Endpoint | Request | Expected Response | Status |
|-----------|----------|---------|-------------------|--------|
| Create with high priority | POST /api/todos | `{title: "Urgent task", priority: "high"}` | 201, priority="high" | ⏳ To Test |
| Create without priority | POST /api/todos | `{title: "Normal task"}` | 201, priority="medium" | ⏳ To Test |
| Create with invalid priority | POST /api/todos | `{title: "Task", priority: "urgent"}` | 400, validation error | ⏳ To Test |
| Update priority only | PUT /api/todos/:id | `{priority: "low"}` | 200, priority="low" | ⏳ To Test |
| Filter by priority | GET /api/todos?priority=high | - | 200, filtered list | ⏳ To Test |
| Read migrated todo | GET /api/todos/:id | - | 200, priority="medium" | ⏳ To Test |

#### Edge Cases:
1. **Case Sensitivity**: "High" vs "high" → Should fail validation (Zod enum is case-sensitive)
2. **Existing Todos**: Todos without priority → Auto-migrate to "medium"
3. **Multiple Filters**: `?priority=high&status=todo` → AND logic (both conditions)
4. **Invalid Query Params**: `?priority=invalid` → 400 error with clear message

---

## API Examples

### 1. Create Todo with Priority
```http
POST /api/todos
Content-Type: application/json

{
  "title": "Complete project documentation",
  "description": "Write comprehensive API docs",
  "priority": "high"
}

Response: 201 Created
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Complete project documentation",
    "description": "Write comprehensive API docs",
    "status": "todo",
    "priority": "high",
    "createdAt": "2026-01-11T12:00:00.000Z",
    "updatedAt": "2026-01-11T12:00:00.000Z"
  }
}
```

### 2. Update Priority
```http
PUT /api/todos/550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json

{
  "priority": "low"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Complete project documentation",
    "status": "todo",
    "priority": "low",
    "createdAt": "2026-01-11T12:00:00.000Z",
    "updatedAt": "2026-01-11T12:30:00.000Z"
  }
}
```

### 3. Filter by Priority
```http
GET /api/todos?priority=high

Response: 200 OK
{
  "success": true,
  "data": {
    "todos": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "title": "Complete project documentation",
        "status": "todo",
        "priority": "high",
        ...
      }
    ],
    "total": 1
  }
}
```

### 4. Validation Error Example
```http
POST /api/todos
Content-Type: application/json

{
  "title": "Test",
  "priority": "urgent"
}

Response: 400 Bad Request
{
  "success": false,
  "errors": [
    {
      "path": "priority",
      "message": "Invalid enum value. Expected 'low' | 'medium' | 'high', received 'urgent'"
    }
  ]
}
```

---

## Files to Modify Summary

| File | Changes | Lines Affected | Complexity |
|------|---------|----------------|------------|
| [server/src/services/todoService.js](server/src/services/todoService.js) | Add priority handling, filtering, migration | 9-16, 23-25, 32-44 | Medium |
| [server/src/routes/todos.js](server/src/routes/todos.js) | Add validation, update response format | 6-8, 19-27, 29-36 | Medium |
| [server/src/data/todos.json](server/src/data/todos.json) | Optional manual migration (or auto-migrate) | All records | Low |

**No changes needed**:
- ✅ [shared/types/todo.dto.js](shared/types/todo.dto.js) - Already complete
- ✅ [shared/types/validation.js](shared/types/validation.js) - Already complete

---

## Response Format Standardization

Currently, the API has inconsistent response formats. This proposal suggests standardizing:

**Proposed Standard Format**:
```javascript
// Success responses
{
  "success": true,
  "data": { /* actual data */ }
}

// Error responses
{
  "success": false,
  "errors": [
    { "path": "field", "message": "error message" }
  ]
}

// List responses
{
  "success": true,
  "data": {
    "todos": [...],
    "total": 10
  }
}
```

**Note**: This is a breaking change for existing clients. Consider versioning the API (e.g., `/api/v2/todos`) if backward compatibility is required.

---

## Migration Strategy

### Option A: Runtime Migration (Recommended)
- Modify `readTodos()` to auto-add `priority: "medium"` to todos missing the field
- No manual data changes required
- Zero downtime
- Backward compatible

### Option B: One-Time Migration Script
- Create a script to update [todos.json](server/src/data/todos.json)
- Run once before deployment
- Clean data file (no runtime overhead)
- Requires downtime or careful deployment

**Recommendation**: Use **Option A** for simplicity and zero downtime.

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Breaking changes for existing clients | High | Maintain backward compatibility in responses OR version the API |
| Data loss during migration | Medium | Runtime migration prevents manual file edits |
| Invalid priority values in existing data | Low | Zod validation + migration handles this |
| Performance impact from filtering | Low | JSON file is small; filtering is O(n) which is acceptable |

---

## Timeline & Effort Estimate

| Phase | Tasks | Estimated Effort |
|-------|-------|------------------|
| Phase 1: Service Layer | Update create/update/getAll + migration logic | 2-3 hours |
| Phase 2: Routes Layer | Add validation to all endpoints | 2-3 hours |
| Phase 3: Data Migration | Runtime migration implementation | 30 minutes |
| Phase 4: Testing | Manual testing of all scenarios | 1-2 hours |
| **Total** | | **6-9 hours** |

---

## Future Enhancements (Out of Scope)

These are mentioned in the spec but not part of this implementation:

1. **Frontend Visual Indicators**: Color-coded badges or icons for priority levels
2. **Auto-Sort by Priority**: Default sorting in list views
3. **Priority-Based Notifications**: Alerts for high-priority tasks near due dates
4. **Analytics**: Dashboard showing priority distribution
5. **Smart Defaults**: AI-suggested priority based on title/description

---

## Success Criteria

This implementation will be considered successful when:

1. ✅ Users can create todos with priority (low/medium/high)
2. ✅ Default priority is "medium" when not specified
3. ✅ Users can update todo priority
4. ✅ Users can filter todos by priority via query params
5. ✅ Existing todos are automatically migrated to have priority="medium"
6. ✅ Invalid priority values return proper validation errors
7. ✅ All API responses follow consistent format
8. ✅ All test scenarios pass

---

## Questions for Stakeholders

Before implementation begins, please confirm:

1. **Response Format**: Should we standardize the response format (breaking change) or keep backward compatibility?
2. **API Versioning**: If breaking changes, should we create `/api/v2/todos`?
3. **Multiple Priority Filters**: Should `?priority=low&priority=high` use OR logic (spec says yes) or AND logic?
4. **Migration Approach**: Confirm runtime migration (Option A) is acceptable
5. **PUT vs PATCH**: Spec uses PATCH for updates, but current implementation uses PUT. Should we switch?

---

## Approval & Next Steps

**Prepared by**: Claude Code
**Date**: 2026-01-11
**Status**: Awaiting Review

**To approve this proposal:**
- [ ] Review technical approach
- [ ] Answer stakeholder questions above
- [ ] Confirm timeline and effort estimates
- [ ] Approve to proceed with implementation

**After approval:**
1. Create feature branch: `feature/todo-priority`
2. Implement Phase 1-3
3. Test all scenarios (Phase 4)
4. Create pull request with test results
5. Deploy to production after review
