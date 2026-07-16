import { useState, useEffect, useCallback } from 'react'
import { cn } from '@/shared/utils/cn'
import { getMonthlyReport, getTipNote } from '@/shared/api/statics'
import { MonthlyReport, TipNote } from '@/shared/types/statics'
import ReportTab from './components/ReportTab'
import DeepAnalysisTab from './components/DeepAnalysisTab'
import TipNoteTab from './components/TipNoteTab'

type Tab = 'report' | 'analysis' | 'tip'

const TABS: { id: Tab; label: string }[] = [
  { id: 'report', label: '리포트' },
  { id: 'analysis', label: '심층 분석' },
  { id: 'tip', label: '팁 노트' },
]

export default function Statics() {
  const [activeTab, setActiveTab] = useState<Tab>('report')
  // 리포트·팁노트는 매월 1일에 '지난달' 것이 만들어지므로, 진입 시 기본 조회 월도 지난달로 둔다.
  const prevMonth = new Date()
  prevMonth.setDate(1)
  prevMonth.setMonth(prevMonth.getMonth() - 1)
  const [year, setYear] = useState(prevMonth.getFullYear())
  const [month, setMonth] = useState(prevMonth.getMonth() + 1)
  const [reportData, setReportData] = useState<MonthlyReport | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [tipNoteData, setTipNoteData] = useState<TipNote | null>(null)
  const [isTipNoteLoading, setIsTipNoteLoading] = useState(false)

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken') ?? ''
    setIsLoading(true)
    getMonthlyReport(accessToken, year, month)
      .then((res) => {
        if (res.success && res.data) {
          setReportData(res.data)
        } else {
          setReportData(null)
        }
      })
      .catch(() => setReportData(null))
      .finally(() => setIsLoading(false))
  }, [year, month])

  // 팁노트는 별도 API — 반영/끝내기 후 남은 카드를 다시 받아오기 위해 재조회 함수로 뺀다.
  const fetchTipNote = useCallback(() => {
    const accessToken = localStorage.getItem('accessToken') ?? ''
    setIsTipNoteLoading(true)
    getTipNote(accessToken, year, month)
      .then((res) => {
        setTipNoteData(res.success && res.data ? res.data : null)
      })
      .catch(() => setTipNoteData(null)) // 404 = 그 달 팁노트 없음
      .finally(() => setIsTipNoteLoading(false))
  }, [year, month])

  useEffect(() => {
    fetchTipNote()
  }, [fetchTipNote])

  return (
    <div className="flex flex-col">
      {/* Segment Tab Bar */}
      <div className="sticky top-0 z-10 bg-white flex border-b border-bluegray-light-hover">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex-1 py-2 text-base font-medium text-center relative',
                isActive ? 'text-bluegray-black' : 'text-bluegray-normal',
              )}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-bluegray-black" />
              )}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'report' && (
        <ReportTab
          data={reportData}
          isLoading={isLoading}
          year={year}
          month={month}
          onMonthChange={(y, m) => {
            setYear(y)
            setMonth(m)
          }}
        />
      )}
      {activeTab === 'analysis' && (
        <DeepAnalysisTab
          data={reportData}
          isLoading={isLoading}
          year={year}
          month={month}
          onMonthChange={(y, m) => {
            setYear(y)
            setMonth(m)
          }}
        />
      )}
      {activeTab === 'tip' && (
        <TipNoteTab
          data={tipNoteData}
          isLoading={isTipNoteLoading}
          year={year}
          month={month}
          onMonthChange={(y, m) => {
            setYear(y)
            setMonth(m)
          }}
          onRefresh={fetchTipNote}
        />
      )}
    </div>
  )
}
