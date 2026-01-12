import React from 'react';
import BoardColumn from './BoardColumn';
import TodoCard from './TodoCard';
import styles from './Board.module.css';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

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
  onStatusChange,
  statusLabels = DEFAULT_STATUS_LABELS,
  emptyMessage = 'No tasks',
  className = '',
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor)
  );

  const [activeTodoId, setActiveTodoId] = React.useState(null);

  const activeTodo =
    activeTodoId == null
      ? null
      : todos.find((t) => String(t.id) === String(activeTodoId)) || null;

  const handleDragStart = (event) => {
    setActiveTodoId(event.active?.id ?? null);
  };

  const handleDragCancel = () => {
    setActiveTodoId(null);
  };

  const handleDragEnd = (event) => {
    const todoId = event.active?.id;
    const nextStatus = event.over?.id;

    setActiveTodoId(null);

    if (!todoId || !nextStatus) return;

    const todo = todos.find((t) => String(t.id) === String(todoId));
    if (!todo) return;

    if (String(todo.status) === String(nextStatus)) return;
    if (typeof onStatusChange !== 'function') return;

    onStatusChange(todo.id, String(nextStatus));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      onDragEnd={handleDragEnd}
    >
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

      <DragOverlay>
        {activeTodo ? <TodoCard todo={activeTodo} onDelete={onDelete} draggable={false} /> : null}
      </DragOverlay>
    </DndContext>
  );
}

export default Board;

