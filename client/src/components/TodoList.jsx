import React from 'react';
import TodoItem from './TodoItem';
import styles from './TodoList.module.css';
import { buildStatusConfig } from '../utils/statusConfig';

function TodoList({ todos, statuses, onStatusChange, onDelete, onPriorityChange }) {
  if (todos.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No todos yet. Add one above!</p>
      </div>
    );
  }

  const statusConfig = buildStatusConfig(statuses);

  return (
    <div className={styles.todoList}>
      {statuses.map(status => {
        const statusTodos = todos.filter(t => t.status === status);
        if (statusTodos.length === 0) return null;

        const config = statusConfig[status];

        return (
          <section key={status} className={styles.todoSection}>
            <h2 style={{ color: config.color }}>
              {config.label} ({statusTodos.length})
            </h2>
            {statusTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                statuses={statuses}
                onStatusChange={onStatusChange}
                onDelete={onDelete}
                onPriorityChange={onPriorityChange}
              />
            ))}
          </section>
        );
      })}
    </div>
  );
}

export default TodoList;

