import CircleCheckButtonIcon from '@/icons/CircleCheckButtonIcon'
import MainButton from '@/shared/components/MainButton'
import { useNavigate } from 'react-router-dom'

export default function OnboardingComplete() {
  const navigate = useNavigate()

  return (
    <>
      <div className="flex flex-col items-center justify-center px-5 min-h-[calc(100vh-120px)]">
        <CircleCheckButtonIcon width={72} height={72} color="#579DEC" />
        <div className="text-2xl font-bold mt-8 mb-3 text-center">
          투두리스트 추가가 완료되었어요!
        </div>
        <div className="text-sm font-medium text-bluegray-normal text-center">
          홈에서 투두리스트를 확인해보세요.
        </div>
      </div>

      <div className="fixed left-0 bottom-10 w-full flex gap-2 px-5">
        <MainButton
          onClick={() => navigate('/goal')}
          option="secondary"
          title="목표 화면으로"
        />
        <MainButton
          onClick={() => navigate('/home')}
          option="primary"
          title="홈으로"
        />
      </div>
    </>
  )
}
