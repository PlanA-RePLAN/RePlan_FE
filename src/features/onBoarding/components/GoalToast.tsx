import { useEffect } from 'react'

interface GoalToastProps {
  message: string
  onClose: () => void
}

export default function GoalToast({ message, onClose }: GoalToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed z-50 bottom-33 left-1/2 -translate-x-1/2 w-[calc(100%-40px)] rounded-xl bg-bluegray-black px-4 py-3">
      <p className="text-sm font-medium text-white">{message}</p>
    </div>
  )
}
