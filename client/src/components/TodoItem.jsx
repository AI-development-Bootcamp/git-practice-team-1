import React, { useState, useRef, useEffect } from 'react';
import styles from './TodoItem.module.css';
import { PRIORITY, PRIORITY_CONFIG } from '../constants/priority';

function TodoItem({ todo, onToggle, onDelete, onPriorityChange }) {
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const priorityConfig = PRIORITY_CONFIG[todo.priority] || PRIORITY_CONFIG[PRIORITY.MEDIUM];

  const priorities = [PRIORITY.LOW, PRIORITY.MEDIUM, PRIORITY.HIGH];

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

  const handlePriorityChange = (newPriority) => {
    onPriorityChange(todo.id, newPriority);
    setShowPriorityDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowPriorityDropdown(false);
      }
    };

    if (showPriorityDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPriorityDropdown]);

  return (
    <div className={`${styles.todoItem} ${todo.status === 'done' ? styles.done : ''}`}>
      <button
        className={styles.toggleBtn}
        onClick={() => onToggle(todo.id)}
        aria-label={todo.status === 'done' ? 'Mark as pending' : 'Mark as done'}
      >
        {todo.status === 'done' ? '✓' : '○'}
      </button>

      <div className={styles.priorityWrapper} ref={dropdownRef}>
        <button
          className={`${styles.priorityBadge} ${getPriorityClass()}`}
          onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
          aria-label="Change priority"
        >
          {priorityConfig.label}
        </button>

        {showPriorityDropdown && (
          <div className={styles.priorityDropdown}>
            {priorities.map((priority) => {
              const config = PRIORITY_CONFIG[priority];
              const priorityClass = priority === PRIORITY.LOW ? styles.priorityLow :
                priority === PRIORITY.HIGH ? styles.priorityHigh :
                  styles.priorityMedium;
              return (
                <div
                  key={priority}
                  className={`${styles.priorityOption} ${priorityClass}`}
                  onClick={() => handlePriorityChange(priority)}
                  role="option"
                  aria-selected={priority === todo.priority}
                >
                  <span className={styles.optionBadge} style={{ color: config.color }}>●</span>
                  <span className={styles.optionLabel}>{config.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

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
