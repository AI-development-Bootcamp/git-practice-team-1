import React, { useState } from 'react';
import styles from './AddTodo.module.css';

function AddTodo({ onAdd }) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim());
      setTitle('');
    }
  };

  return (
    <form className={styles.addTodo} onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs to be done?"
        className={styles.addInput}
      />
      <button type="submit" className={styles.addBtn} disabled={!title.trim()}>
        Add
      </button>
    </form>
  );
}

export default AddTodo;

