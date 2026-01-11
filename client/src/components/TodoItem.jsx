import React from 'react';
import styles from './TodoItem.module.css';
import { PRIORITY, PRIORITY_CONFIG } from '../constants/priority';

function TodoItem({ todo, onToggle, onDelete }) {
  const priorityConfig = PRIORITY_CONFIG[todo.priority] || PRIORITY_CONFIG[PRIORITY.MEDIUM];

  const getPriorityClass = () => {
    switch (todo.priority) {
      case PRIORITY.LOW:
        return styles.priorityLow;
      case PRIORITY.HIGH:
        return styles.priorityHigh;
      case PRIORITY.MEDIUM:
      default:
        return styles.priorityMedium;
    }
  };

  return (
    <div className={`${styles.todoItem} ${todo.status === 'done' ? styles.done : ''}`}>
      <button
        className={styles.toggleBtn}
        onClick={() => onToggle(todo.id)}
        aria-label={todo.status === 'done' ? 'Mark as pending' : 'Mark as done'}
      >
        {todo.status === 'done' ? '✓' : '○'}
      </button>

      <span className={`${styles.priorityBadge} ${getPriorityClass()}`}>
        {priorityConfig.label}
      </span>

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

