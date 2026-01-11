import React from 'react';
import TodoItem from './TodoItem';
import styles from './TodoList.module.css';

function TodoList({ todos, onToggle, onDelete }) {
  if (todos.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No todos yet. Add one above!</p>
      </div>
    );
  }

  const pendingTodos = todos.filter(t => t.status === 'todo');
  const doneTodos = todos.filter(t => t.status === 'done');

  return (
    <div className={styles.todoList}>
      {pendingTodos.length > 0 && (
        <section className={styles.todoSection}>
          <h2>To Do ({pendingTodos.length})</h2>
          {pendingTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </section>
      )}

      {doneTodos.length > 0 && (
        <section className={styles.todoSection}>
          <h2>Done ({doneTodos.length})</h2>
          {doneTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </section>
      )}
    </div>
  );
}

export default TodoList;

