import StatisticsEmptyIcon from '@/icons/StatisticsEmptyIcon'

export default function StatisticsEmptyState() {
  return (
    <div className="flex flex-col items-center gap-6 pt-[120px] pb-32">
      <StatisticsEmptyIcon />
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-base font-bold text-bluegray-black tracking-[-0.015em]">
          아직 데이터가 없어요
        </p>
        <p className="text-xs font-medium text-bluegray-normal leading-[1.5]">
          투두를 완료할수록
          <br />
          나만의 데이터가 쌓여요
        </p>
      </div>
    </div>
  )
}
