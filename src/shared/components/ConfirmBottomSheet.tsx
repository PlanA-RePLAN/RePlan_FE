import BottomSheet from './BottomSheet'

interface ConfirmBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  cancelText?: string
  confirmText: string
  onConfirm: () => void
}

// 제목 + 설명 + 취소/확인 두 버튼짜리 확인용 바텀시트.
// 목표 삭제·로그아웃·탈퇴 확인 등에서 화면마다 복붙되던 패턴의 공통화 (스타일은 ProfileSetting 확인 시트 기준).
export default function ConfirmBottomSheet({
  isOpen,
  onClose,
  title,
  description,
  cancelText = '취소',
  confirmText,
  onConfirm,
}: ConfirmBottomSheetProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center justify-center mt-4">
        <h2 className="text-[20px] font-semibold">{title}</h2>
        {description && (
          <p className="text-bluegray-darker mt-5">{description}</p>
        )}
      </div>
      <div className="flex px-5 items-center gap-2 mt-[22px] pb-[71px]">
        <button
          onClick={onClose}
          className="flex-1 py-3 rounded-xl bg-bluegray-light text-black font-semibold"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-3 rounded-xl bg-bluegray-light text-danger font-semibold"
        >
          {confirmText}
        </button>
      </div>
    </BottomSheet>
  )
}
