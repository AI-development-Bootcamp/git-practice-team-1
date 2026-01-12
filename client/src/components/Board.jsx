import React from 'react';
import BoardColumn from './BoardColumn';
import TodoCard from './TodoCard';
import styles from './Board.module.css';

const DEFAULT_STATUS_LABELS = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  review: 'Review',
  done: 'Done',
};

function Board({
  statuses,
  todos,
  onDelete,
  statusLabels = DEFAULT_STATUS_LABELS,
  emptyMessage = 'No tasks',
  className = '',
}) {
  return (
    <div className={`${styles.board} ${className}`}>
      {statuses.map((status) => {
        const columnTodos = todos.filter((t) => t.status === status);
        const title = statusLabels[status] || status;

        return (
          <BoardColumn
            key={status}
            status={status}
            title={title}
            count={columnTodos.length}
            emptyMessage={emptyMessage}
          >
            {columnTodos.map((todo) => (
              <TodoCard key={todo.id} todo={todo} onDelete={onDelete} />
            ))}
          </BoardColumn>
        );
      })}
    </div>
  );
}

export default Board;

