import React from 'react';
import styles from './TodoCard.module.css';

function TodoCard({ todo, onDelete, className = '', ...props }) {
  return (
    <div
      className={`${styles.card} ${todo.status === 'done' ? styles.done : ''} ${className}`}
      {...props}
    >
      <div className={styles.content}>
        <span className={styles.title}>{todo.title}</span>
      </div>

      <button
        className={styles.deleteBtn}
        onClick={() => onDelete(todo.id)}
        aria-label="Delete todo"
        type="button"
      >
        🗑️
      </button>
    </div>
  );
}

export default TodoCard;

