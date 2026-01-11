# Frontend Development Rules

## CSS Modules

### Why CSS Modules?
- **Scoped styles**: No global namespace pollution
- **No naming conflicts**: Styles are locally scoped by default
- **Maintainability**: Clear component-style relationships
- **Type safety**: Can generate TypeScript definitions

### File Naming Convention
- Use `.module.css` extension for CSS Module files
- Name files after the component: `ComponentName.module.css`

```
src/
├── components/
│   ├── App.jsx
│   ├── App.module.css          ✅
│   ├── TodoItem.jsx
│   └── TodoItem.module.css     ✅
```

### Usage Pattern

#### 1. Create CSS Module File
**TodoItem.module.css**
```css
.container {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: white;
  border-radius: 8px;
}

.title {
  flex: 1;
  font-size: 16px;
}

.done .title {
  text-decoration: line-through;
  color: #888;
}

.deleteBtn {
  padding: 6px;
  background: none;
  border: none;
  cursor: pointer;
}
```

#### 2. Import and Use in Component
**TodoItem.jsx**
```javascript
import React from 'react';
import styles from './TodoItem.module.css';

function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <div className={`${styles.container} ${todo.status === 'done' ? styles.done : ''}`}>
      <button className={styles.toggleBtn} onClick={() => onToggle(todo.id)}>
        {todo.status === 'done' ? '✓' : ''}
      </button>
      <span className={styles.title}>{todo.title}</span>
      <button className={styles.deleteBtn} onClick={() => onDelete(todo.id)}>
        🗑️
      </button>
    </div>
  );
}

export default TodoItem;
```

### Class Name Conventions

#### Use camelCase for class names
```css
/* ✅ Good */
.todoItem { }
.deleteBtn { }
.isActive { }

/* ❌ Avoid */
.todo-item { }
.delete-btn { }
.is-active { }
```

#### Conditional Classes
```javascript
// Single condition
<div className={isActive ? styles.active : ''}>

// Multiple conditions
<div className={`${styles.item} ${isActive ? styles.active : ''} ${isDisabled ? styles.disabled : ''}`}>

// Using array join (cleaner for multiple conditions)
<div className={[
  styles.item,
  isActive && styles.active,
  isDisabled && styles.disabled
].filter(Boolean).join(' ')}>
```

### Global Styles
Keep global styles in `App.css` or `index.css` for:
- CSS resets
- Base typography
- CSS variables
- Utility classes (if needed)

**App.css** (global)
```css
/* Reset & Base */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary-color: #4361ee;
  --text-color: #333;
  --bg-color: #f5f5f5;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: var(--bg-color);
  color: var(--text-color);
}
```

### Composition (Reusing Styles)
```css
/* Base button styles */
.btn {
  padding: 14px 28px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

/* Compose with base */
.primaryBtn {
  composes: btn;
  background: var(--primary-color);
  color: white;
}

.secondaryBtn {
  composes: btn;
  background: transparent;
  border: 2px solid var(--primary-color);
}
```

### Migration from Plain CSS

#### Before (Plain CSS)
```css
/* App.css */
.todo-item {
  padding: 16px;
}

.todo-item.done {
  opacity: 0.6;
}
```

```javascript
// TodoItem.jsx
import '../App.css';

<div className="todo-item done">
```

#### After (CSS Modules)
```css
/* TodoItem.module.css */
.item {
  padding: 16px;
}

.done {
  opacity: 0.6;
}
```

```javascript
// TodoItem.jsx
import styles from './TodoItem.module.css';

<div className={`${styles.item} ${styles.done}`}>
```

### Best Practices

#### ✅ Do
- One CSS Module per component
- Use descriptive class names
- Keep styles close to components
- Use CSS variables for theming
- Compose common styles

#### ❌ Don't
- Don't use `!important` (defeats scoping purpose)
- Don't use global selectors in modules (`:global()` is available but use sparingly)
- Don't share CSS modules between unrelated components
- Don't use inline styles for complex styling

### Vite Configuration
Vite supports CSS Modules out of the box - no configuration needed! Just use `.module.css` extension.

### Debugging
Generated class names will look like: `TodoItem_container__a1b2c`
- `TodoItem` - Component name
- `container` - Original class name
- `a1b2c` - Hash for uniqueness

In dev mode, you can inspect elements to see the generated class names.

---

## Additional Frontend Rules

### Component Structure
```javascript
// 1. Imports
import React, { useState, useEffect } from 'react';
import styles from './Component.module.css';
import { api } from '../services/api';

// 2. Component function
function Component({ prop1, prop2 }) {
  // 3. State
  const [state, setState] = useState(initial);
  
  // 4. Effects
  useEffect(() => {
    // side effects
  }, [dependencies]);
  
  // 5. Handlers
  const handleClick = () => {
    // logic
  };
  
  // 6. Render
  return (
    <div className={styles.container}>
      {/* JSX */}
    </div>
  );
}

// 7. Export
export default Component;
```

### File Organization
```
client/src/
├── components/          (reusable UI components)
│   ├── TodoList.jsx
│   ├── TodoList.module.css
│   ├── TodoItem.jsx
│   ├── TodoItem.module.css
│   ├── AddTodo.jsx
│   └── AddTodo.module.css
├── pages/              (page-level components)
│   ├── App.jsx
│   └── App.module.css
├── services/
│   └── api.js
├── App.css            (global styles only)
└── main.jsx
```

### Code Style
- Use functional components with hooks
- Use `const` for functions: `const handleClick = () => {}`
- Destructure props: `function Component({ prop1, prop2 })`
- Use async/await for API calls
- Handle errors with try/catch
- Use descriptive variable names

---

**Questions? Suggestions?** Edit this file and share with the team!
