// components
import Title from '@/shared/components/Title'
import Description from '@/shared/components/Description'
import MainButton from '@/shared/components/MainButton'
import MenuIcon from '@/icons/MenuIcon'
import AddItemIcon from '@/icons/AddItemIcon'

interface ProposeGoalProps {
  moveNext: () => void
}

export default function ProposeGoal({ moveNext }: ProposeGoalProps) {
  return (
    <div className="flex flex-col">
      <div className="pt-8 flex flex-col gap-3">
        <Title>
          <div>목표에 맞는</div>
          <div>투두리스트를 제안드릴게요.</div>
        </Title>
        <Description>
          <div>마음에 드는 리스트를 골라주세요.</div>
          <div>마음에 들지 않는다면 수정하거나 추가할 수 있어요!</div>
        </Description>
      </div>

      <div className="rounded-xl p-4 mt-6 mb-8 bg-blue-light font-semibold text-sm text-blue-normal">
        토익 850점 달성, 5월 1일까지, ETS 토익 단기공략 850+ 교재 사용
      </div>

      <div>
        <div className="flex items-center gap-2 w-full">
          <MenuIcon />
          <div className="font-bold text-[16px] text-bluegray-black">
            추천 투두
          </div>
          <div className="ml-auto">
            <AddItemIcon />
          </div>
        </div>
        <div>투두 박스</div>
      </div>

      <div className="fixed left-0 bottom-10 w-full flex gap-2 px-5">
        <MainButton option="secondary" onClick={moveNext} title="건너뛰기" />
        <MainButton option="primary" onClick={() => {}} title="투두 추가하기" />
      </div>
    </div>
  )
}
