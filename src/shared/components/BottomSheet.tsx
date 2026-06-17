import { useRef } from 'react'
import { createPortal } from 'react-dom'
import {
  motion,
  AnimatePresence,
  useDragControls,
  useMotionValue,
} from 'framer-motion'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export default function BottomSheet({
  isOpen,
  onClose,
  children,
}: BottomSheetProps) {
  const dragControls = useDragControls()
  const y = useMotionValue(0)
  const sheetRef = useRef<HTMLDivElement>(null)

  const handleDragEnd = (
    _: unknown,
    info: { velocity: { y: number }; offset: { y: number } },
  ) => {
    if (info.velocity.y > 100 || info.offset.y > 150) {
      onClose()
    }
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 딤 배경 */}
          <motion.div
            className="fixed inset-0 z-100 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* 바텀시트 */}
          <motion.div
            ref={sheetRef}
            className="fixed bottom-0 left-0 right-0 z-1000 bg-white rounded-t-3xl"
            style={{ y }}
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0 }}
            dragElastic={{ top: 0.1, bottom: 0.3 }}
            onDragEnd={handleDragEnd}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 40,
            }}
          >
            {/* 핸들 바 */}
            <div
              className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <div className="w-10 h-1 rounded-full bg-bluegray-normal opacity-40" />
            </div>

            {/* 내용물 */}
            <div className="pb-8">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  )
}
