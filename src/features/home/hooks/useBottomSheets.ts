import { useState } from 'react'

export function useBottomSheets() {
  const [isTodoInfoSheetOpen, setIsTodoInfoSheetOpen] = useState(false)
  const [isMonthBottomSheetOpen, setIsMonthBottomSheetOpen] = useState(false)
  const [isDeleteBottomSheetOpen, setIsDeleteBottomSheetOpen] = useState(false)
  const [isNewTodoSheetOpen, setIsNewTodoSheetOpen] = useState(false)
  const [isEditTodoSheetOpen, setIsEditTodoSheetOpen] = useState(false)
  
  return {
    isTodoInfoSheetOpen,
    setIsTodoInfoSheetOpen,
    isMonthBottomSheetOpen,
    setIsMonthBottomSheetOpen,
    isDeleteBottomSheetOpen,
    setIsDeleteBottomSheetOpen,
    isNewTodoSheetOpen,
    setIsNewTodoSheetOpen,
    isEditTodoSheetOpen,
    setIsEditTodoSheetOpen,
  }
}
