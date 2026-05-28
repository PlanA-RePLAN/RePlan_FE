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
