/**
 * Priority Constants
 * Enum and configuration for todo priority levels
 */

export const PRIORITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
};

export const PRIORITY_CONFIG = {
    [PRIORITY.LOW]: {
        label: 'Low',
        color: '#22c55e', // green
        textColor: 'white',
    },
    [PRIORITY.MEDIUM]: {
        label: 'Medium',
        color: '#f59e0b', // orange
        textColor: 'white',
    },
    [PRIORITY.HIGH]: {
        label: 'High',
        color: '#ef4444', // red
        textColor: 'white',
    },
};

export const DEFAULT_PRIORITY = PRIORITY.MEDIUM;
