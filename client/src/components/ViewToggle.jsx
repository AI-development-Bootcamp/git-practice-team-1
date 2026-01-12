import React from 'react';
import styles from './ViewToggle.module.css';

function ViewToggle({ value, onChange }) {
  return (
    <div className={styles.toggle} role="tablist" aria-label="View switcher">
      <button
        type="button"
        className={`${styles.btn} ${value === 'list' ? styles.active : ''}`}
        onClick={() => onChange('list')}
        role="tab"
        aria-selected={value === 'list'}
      >
        List
      </button>
      <button
        type="button"
        className={`${styles.btn} ${value === 'board' ? styles.active : ''}`}
        onClick={() => onChange('board')}
        role="tab"
        aria-selected={value === 'board'}
      >
        Board
      </button>
    </div>
  );
}

export default ViewToggle;

