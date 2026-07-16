import { ApiResponse } from '../types/auth'
import { MonthlyReport, TipNote, TipNoteItem } from '../types/statics'
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

/** 팁노트 조회. 그 달 팁노트가 없으면 404(TIP_NOTE_NOT_FOUND)가 throw된다. */
export async function getTipNote(
  accessToken: string,
  year: number,
  month: number,
): Promise<ApiResponse<TipNote>> {
  const res = await client.get<ApiResponse<TipNote>>('/api/tip-notes', {
    params: { year, month },
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  return res.data
}

export interface TipNoteApplyResult {
  appliedItems: TipNoteItem[]
}

/** 체크한 추천 카드만 실제 투두/루틴으로 반영한다. 하나라도 실패하면 전체 취소된다. */
export async function applyTipNote(
  accessToken: string,
  noteId: number,
  itemIds: number[],
): Promise<ApiResponse<TipNoteApplyResult>> {
  const res = await client.post<ApiResponse<TipNoteApplyResult>>(
    `/api/tip-notes/${noteId}/apply`,
    { itemIds },
    { headers: { Authorization: `Bearer ${accessToken}` } },
  )
  return res.data
}

/** 반영 없이 끝내기 — 남은 추천 카드를 전부 접는다. */
export async function dismissTipNote(
  accessToken: string,
  noteId: number,
): Promise<ApiResponse<void>> {
  const res = await client.post<ApiResponse<void>>(
    `/api/tip-notes/${noteId}/dismiss`,
    null,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  )
  return res.data
}
