import {
  GoalGroup,
  type RefineGoalData,
  type RefineGoalRequest,
  type AiTodoRequest,
  type AiTodoRecommendationData,
  type CreateGoalWithTodosRequest,
  type CreateGoalWithTodosData,
} from '../types/goal'
import { ApiResponse } from '../types/auth'
import client from './client'

export async function getGoals(
  accessToken: string,
  year?: number,
  month?: number,
): Promise<ApiResponse<GoalGroup[]>> {
  const res = await client.get<ApiResponse<GoalGroup[]>>('/api/goals', {
    params: { year, month },
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  return res.data
}

export async function deleteGoal(
  accessToken: string,
  id: number,
): Promise<ApiResponse<null>> {
  const res = await client.delete<ApiResponse<null>>(`/api/goals/${id}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  return res.data
}

export async function refineGoal(
  accessToken: string,
  body: RefineGoalRequest,
): Promise<ApiResponse<RefineGoalData>> {
  const res = await client.post<ApiResponse<RefineGoalData>>(
    '/api/goals/ai/refine',
    body,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  )
  return res.data
}

export async function getAiTodoRecommendations(
  accessToken: string,
  body: AiTodoRequest,
): Promise<ApiResponse<AiTodoRecommendationData>> {
  const res = await client.post<ApiResponse<AiTodoRecommendationData>>(
    '/api/goals/ai/todo-recommendations',
    body,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  )
  return res.data
}

export async function createGoalWithTodos(
  accessToken: string,
  body: CreateGoalWithTodosRequest,
): Promise<ApiResponse<CreateGoalWithTodosData>> {
  const res = await client.post<ApiResponse<CreateGoalWithTodosData>>(
    '/api/goals/with-todos',
    body,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  )
  return res.data
}
