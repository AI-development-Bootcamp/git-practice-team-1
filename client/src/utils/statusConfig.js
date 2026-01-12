// Helper function to get status configuration (labels, colors, icons)
export function getStatusConfig(status) {
  const configs = {
    'todo': { label: 'To Do', color: '#6b7280', icon: '○' },
    'in-progress': { label: 'In Progress', color: '#3b82f6', icon: '◐' },
    'review': { label: 'Review', color: '#f59e0b', icon: '◑' },
    'done': { label: 'Done', color: '#10b981', icon: '✓' }
  };
  return configs[status] || { label: status, color: '#6b7280', icon: '○' };
}

// Build status config object from array of statuses
export function buildStatusConfig(statuses) {
  const config = {};
  statuses.forEach(status => {
    config[status] = getStatusConfig(status);
  });
  return config;
}

// Build status options array from array of statuses
export function buildStatusOptions(statuses) {
  return statuses.map(status => {
    const config = getStatusConfig(status);
    return {
      value: status,
      label: config.label,
      icon: config.icon
    };
  });
}

