/**
 * Query Helper Utility
 * Handles filtering of data based on query parameters
 */

/**
 * Creates a standardized query response
 * @param {boolean} success - Whether the query was successful
 * @param {Array} data - The filtered data array
 * @returns {{ success: boolean, data: Array }}
 */
export function createQueryResponse(success, data) {
    const response = {
        success,
        data: data ?? []
    };

    // Add error message if failed and no data was provided
    if (!success && data === undefined) {
        response.message = "server error";
    }

    return response;
}

/**
 * Filters todos based on query parameters
 * Supports filtering by all schema fields:
 * - id: exact match
 * - title: case-insensitive partial match
 * - status: exact match (todo/done)
 * - createdAfter/createdBefore: date range for createdAt
 * - updatedAfter/updatedBefore: date range for updatedAt
 * 
 * @param {Array} todos - Array of todo objects
 * @param {Object} queryParams - Query parameters to filter by
 * @returns {{ success: boolean, data: Array }}
 */
export function filterTodos(todos, queryParams = {}) {
    try {
        if (!Array.isArray(todos)) {
            return createQueryResponse(false, [{ message: 'Invalid query parameter' }]);
        }

        const {
            id,
            title,
            status,
            createdAfter,
            createdBefore,
            updatedAfter,
            updatedBefore
        } = queryParams;

        let filteredTodos = [...todos];

        // Filter by id (exact match)
        if (id !== undefined && id !== '') {
            filteredTodos = filteredTodos.filter(todo => todo.id === id);
        }

        // Filter by title (case-insensitive partial match)
        if (title !== undefined && title !== '') {
            const searchTerm = title.toLowerCase().trim();
            filteredTodos = filteredTodos.filter(todo =>
                todo.title && todo.title.toLowerCase().includes(searchTerm)
            );
        }

        // Filter by status (exact match)
        if (status !== undefined && status !== '') {
            filteredTodos = filteredTodos.filter(todo => todo.status === status);
        }

        // Filter by createdAt date range
        if (createdAfter !== undefined && createdAfter !== '') {
            const afterDate = new Date(createdAfter);
            if (!isNaN(afterDate.getTime())) {
                filteredTodos = filteredTodos.filter(todo =>
                    new Date(todo.createdAt) >= afterDate
                );
            }
        }

        if (createdBefore !== undefined && createdBefore !== '') {
            const beforeDate = new Date(createdBefore);
            if (!isNaN(beforeDate.getTime())) {
                filteredTodos = filteredTodos.filter(todo =>
                    new Date(todo.createdAt) <= beforeDate
                );
            }
        }

        // Filter by updatedAt date range
        if (updatedAfter !== undefined && updatedAfter !== '') {
            const afterDate = new Date(updatedAfter);
            if (!isNaN(afterDate.getTime())) {
                filteredTodos = filteredTodos.filter(todo =>
                    new Date(todo.updatedAt) >= afterDate
                );
            }
        }

        if (updatedBefore !== undefined && updatedBefore !== '') {
            const beforeDate = new Date(updatedBefore);
            if (!isNaN(beforeDate.getTime())) {
                filteredTodos = filteredTodos.filter(todo =>
                    new Date(todo.updatedAt) <= beforeDate
                );
            }
        }

        return createQueryResponse(true, filteredTodos);
    } catch (error) {
        return createQueryResponse(false, []);
    }
}
