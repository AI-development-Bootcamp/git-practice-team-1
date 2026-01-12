# API Changes - Backend Update

## 🚨 Breaking Changes

The API endpoints have been renamed from `/api/todos` to `/api/tasks`.

### Updated Endpoints

| Old Endpoint | New Endpoint | Method | Description |
|-------------|--------------|--------|-------------|
| `GET /api/todos` | `GET /api/tasks` | GET | Get all tasks |
| `GET /api/todos/:id` | `GET /api/tasks/:id` | GET | Get single task by ID |
| `POST /api/todos` | `POST /api/tasks` | POST | Create new task |
| `PUT /api/todos/:id` | `PUT /api/tasks/:id` | PUT | Update task |
| `DELETE /api/todos/:id` | `DELETE /api/tasks/:id` | DELETE | Delete task |

### New Endpoint

| Endpoint | Method | Description | Response |
|----------|--------|-------------|----------|
| `GET /api/tasks/status` | GET | Get all valid task statuses | `["todo", "in-progress", "review", "done"]` |

---

## 📋 What Frontend Needs to Do

### 1. Update All API Calls

Replace all instances of `/api/todos` with `/api/tasks` in your frontend code.

**Example changes:**

```javascript
// OLD ❌
fetch('http://localhost:3001/api/todos')

// NEW ✅
fetch('http://localhost:3001/api/tasks')
```

```javascript
// OLD ❌
fetch(`http://localhost:3001/api/todos/${id}`)

// NEW ✅
fetch(`http://localhost:3001/api/tasks/${id}`)
```

### 2. Files to Check

Look for API calls in these common locations:
- `src/services/` or `src/api/` (if you have API service files)
- Component files that make fetch/axios calls
- Any constants or config files with API URLs

### 3. Testing Checklist

After updating the frontend:
- [ ] Can fetch all tasks
- [ ] Can create a new task
- [ ] Can update a task
- [ ] Can delete a task
- [ ] Can fetch task statuses from `/api/tasks/status`

---

## 📝 Additional Notes

### Response Format (No Changes)
The response data structure remains the same:

```json
{
  "id": "uuid-here",
  "title": "Task title",
  "status": "todo",
  "createdAt": "2026-01-11T...",
  "updatedAt": "2026-01-11T..."
}
```

### Error Messages Updated
Error messages now say "Task" instead of "Todo":
- ❌ "Task not found" (instead of "Todo not found")

### Status Values
Available status values (from `GET /api/tasks/status`):
- `"todo"`
- `"in-progress"`
- `"review"`
- `"done"`

---

## 🔗 Server Details

- Base URL: `http://localhost:3001`
- CORS enabled for: `http://localhost:5173`

---

## ❓ Questions?

Contact the backend team if you encounter any issues during the migration.
