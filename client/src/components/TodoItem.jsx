import React from 'react';
import styles from './TodoItem.module.css';

const STATUS_OPTIONS = [
    { value: 'todo', label: 'To Do', icon: '○' },
    { value: 'in-progress', label: 'In Progress', icon: '◐' },
    { value: 'review', label: 'Review', icon: '◑' },
    { value: 'done', label: 'Done', icon: '✓' }
];

function TodoItem({ todo, onStatusChange, onDelete }) {
    const getStatusColor = (status) => {
        const colors = {
            'todo': '#6b7280',
            'in-progress': '#3b82f6',
            'review': '#f59e0b',
            'done': '#10b981'
        };
        return colors[status] || colors.todo;
    };

    return (
        <div 
            className={`${styles.todoItem} ${styles[todo.status]}`}
            style={{ borderLeft: `4px solid ${getStatusColor(todo.status)}` }}
        >
            <div className={styles.statusSelector}>
                {STATUS_OPTIONS.map(option => (
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

