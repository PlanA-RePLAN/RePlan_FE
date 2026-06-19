import { ApiResponse } from '../types/auth'
import { Routine } from '../types/routine'
import client from './client'

export interface CreateRoutineRequest {
  title: string
  routineType: 'DAILY' | 'WEEKLY' | 'MONTHLY'
  dueDate?: string | null
  routineTime?: string | null
  routineDate?: number | null
  tagId?: number | null
  goalId?: number | null
}

export async function createRoutine(
  accessToken: string,
  body: CreateRoutineRequest,
): Promise<ApiResponse<Routine>> {
  const res = await client.post<ApiResponse<Routine>>(
    '/api/routines',
    body,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  )
  return res.data
}
