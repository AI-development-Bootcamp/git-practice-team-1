import React, { useState } from 'react';
import styles from './AddTodo.module.css';
import PrioritySelect from './PrioritySelect';
import { DEFAULT_PRIORITY } from '../constants/priority';

function AddTodo({ onAdd }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState(DEFAULT_PRIORITY);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd({ title: title.trim(), priority });
      setTitle('');
      setPriority(DEFAULT_PRIORITY);
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

      <PrioritySelect
        value={priority}
        onChange={setPriority}
      />

      <button type="submit" className={styles.addBtn} disabled={!title.trim()}>
        Add
      </button>
    </form>
  );
}

export default AddTodo;
