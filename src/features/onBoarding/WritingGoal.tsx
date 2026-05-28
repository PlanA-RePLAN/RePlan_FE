import { useState } from 'react'
import { cn } from '@/shared/utils/cn'

// components
import Description from '@/shared/components/Description'
import Input from '@/shared/components/Input'
import Title from '@/shared/components/Title'
import MainButton from '@/shared/components/MainButton'
import GoalOffIcon from '@/icons/GoalOffIcon'
import ExampleTag from './components/ExampleTag'
import CalendarClearSharpIcon from '@/icons/CalendarClearSharpIcon'
import ListItem from '@/shared/components/ListItem'
import WandStar from '@/icons/WandStar'
import ChecvronRightIcon from '@/icons/ChevronLeftIcon'
import MenuIcon from '@/icons/MenuIcon'
import TrendingUpIcon from '@/icons/TrendingUpIcon'
import ClockIcon from '@/icons/ClockIcon'

export default function WritingGoal({ moveNext }: { moveNext: () => void }) {
  const [goal, setGoal] = useState('')
  const [period, setPeriod] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [currentLevel, setCurrentLevel] = useState('')
  const [availableTime, setAvailableTime] = useState('')
  const [specialNote, setSpecialNote] = useState('')

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-3 pb-6">
        <Title>목표를 작성해주세요!</Title>
        <Description>
          <div>추상적이어도 좋아요. 구체화를 도와줄게요! </div>
          <div>항목을 구체적으로 채울수록 완성도 있는 투두가 만들어져요.</div>
        </Description>
      </div>

      {/* --------- 목표 입력 ------------ */}
      <Input value={goal} setValue={setGoal} maxLength={50} showCount="always">
        <Input.Label option="secondary">
          <div className="flex gap-2 text-bluegray-black">
            <GoalOffIcon />
            목표
          </div>
        </Input.Label>
        <div className="flex gap-1.25 py-2">
          <ExampleTag tag="토익 850점 달성하기" />
          <ExampleTag tag="5kg 감량하기" />
          <ExampleTag tag="책 완독하기" />
        </div>
        <Input.Field height={49} placeholder="목표를 입력해주세요" />
        <Input.Bottom>
          <Input.Count />
        </Input.Bottom>
      </Input>

      {/* --------- 마감기한 입력 ------------ */}
      <div className="h-5" />
      <Input
        value={period}
        setValue={setPeriod}
        maxLength={80}
        showCount="always"
      >
        <Input.Label option="secondary">
          <div className="flex gap-2 text-bluegray-black items-center">
            <CalendarClearSharpIcon width={20} height={20} color="#3B3D41" />
            마감기한
          </div>
        </Input.Label>
        <div className="flex gap-1.25 py-2">
          <ExampleTag tag="올해 8월까지" />
          <ExampleTag tag="2029/05/03" />
          <ExampleTag tag="안 정할래요" />
        </div>
        <Input.Field height={95} placeholder="마감기한을 입력해주세요" />
        <Input.Bottom>
          <Input.Count />
        </Input.Bottom>
      </Input>

      {/* ------------- 추가 작성 사항 -------------- */}
      <ListItem
        className={cn(
          'bg-blue-light mt-6 px-0 border border-white',
          isOpen && 'border-blue-light-active mb-35 pb-0',
        )}
      >
        <div className="flex flex-col gap-1 px-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <WandStar />
              <div className="text-bluegray-dark-active text-sm font-bold">
                더 채울수록 딱 맞는 플랜이 나와요!
              </div>
            </div>
            <button onClick={() => setIsOpen((v) => !v)}>
              <ChecvronRightIcon
                className={cn(
                  'transition-transform duration-300',
                  isOpen ? '-rotate-90' : 'rotate-90',
                )}
                width={20}
              />
            </button>
          </div>
          <div
            className={cn(
              'text-bluegray-normal-hover text-xs font-medium',
              isOpen && 'pb-4',
            )}
          >
            선택 항목 3가지 입력하기
          </div>
        </div>

        {/* 펼쳐지는 입력 영역 */}
        <div
          className={cn(
            'grid transition-all duration-500 ease-in-out bg-white',
            isOpen ? 'grid-rows-[1fr] pb-5 rounded-b-xl' : 'grid-rows-[0fr]',
          )}
        >
          <div className="overflow-hidden px-4">
            <div className="flex flex-col gap-6 pt-4">
              {/* 현재 수준 */}
              <Input
                value={currentLevel}
                setValue={setCurrentLevel}
                maxLength={120}
                showCount="always"
              >
                <Input.Label option="secondary">
                  <div className="flex gap-2 text-bluegray-black items-center">
                    <TrendingUpIcon />
                    현재 수준
                  </div>
                </Input.Label>
                <div className="flex gap-1.5 py-2 flex-wrap">
                  <ExampleTag tag="수능 영어 3등급" />
                  <ExampleTag tag="운동/식단 안하는 중" />
                  <ExampleTag tag="23p까지 읽음" />
                </div>
                <Input.Field
                  height={95}
                  placeholder="현재 어느 정도인지를 작성해주세요"
                />
                <Input.Bottom>
                  <Input.Count />
                </Input.Bottom>
              </Input>

              {/* 투자 가능 시간 */}
              <Input
                value={availableTime}
                setValue={setAvailableTime}
                maxLength={120}
                showCount="always"
              >
                <Input.Label option="secondary">
                  <div className="flex gap-2 text-bluegray-black items-center">
                    <ClockIcon filled={true} />
                    투자 가능 시간
                  </div>
                </Input.Label>
                <div className="flex gap-1.5 py-2 flex-wrap">
                  <ExampleTag tag="주 5회 2시간" />
                  <ExampleTag tag="토일 5시간씩" />
                  <ExampleTag tag="자투리 시간" />
                </div>
                <Input.Field
                  height={95}
                  placeholder="언제 얼마나 시간을 낼 수 있나요?"
                />
                <Input.Bottom>
                  <Input.Count />
                </Input.Bottom>
              </Input>

              {/* 특이사항 */}
              <Input
                value={specialNote}
                setValue={setSpecialNote}
                maxLength={150}
                showCount="always"
              >
                <Input.Label option="secondary">
                  <div className="flex gap-2 text-bluegray-black items-center">
                    <MenuIcon width={20} height={20} />
                    특이사항
                  </div>
                </Input.Label>
                <div className="flex gap-1.5 py-2 flex-wrap">
                  <ExampleTag tag="해커스 토익 기출 VOCA 사용" />
                  <ExampleTag tag="주중 시간 없음" />
                  <ExampleTag tag="없음" />
                </div>
                <Input.Field
                  height={95}
                  placeholder="참고할 것들이 있으면 알려주세요"
                />
                <Input.Bottom>
                  <Input.Count />
                </Input.Bottom>
              </Input>
            </div>
          </div>
        </div>
      </ListItem>
      <div className="fixed pb-13 pt-10 bottom-0 left-0 right-0 w-full px-5 bg-linear-to-b from-transparent from-0% to-white to-20%">
        <MainButton
          option={goal.trim() && period.trim() ? 'primary' : 'disabled'}
          onClick={moveNext}
          title="다음으로"
        />
      </div>
    </div>
  )
}
