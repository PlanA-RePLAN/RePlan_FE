import { useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/shared/utils/cn"

const Cancle = '/assets/cancle.svg'
const Success = '/assets/success.svg'
const Retry = '/assets/retry.svg'

interface ToastProps {
    type: 'success' | 'retry'
    onClose: () => void
}

export default function Toast({ type = 'success', onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <motion.div
      className={cn('fixed z-50 bottom-33 left-1/2 -translate-x-1/2 flex justify-between p-4 w-[calc(100%-40px)] rounded-[12px]',
        type === 'success' ? 'bg-bluegray-black' : 'bg-danger')}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <div className="flex justify-center items-center gap-[10px]">
        {type === 'success' ? <img src={Success} alt="" /> : <img src={Retry} alt="" />}
        <p className="font-semibold text-[12px] text-white">오늘 할 일을 모두 완수했어요!</p>
      </div>
      <img src={Cancle} alt="" onClick={onClose} />
    </motion.div>
  )
}
