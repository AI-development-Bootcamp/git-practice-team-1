import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import TodoList from '../components/TodoList';
import AddTodo from '../components/AddTodo';
import styles from './App.module.css';

function App() {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadTodos();
    }, []);

    const loadTodos = async () => {
        try {
            setLoading(true);
            const data = await api.todos.getAll();
            setTodos(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (todoData) => {
        try {
            const newTodo = await api.todos.create(todoData);
            setTodos([...todos, newTodo]);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleToggle = async (id) => {
        try {
            const todo = todos.find(t => t.id === id);
            const newStatus = todo.status === 'done' ? 'todo' : 'done';
            const updated = await api.todos.update(id, { status: newStatus });
            setTodos(todos.map(t => t.id === id ? updated : t));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.todos.delete(id);
            setTodos(todos.filter(t => t.id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    const handlePriorityChange = async (id, priority) => {
        try {
            const updated = await api.todos.update(id, { priority });
            setTodos(todos.map(t => t.id === id ? updated : t));
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className={styles.app}>
            <header className={styles.header}>
                <h1>Todo App</h1>
            </header>

            <main className={styles.main}>
                <AddTodo onAdd={handleAdd} />

                {error && (
                    <div className={styles.errorMessage}>
                        {error}
                        <button onClick={() => setError(null)}>x</button>
                    </div>
                )}

                {loading ? (
                    <div className={styles.loading}>Loading...</div>
                ) : (
                    <TodoList
                        todos={todos}
                        onToggle={handleToggle}
                        onDelete={handleDelete}
                        onPriorityChange={handlePriorityChange}
                    />
                )}
            </main>
        </div>
    );
}

export default App;
