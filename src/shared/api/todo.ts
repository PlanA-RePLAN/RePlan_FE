import { Todo } from '../types'
import { ApiResponse } from '../types/auth'
import client from './client'

export async function getTodos(
    accessToken: string,
    filter: 'all' | 'day' | 'week' | 'month',
    sort: 'priority' | 'dueDate',
): Promise<ApiResponse<Todo[]>> {
    const res = await client.get<ApiResponse<Todo[]>>(
        '/api/todos',
        {
            params: { filter, sort },
            headers: { Authorization: `Bearer ${accessToken}` },
        }
    )
    return res.data
}

export async function deleteTodo(
    accessToken: string,
    todoId: number
): Promise<ApiResponse<null>>{
    const res = await client.delete<ApiResponse<null>>(
        `/api/todos/${todoId}`,
        {
            headers: { Authorization: `Bearer ${accessToken}` },
        }
    )
    return res.data
}


export async function toggleTodoComplete(
    accessToken: string,
    todoId: number,
    isCompleted: boolean,
): Promise<ApiResponse<null>> {
    const res = await client.patch<ApiResponse<null>>(
        `/api/todos/${todoId}/complete`,
        { isCompleted },
        { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    return res.data
}