import React from 'react';
import styles from './TodoCard.module.css';
import { useDraggable } from '@dnd-kit/core';

function TodoCard({ todo, onDelete, className = '', draggable = true, ...props }) {
  const statusClassMap = {
    todo: styles.statusTodo,
    'in-progress': styles.statusInProgress,
    review: styles.statusReview,
    done: styles.statusDone,
  };

  const statusClass = statusClassMap[todo.status] || '';
  const id = String(todo.id);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    disabled: !draggable,
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.card} ${statusClass} ${todo.status === 'done' ? styles.done : ''} ${isDragging ? styles.dragging : ''} ${className}`}
      {...props}
      {...attributes}
      {...listeners}
    >
      <div className={styles.content}>
        <span className={styles.title}>{todo.title}</span>
      </div>

      <button
        className={styles.deleteBtn}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(todo.id);
        }}
        aria-label="Delete todo"
        type="button"
      >
        🗑️
      </button>
    </div>
  );
}

export default TodoCard;

