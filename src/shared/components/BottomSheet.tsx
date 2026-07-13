import { useEffect, useReducer, useRef } from 'react'
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

// 열려 있는 시트 스택. 시트가 겹칠 때
// - 나중에 연 시트가 항상 위로 오도록 z-index를 스택 순서로 배정하고
// - 맨 위 시트의 딤만 보여서, 배경은 한 번만 어두워지고 아래 시트는 위 시트의 딤에 덮인다.
const BASE_Z = 1001
let sheetSeq = 0
const openSheetIds: number[] = []
const stackListeners = new Set<() => void>()
const notifyStack = () => stackListeners.forEach((listener) => listener())

export default function BottomSheet({
  isOpen,
  onClose,
  children,
}: BottomSheetProps) {
  const dragControls = useDragControls()
  const y = useMotionValue(0)
  const sheetRef = useRef<HTMLDivElement>(null)
  const idRef = useRef(0)
  if (idRef.current === 0) idRef.current = ++sheetSeq
  // 닫히는 애니메이션 동안에도 열릴 때 받은 z를 유지해야 내려가는 시트가 아래 시트 뒤로 꺼지지 않는다
  const zRef = useRef(BASE_Z)
  const [, rerenderOnStackChange] = useReducer((n) => n + 1, 0)

  useEffect(() => {
    stackListeners.add(rerenderOnStackChange)
    return () => {
      stackListeners.delete(rerenderOnStackChange)
    }
  }, [])

  useEffect(() => {
    if (!isOpen) return
    zRef.current = BASE_Z + openSheetIds.length * 2
    openSheetIds.push(idRef.current)
    notifyStack()
    return () => {
      const index = openSheetIds.indexOf(idRef.current)
      if (index >= 0) openSheetIds.splice(index, 1)
      notifyStack()
    }
  }, [isOpen])

  const isTop = openSheetIds[openSheetIds.length - 1] === idRef.current

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
          {/* 딤 배경 — 맨 위 시트의 딤만 보인다 */}
          <motion.div
            className="fixed inset-0 bg-black"
            style={{ zIndex: zRef.current }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isTop ? 0.2 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* 바텀시트 */}
          <motion.div
            ref={sheetRef}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl"
            style={{ y, zIndex: zRef.current }}
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
