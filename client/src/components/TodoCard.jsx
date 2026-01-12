import React from 'react';
import styles from './TodoCard.module.css';

function TodoCard({ todo, onDelete, className = '', ...props }) {
  const statusClassMap = {
    todo: styles.statusTodo,
    'in-progress': styles.statusInProgress,
    review: styles.statusReview,
    done: styles.statusDone,
  };

  const statusClass = statusClassMap[todo.status] || '';

  return (
    <div
      className={`${styles.card} ${statusClass} ${todo.status === 'done' ? styles.done : ''} ${className}`}
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

