
---

## 🎯 Backend Development Rules

These rules govern AI assistants working on the **backend** of this project.

---

### 🛠 Tech Stack & Core Technologies

| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Fastify** | Web framework |
| **TypeScript** | Primary language |
| **JSON Files** | Data persistence (current) |

---

### 🏗️ Modular Controller/Services Architecture

Follow a **strict layered architecture** to maintain separation of concerns:

```
Request → Routes (Controllers) → Services → Data Layer → Response
```

#### Layer Responsibilities

| Layer | File Location | Responsibility |
|-------|---------------|----------------|
| **Routes** | `src/routes/*.ts` | HTTP handling only: parse requests, validate input, call services, format responses |
| **Services** | `src/services/*.ts` | All business logic, data transformations, orchestration between data sources |
| **Data Layer** | `src/data/*.json` | Data persistence and retrieval |
| **Utils** | `src/utils/*.ts` | Shared helper functions (formatting, calculations, conversions) |

#### Rules:
1. **Routes MUST NOT contain business logic** — delegate to services
2. **Services MUST NOT access `request` or `reply` objects** — they are HTTP-agnostic
3. **One route file per resource/domain** (e.g., `todos.js`, `users.js`)
4. **One service file per resource/domain** (e.g., `todoService.js`, `userService.js`)
5. **Services should be stateless** — no side effects beyond data operations

---

### ✅ Input Validation & Schemas

- **Validate ALL incoming data** (body, params, query) at the route level
- Use **Fastify JSON Schema** or **Zod** for validation
- **Never trust client input** — always sanitize and validate

#### Example Pattern:
```typescript
// In routes - validate before passing to service
import { z } from 'zod';

const createTodoSchema = z.object({
  title: z.string().min(1, 'Title is required').trim()
});

fastify.post('/', async (request, reply) => {
  const result = createTodoSchema.safeParse(request.body);
  if (!result.success) {
    return reply.status(400).send({ error: result.error.issues[0].message });
  }
  const todo = todoService.create({ title: result.data.title });
  return reply.status(201).send(todo);
});
```

---

### 🚨 Error Handling & Response Patterns

#### Standard Error Response Format:
```typescript
interface ErrorResponse {
  error: string;              // Human-readable error message
  code?: string;              // Optional: machine-readable code
  details?: Record<string, unknown>; // Optional: additional context
}
```

#### HTTP Status Code Guidelines:

| Code | When to Use |
|------|-------------|
| `200` | Successful GET, PUT, PATCH |
| `201` | Successful POST (resource created) |
| `204` | Successful DELETE (no content) |
| `400` | Bad request / validation error |
| `404` | Resource not found |
| `409` | Conflict (duplicate resource) |
| `500` | Internal server error |

#### Rules:
1. **Always return consistent error shapes**
2. **Never expose internal error details in production**
3. **Log errors with context** for debugging

---

### 🔒 Security Best Practices

1. **Environment Variables:** Store sensitive config (ports, secrets, API keys) in environment variables, NOT in code
2. **CORS:** Configure allowed origins explicitly (currently: `http://localhost:5173`)
3. **Input Sanitization:** Trim strings, validate types, reject unexpected fields
4. **Rate Limiting:** Consider adding rate limiting for public endpoints (ask permission before adding library)
5. **No Secrets in Logs:** Never log passwords, tokens, or sensitive user data

---

### � Logging Standards

- Use **Fastify's built-in logger** (`fastify.log`)
- Log levels: `info`, `warn`, `error`, `debug`

#### What to Log:
- ✅ Server startup/shutdown
- ✅ Errors with stack traces
- ✅ Important business events (creation, deletion)
- ❌ Don't log sensitive data (passwords, tokens)
- ❌ Don't log every request (use Fastify's request logging)

---

### 📂 Standardized Folder Structure

```
server/
├── src/
│   ├── routes/           # HTTP route handlers (controllers)
│   │   └── todos.ts
│   ├── services/         # Business logic layer
│   │   └── todoService.ts
│   ├── types/            # TypeScript type definitions
│   │   └── (create as needed)
│   ├── utils/            # Shared helper functions
│   │   └── (create as needed)
│   ├── middleware/       # Custom Fastify plugins/hooks
│   │   └── (create as needed)
│   ├── schemas/          # Zod validation schemas (use z.infer for types)
│   │   └── (create as needed)
│   ├── data/             # JSON data files (current persistence)
│   │   └── todos.json
│   └── server.ts         # Application entry point
├── tsconfig.json         # TypeScript configuration
└── package.json
```

---

### 📜 Code Quality Standards

| Rule | Threshold |
|------|-----------|
| **Route file line limit** | Max 100 lines per route file |
| **Service file line limit** | Max 150 lines per service file |
| **Function length** | Max 30 lines per function |
| **Cyclomatic complexity** | Refactor if > 10 branches |

#### Naming Conventions:
- `camelCase` for functions, variables, file names
- `PascalCase` for classes, interfaces, and type aliases
- **Named exports** preferred over default exports (except route plugins)
- Descriptive names: `getTodoById` not `get`, `validateTodoInput` not `validate`

---

### 🔁 DRY Principle (Don't Repeat Yourself)

1. **Extract repeated logic** into reusable service methods or utils
2. **If you copy-paste code more than once**, refactor into a shared function
3. **Create helper functions** in `src/utils/` for common operations
4. **Shared validation schemas** can live in `src/schemas/`

---

### 🛑 Operational Boundaries

1. **Permission Required:** MUST ask permission before using any tool that modifies files
2. **Library Policy:** MUST NOT install/use new libraries without explicit user permission
   - Explain the *why* (problem it solves) and *what* (what the library does) first
3. **Clarification:** When requirements are ambiguous, **STOP** and ask for clarification
4. **Breaking Changes:** Flag any changes that modify existing API contracts

---

### 🔄 Backend Development Workflow

1. **📖 Analyze:** Review existing routes, services, and data structures
2. **📝 Plan:** Outline the approach and ask for confirmation on significant changes
3. **✅ Validate:** Design input validation before implementation
4. **💻 Implement:** Write route → service → data layer (top-down)
5. **🧪 Test:** Verify with sample requests (provide curl examples)
6. **📄 Document:** Update relevant `.md` files and add inline comments
7. **📋 Report:** Summarize changes with suggested commit message

---

### 🆕 Adding New Resources Checklist

When adding a new resource (e.g., `users`):

- [ ] Create `src/routes/users.ts` with CRUD endpoints
- [ ] Create `src/services/userService.ts` with business logic
- [ ] Create `src/schemas/userSchema.ts` with Zod schemas and inferred types
- [ ] Create `src/data/users.json` (if using file storage)
- [ ] Register routes in `server.ts` with appropriate prefix
- [ ] Add validation for all inputs
- [ ] Handle all error cases with proper status codes
- [ ] Update this documentation if needed



