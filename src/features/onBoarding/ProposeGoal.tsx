// components
import Title from '@/shared/components/Title'
import Description from '@/shared/components/Description'
import MainButton from '@/shared/components/MainButton'
import MenuIcon from '@/icons/MenuIcon'
import ListItem from '@/shared/components/ListItem'
import RestLeftFillIcon from '@/icons/RestLeftFillIcon'
import TodoCard from '@/shared/components/TodoCard'
import { useState } from 'react'
import { cn } from '@/shared/utils/cn'
import CheckBoxIcon from '@/icons/CheckBoxIcon'

interface ProposeGoalProps {
  moveNext: () => void
}

export default function ProposeGoal({ moveNext }: ProposeGoalProps) {
  const item = [
    {
      id: 1,
      title: '매일 LC 2시간 풀기',
      time: '22:00 AM',
      category: 'Study',
      dayTag: 'D',
    },
    {
      id: 2,
      title: '운동 1시간 가기',
      time: '20:00 PM',
      category: 'Health',
      dayTag: 'M',
    },
  ]
  const [selectedItems, setSelectedItems] = useState<number[] | null>(null)

  const handleSelect = (id: number) => {
    if (selectedItems?.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id))
    } else {
      setSelectedItems((prev) => (prev ? [...prev, id] : [id]))
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-3">
        <Title>
          <div>목표에 맞는</div>
          <div>투두리스트를 제안드릴게요.</div>
        </Title>
        <Description>
          <div>마음에 드는 리스트를 골라주세요.</div>
          <div>마음에 들지 않는다면 수정할 수 있어요!</div>
        </Description>
      </div>

      <ListItem className="mt-6 mb-8">
        토익 850점 달성, 5월 1일까지, ETS 토익 단기공략 850+ 교재 사용
      </ListItem>

      <div>
        <div className="flex items-center gap-2 w-full">
          <MenuIcon />
          <div className="font-bold text-[16px] text-bluegray-black">
            추천 투두
          </div>
          <button className="ml-auto flex items-center justify-center rounded-full p-1 bg-bluegray-light-hover">
            <RestLeftFillIcon />
          </button>
        </div>

        {/* ---- todo Item 시작 -------- */}
        {item.map((todo, index) => (
          <div className="flex gap-4.25 items-center" key={index}>
            <button
              onClick={() => handleSelect(todo.id)}
              className={cn(
                'w-5.5 h-5.5 shrink-0 border-bluegray-light-active border rounded-[5px] flex items-center justify-center',
                selectedItems?.includes(todo.id) && 'border-none',
              )}
            >
              {selectedItems?.includes(todo.id) && (
                <CheckBoxIcon color="#579DEC" />
              )}
            </button>
            <TodoCard
              status={selectedItems?.includes(todo.id) ? 'focused' : 'default'}
            >
              <TodoCard.Content>
                <TodoCard.Title dayTag="D">매일 LC 2시간 풀기</TodoCard.Title>
                <TodoCard.Time>22:00 AM</TodoCard.Time>
              </TodoCard.Content>
              <TodoCard.Category category="Study" />
            </TodoCard>
          </div>
        ))}
      </div>

      <div className="fixed left-0 bottom-10 w-full flex gap-2 px-5">
        <MainButton
          option="primary"
          onClick={moveNext}
          title="선택한 투두 추가하기"
        />
      </div>
    </div>
  )
}
