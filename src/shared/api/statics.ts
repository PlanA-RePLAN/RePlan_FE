import { ApiResponse } from '../types/auth'
import { MonthlyReport } from '../types/statics'
import client from './client'

export async function getMonthlyReport(
  accessToken: string,
  year: number,
  month: number,
): Promise<ApiResponse<MonthlyReport>> {
  const res = await client.get<ApiResponse<MonthlyReport>>(
    '/api/monthly-reports',
    {
      params: { year, month },
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  )
  return res.data
}
