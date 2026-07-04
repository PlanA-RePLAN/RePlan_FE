import GoalIcon from '@/icons/GoalIcon'

interface AiLoadingOverlayProps {
  message: string
}

export default function AiLoadingOverlay({ message }: AiLoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-white flex flex-col gap-4 items-center justify-center z-50">
      <GoalIcon colored width={48} height={48} />
      <p className="text-sm font-semibold text-blue-normal">{message}</p>
    </div>
  )
}
