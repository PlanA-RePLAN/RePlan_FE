import Title from '@/shared/components/Title'
import Description from '@/shared/components/Description'
import MainButton from '@/shared/components/MainButton'
import ListItem from '@/shared/components/ListItem'
import GoalIcon from '@/icons/GoalIcon'
import CalendarClearSharpIcon from '@/icons/CalendarClearSharpIcon'
import ClockIcon from '@/icons/ClockIcon'
import SurveyCard, {
  type SurveyContent,
} from '@/features/onBoarding/components/SurveyCard'
import TrendingUpIcon from '@/icons/TrendingUpIcon'
import MenuIcon from '@/icons/MenuIcon'
import DeadlineInput from '@/features/onBoarding/components/DeadlineInput'
import { useState } from 'react'

export default function AskQuestion({ moveNext }: { moveNext: () => void }) {
  const [deadlineDate, setDeadlineDate] = useState<Date>(new Date('2026-10-15'))
  const [deadlineTime, setDeadlineTime] = useState('11:30 AM')
  const [useDeadLineDate, setUseDeadLineDate] = useState(true)
  const [useDeadLineTime, setUseDeadLineTime] = useState(true)
  const [currLevel, setCurrLevel] = useState<SurveyContent>(
    '문법: 기초 문법 개념 학습보다 실전풀이 학습 필요 독해: 속도 향상 위해 실전풀이 학습 풀이 필요 어휘: 자투리 시간 투자 및 집중 보완 필요 듣기: 자투리 시간 통한 보완 필요 종합: 전반적인 기본기 보완 및 실전 감각 육성 시급',
  )
  const [canUseTime, setCanUseTime] = useState<SurveyContent>(
    '월~금: 20:00 ~ 22:00 (2시간) 토, 일: 14:00 ~ 18:00 (4시간 이상) 주간 총 투자 시간: 주 22시간',
  )
  const [specialNote, setSpecialNote] = useState<SurveyContent>([
    {
      title: '교재 및 컨텐츠',
      description:
        '해커스 토익 기출 VOCA, 해커스 토익 기출문제집 1000제 (LC/RC)',
    },
    {
      title: '실전 학습',
      description: '개념 정리 후 바로 단편 문제 풀이로 이어지는 숏폼 루틴 적용',
    },
    {
      title: '암기 루틴',
      description:
        '집중도가 높은 평일 아침 자투리 시간에 단어 암기 및 복습 우선 배치',
    },
    {
      title: '복습 주기',
      description: '매주 일요일 오후 1시간, 해당 주 학습 내용 전체 복습',
    },
    {
      title: '컨디션 관리',
      description:
        '주 1회 이상 완전 휴식 보장, 과부하 방지 및 지속 가능한 루틴 유지',
    },
  ])

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-3">
        <Title>이렇게 정리했어요!</Title>
        <Description>수정하고 싶은 항목을 눌러주세요.</Description>
      </div>
      <div className="flex gap-2 mt-8">
        <GoalIcon colored={false} />
        <div className="font-medium">목표</div>
      </div>
      <ListItem className="mt-2 mb-8 text-bluegray-black">
        토익 850점 달성
      </ListItem>
      <div className="flex gap-2 text-bluegray-black items-center font-medium">
        <CalendarClearSharpIcon width={20} height={20} color="#3B3D41" />
        마감기한
      </div>

      <DeadlineInput
        date={deadlineDate}
        time={deadlineTime}
        useDate={useDeadLineDate}
        useTime={useDeadLineTime}
        onUseDateChange={setUseDeadLineDate}
        onUseTimeChange={setUseDeadLineTime}
        onDateChange={setDeadlineDate}
        onTimeChange={setDeadlineTime}
      />

      <SurveyCard
        icon={<TrendingUpIcon />}
        label="현재 수준"
        content={currLevel}
        reason='유저가 제시한 "해커스 토익 기출 VOCA" 외에, 목표 점수(850점 이상) 달성과 실전 감각 부족 해결을 위해 최신 기출문제집(해커스 토익 기출문제집 1000제 등) 실물 교재의 추가 병행이 필수적이라고 판단했습니다.'
        onEdit={(newContent) => setCurrLevel(newContent)}
      />
      <SurveyCard
        icon={<ClockIcon />}
        label="투자 가능 시간"
        content={canUseTime}
        reason='유저가 제시한 "해커스 토익 기출 VOCA" 외에, 목표 점수(850점 이상) 달성과 실전 감각 부족 해결을 위해 최신 기출문제집(해커스 토익 기출문제집 1000제 등) 실물 교재의 추가 병행이 필수적이라고 판단했습니다.'
        onEdit={(newContent) => setCanUseTime(newContent)}
      />
      <SurveyCard
        icon={<MenuIcon />}
        label="특이사항"
        content={specialNote}
        reason='유저가 제시한 "해커스 토익 기출 VOCA" 외에, 목표 점수(850점 이상) 달성과 실전 감각 부족 해결을 위해 최신 기출문제집(해커스 토익 기출문제집 1000제 등) 실물 교재의 추가 병행이 필수적이라고 판단했습니다.'
        onEdit={(newContent) => setSpecialNote(newContent)}
      />

      <div className="h-45" />
      <div className="fixed pb-13 pt-10 bottom-0 left-0 right-0 w-full px-5 bg-linear-to-b from-transparent from-0% to-white to-20%">
        <MainButton
          option="primary"
          onClick={moveNext}
          title="다음으로"
          className="mt-10"
        />
      </div>
    </div>
  )
}
