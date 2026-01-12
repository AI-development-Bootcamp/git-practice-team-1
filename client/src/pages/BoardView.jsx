import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import Board from '../components/Board';
import styles from './BoardView.module.css';

const FALLBACK_STATUSES = ['todo', 'in-progress', 'review', 'done'];

function normalizeStatuses(data) {
  if (!Array.isArray(data)) return FALLBACK_STATUSES;

  const cleaned = data
    .map((s) => String(s).trim())
    .filter(Boolean);

  return cleaned.length > 0 ? cleaned : FALLBACK_STATUSES;
}

function BoardView({ todos, loading, error, onDismissError, onDelete, onStatusChange }) {
  const [statuses, setStatuses] = useState(FALLBACK_STATUSES);
  const [statusesLoading, setStatusesLoading] = useState(true);
  const [statusesError, setStatusesError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadStatuses() {
      try {
        setStatusesLoading(true);
        const data = await api.todos.getStatuses();
        if (!cancelled) {
          setStatuses(normalizeStatuses(data));
          setStatusesError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setStatuses(FALLBACK_STATUSES);
          setStatusesError(
            `Statuses endpoint unavailable. ${e?.message || 'Failed to load statuses'} Using default statuses.`
          );
        }
      } finally {
        if (!cancelled) setStatusesLoading(false);
      }
    }

    loadStatuses();
    return () => {
      cancelled = true;
    };
  }, []);

  const isLoading = Boolean(loading) || statusesLoading;
  const displayError = error || statusesError;

  const safeTodos = useMemo(() => (Array.isArray(todos) ? todos : []), [todos]);

  return (
    <div className={styles.container}>
      {displayError && (
        <div className={styles.errorMessage}>
          {displayError}
          {typeof onDismissError === 'function' && (
            <button type="button" onClick={onDismissError}>
              x
            </button>
          )}
        </div>
      )}

      {isLoading ? (
        <div className={styles.loading}>Loading...</div>
      ) : (
        <Board
          statuses={statuses}
          todos={safeTodos}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      )}
    </div>
  );
}

export default BoardView;

