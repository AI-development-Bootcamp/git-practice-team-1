import React, { useState, useRef, useEffect } from 'react';
import styles from './PrioritySelect.module.css';
import { PRIORITY, PRIORITY_CONFIG } from '../constants/priority';

function PrioritySelect({ value, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const priorities = [PRIORITY.LOW, PRIORITY.MEDIUM, PRIORITY.HIGH];

    const getPriorityClass = (priority) => {
        switch (priority) {
            case PRIORITY.LOW:
                return styles.priorityLow;
            case PRIORITY.HIGH:
                return styles.priorityHigh;
            case PRIORITY.MEDIUM:
            default:
                return styles.priorityMedium;
        }
    };

    const handleSelect = (priority) => {
        onChange(priority);
        setIsOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const currentConfig = PRIORITY_CONFIG[value];

    return (
        <div className={styles.prioritySelect} ref={dropdownRef}>
            <button
                type="button"
                className={`${styles.selectButton} ${getPriorityClass(value)}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Select priority"
                aria-expanded={isOpen}
            >
                <span className={styles.selectedValue}>
                    ● {currentConfig.label}
                </span>
                <span className={styles.arrow}>{isOpen ? '▲' : '▼'}</span>
            </button>

            {isOpen && (
                <div className={styles.dropdown}>
                    {priorities.map((priority) => {
                        const config = PRIORITY_CONFIG[priority];
                        return (
                            <div
                                key={priority}
                                className={`${styles.option} ${getPriorityClass(priority)}`}
                                onClick={() => handleSelect(priority)}
                                role="option"
                                aria-selected={priority === value}
                            >
                                <span className={styles.badge} style={{ color: config.color }}>●</span>
                                <span className={styles.label}>{config.label}</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default PrioritySelect;
