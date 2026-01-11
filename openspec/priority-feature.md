# Feature Specification: Todo Priority

## 1. Overview

### Purpose
Add priority levels to todos to help users identify and prioritize urgent and important tasks.

### Scope
Add a `priority` field to the Todo entity with 3 priority levels, including the ability to set priority on creation and update it later.

---

## 2. Data Model

### 2.1 Priority Enum

**Values:**
- `low` - Low priority tasks (can be postponed)
- `medium` - Medium priority (default)
- `high` - High priority (urgent/important tasks)

### 2.2 Todo Entity Schema

```javascript
{
  id: "uuid",
  title: "string",
  description: "string (optional)",
  status: "todo | in-progress | done",
  priority: "low | medium | high",  
  createdAt: "ISO datetime",
  updatedAt: "ISO datetime"
}
```

**Properties:**
- Required field
- Default value: `"medium"`
- Must be one of: `low`, `medium`, `high`

---

## 3. API Endpoints

### 3.1 Create Todo with Priority

**Endpoint:**
```
POST /api/todos
```

**DTO:** `CreateTodoSchema`

**Request Body:**
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive docs",
  "priority": "high"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Complete project documentation",
    "description": "Write comprehensive docs",
    "status": "todo",
    "priority": "high",
    "createdAt": "2026-01-11T12:00:00.000Z",
    "updatedAt": "2026-01-11T12:00:00.000Z"
  }
}
```

**Validation:**
- Uses `CreateTodoSchema` for request body validation
- Uses `BaseTodoSchema` for response validation
- `priority` is optional in request
- If omitted, defaults to `"medium"`
- If provided, must be one of: `low`, `medium`, `high`

---

### 3.2 Update Todo Priority

**Endpoint:**
```
PATCH /api/todos/:id
```

**DTO:** `UpdateTodoSchema`

**Request Body:**
```json
{
  "priority": "high"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Complete project documentation",
    "status": "in-progress",
    "priority": "high",
    "createdAt": "2026-01-11T12:00:00.000Z",
    "updatedAt": "2026-01-11T12:30:00.000Z"
  }
}
```

**Validation:**
- Uses `UpdateTodoSchema` for request body validation
- Uses `BaseTodoSchema` for response validation
- `priority` must be one of: `low`, `medium`, `high`
- All other fields in request body are optional
- `updatedAt` is automatically updated on any change

**Error Response (400 Bad Request):**
```json
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

### 3.3 Filter Todos by Priority

**Endpoint:**
```
GET /api/todos?priority=high
```

**DTO:** `FilterTodosSchema`

**Query Parameters:**
- `priority` (optional): `low`, `medium`, or `high`
- Can be combined with other parameters: `status`, `search`, etc.
- Supports multiple values for OR logic

**Examples:**
```
GET /api/todos?priority=high
GET /api/todos?priority=high&status=todo
GET /api/todos?priority=low&priority=medium
```

**Response (200 OK):**
```json
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

**Validation:**
- Uses `FilterTodosSchema` for query parameters validation
- Uses `TodoListResponseSchema` for response validation

---

## 4. API to DTO Mapping

| Endpoint | Method | Request DTO | Response DTO | Purpose |
|----------|--------|-------------|--------------|---------|
| `/api/todos` | POST | `CreateTodoSchema` | `BaseTodoSchema` | Create new todo with priority |
| `/api/todos/:id` | PATCH | `UpdateTodoSchema` | `BaseTodoSchema` | Update todo priority (or other fields) |
| `/api/todos` | GET | `FilterTodosSchema` | `TodoListResponseSchema` | Filter todos by priority |

### DTO Details

| DTO Name | Fields with Priority | Default Value | Required |
|----------|---------------------|---------------|----------|
| `TodoPriorityEnum` | `['low', 'medium', 'high']` | - | - |
| `CreateTodoSchema` | `priority: TodoPriorityEnum.optional()` | `'medium'` | No |
| `UpdateTodoSchema` | `priority: TodoPriorityEnum.optional()` | - | No |
| `FilterTodosSchema` | `priority: TodoPriorityEnum.optional()` | - | No |
| `BaseTodoSchema` | `priority: TodoPriorityEnum` | `'medium'` | Yes |

### Validation Rules

1. **On Create (POST):**
   - If `priority` not provided → default to `"medium"`
   - If provided → must be valid enum value (`low`, `medium`, `high`)

2. **On Update (PATCH):**
   - Can update `priority` independently or with other fields
   - `updatedAt` auto-updated on any change
   - Must be valid enum value if provided

3. **On Filter (GET):**
   - Multiple priority values use OR logic
   - Invalid values return 400 error

4. **Data Migration:**
   - Existing todos without `priority` automatically get `"medium"`

---

## 5. Tech Stack Implementation

### 5.1 Backend Stack

- **Framework:** Fastify
- **Runtime:** Node.js
- **Validation:** Zod (shared schemas)
- **Data Storage:** JSON file (file-based persistence)
- **Structure:** Routes → Services → Data Layer

### 5.2 Files Affected

**Shared:**
- `shared/types/todo.dto.js` - DTOs and Zod schemas
- `shared/types/validation.js` - Validation helpers

**Server:**
- `server/routes/todoRoutes.js` - API endpoints
- `server/services/todoService.js` - Business logic
- `server/data/todos.json` - Data persistence

---

## 6. Business Logic

### Default Behavior

| Action | Priority Handling |
|--------|-------------------|
| Create without priority | Auto-assign `"medium"` |
| Create with priority | Use provided value |
| Update priority | Update field + `updatedAt` |
| Read existing todo | Ensure priority exists (migrate if needed) |
| Filter by priority | Return matching todos |

### Data Migration Strategy

- No schema changes needed (JSON file)
- Runtime migration: on read, ensure all todos have priority
- Existing todos without `priority` → auto-assigned `"medium"`
- No breaking changes to existing data

---

## 7. Testing Scenarios

| Scenario | Method | Endpoint | Request DTO | Body | Expected Result |
|----------|--------|----------|-------------|------|----------------|
| Create with high priority | POST | `/api/todos` | `CreateTodoSchema` | `{title, priority: "high"}` | 201, priority="high" |
| Create without priority | POST | `/api/todos` | `CreateTodoSchema` | `{title}` | 201, priority="medium" |
| Create with invalid priority | POST | `/api/todos` | `CreateTodoSchema` | `{title, priority: "urgent"}` | 400 error |
| Update to low priority | PATCH | `/api/todos/:id` | `UpdateTodoSchema` | `{priority: "low"}` | 200, priority="low" |
| Update priority + title | PATCH | `/api/todos/:id` | `UpdateTodoSchema` | `{title, priority}` | 200, both updated |
| Filter by high priority | GET | `/api/todos?priority=high` | `FilterTodosSchema` | - | 200, filtered list |
| Filter by multiple priorities | GET | `/api/todos?priority=low&priority=high` | `FilterTodosSchema` | - | 200, OR logic |

### Edge Cases

1. **Existing todos without priority** → Auto-migrate to `"medium"` on read
2. **Case sensitivity (`"High"` vs `"high"`)** → Validation error (case-sensitive)
3. **Multiple priority values in filter** → OR logic (return todos matching any value)

---

## 8. Future Considerations (Out of Scope)

- Visual indicators (colors/icons) - frontend only
- Auto-sort by priority in list view
- Notifications for high-priority tasks approaching due date
- Priority-based statistics and analytics
