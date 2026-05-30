import { Todo, TodoDetail } from '../types/todo'
import { ApiResponse } from '../types/auth'
import client from './client'

export interface CreateTodoRequest {
  title: string
  dueDate?: string | null
  tagId?: number | null
  goalId?: number | null
}

export interface CreateTodoResponse {
  todoId: number
  title: string
  dueDate: string | null
  tagId: number | null
  parentId: number | null
  completed: boolean
}

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

export async function getTodoDetail(
    accessToken: string,
    todoId: number,
): Promise<ApiResponse<TodoDetail>> {
    const res = await client.get<ApiResponse<TodoDetail>>(
        `/api/todos/${todoId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
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


export async function updateTodoOrder(
    accessToken: string,
    todoId: number,
    prevTodoId: number | null,
    nextTodoId: number | null,
): Promise<ApiResponse<null>> {
    const res = await client.patch<ApiResponse<null>>(
        `/api/todos/${todoId}/order`,
        { prevTodoId, nextTodoId },
        { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    return res.data
}

export async function createTodo(
  accessToken: string,
  body: CreateTodoRequest,
): Promise<ApiResponse<CreateTodoResponse>> {
  const res = await client.post<ApiResponse<CreateTodoResponse>>(
    '/api/todos/create',
    body,
    { headers: { Authorization: `Bearer ${accessToken}` } },
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

