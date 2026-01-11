import React from 'react';
import TodoItem from './TodoItem';
import styles from './TodoList.module.css';

const STATUS_CONFIG = {
    todo: { label: 'To Do', color: '#6b7280' },
    'in-progress': { label: 'In Progress', color: '#3b82f6' },
    review: { label: 'Review', color: '#f59e0b' },
    done: { label: 'Done', color: '#10b981' }
};

function TodoList({ todos, onStatusChange, onDelete }) {
  if (todos.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No todos yet. Add one above!</p>
      </div>
    );
  }

  return (
    <div className={styles.todoList}>
      {Object.entries(STATUS_CONFIG).map(([status, config]) => {
        const statusTodos = todos.filter(t => t.status === status);
        if (statusTodos.length === 0) return null;

        return (
          <section key={status} className={styles.todoSection}>
            <h2 style={{ color: config.color }}>
              {config.label} ({statusTodos.length})
            </h2>
            {statusTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                currentStatus={status}
                onStatusChange={onStatusChange}
                onDelete={onDelete}
              />
            ))}
          </section>
        );
      })}
    </div>
  );
}

export default TodoList;

