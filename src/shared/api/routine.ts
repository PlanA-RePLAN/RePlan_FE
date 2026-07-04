import { ApiResponse } from '../types/auth'
import { Routine, CreateRoutineRequest } from '../types/routine'
import client from './client'

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


export async function getRoutines(
  accessToken: string,
  date: string
): Promise<ApiResponse<Routine[]>>{
  const res = await client.get<ApiResponse<Routine[]>>(
    '/api/routines',
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { date }
    }
  )
  return res.data
}

export async function deleteRoutine(
  accessToken: string,
  id: number,
): Promise<ApiResponse<null>> {
  const res = await client.delete<ApiResponse<null>>(
    `/api/routines/${id}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )
  return res.data
}