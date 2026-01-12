import React from 'react';
import styles from './TodoItem.module.css';
import { buildStatusOptions, getStatusConfig } from '../utils/statusConfig';

function TodoItem({ todo, statuses, onStatusChange, onDelete }) {
    const statusOptions = buildStatusOptions(statuses);

    const getStatusColor = (status) => {
        return getStatusConfig(status).color;
    };

    return (
        <div 
            className={`${styles.todoItem} ${styles[todo.status]}`}
            style={{ borderLeft: `4px solid ${getStatusColor(todo.status)}` }}
        >
            <div className={styles.statusSelector}>
                {statusOptions.map(option => (
                    <button
                        key={option.value}
                        className={`${styles.statusBtn} ${todo.status === option.value ? styles.active : ''}`}
                        onClick={() => onStatusChange(todo.id, option.value)}
                        aria-label={`Set status to ${option.label}`}
                        title={option.label}
                        style={{
                            backgroundColor: todo.status === option.value 
                                ? getStatusColor(option.value) 
                                : 'white',
                            color: todo.status === option.value ? 'white' : getStatusColor(option.value),
                            borderColor: getStatusColor(option.value)
                        }}
                    >
                        {option.icon}
                    </button>
                ))}
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

