import React from 'react';
import styles from './TodoItem.module.css';

function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <div className={`${styles.todoItem} ${todo.status === 'done' ? styles.done : ''}`}>
      <button
        className={styles.toggleBtn}
        onClick={() => onToggle(todo.id)}
        aria-label={todo.status === 'done' ? 'Mark as pending' : 'Mark as done'}
      >
        {todo.status === 'done' ? '✓' : '○'}
      </button>

      <span className={styles.todoTitle}>{todo.title}</span>

      <button
        className={styles.deleteBtn}
        onClick={() => onDelete(todo.id)}
        aria-label="Delete todo"
      >
        🗑️
      </button>
    </div>
  );
}

export default TodoItem;

