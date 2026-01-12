import React from 'react';
import styles from './BoardColumn.module.css';
import { useDroppable } from '@dnd-kit/core';

function BoardColumn({
  status,
  title,
  count,
  children,
  emptyMessage = 'No tasks',
  className = '',
  ...props
}) {
  const { setNodeRef, isOver } = useDroppable({ id: String(status) });

  return (
    <section className={`${styles.column} ${className}`} {...props}>
      <header className={styles.header}>
        <h2 className={styles.title}>
          {title} <span className={styles.count}>({count})</span>
        </h2>
      </header>

      <div
        ref={setNodeRef}
        className={`${styles.body} ${isOver ? styles.over : ''}`}
        data-status={status}
      >
        {count === 0 ? (
          <div className={styles.empty}>{emptyMessage}</div>
        ) : (
          <div className={styles.cards}>{children}</div>
        )}
      </div>
    </section>
  );
}

export default BoardColumn;

