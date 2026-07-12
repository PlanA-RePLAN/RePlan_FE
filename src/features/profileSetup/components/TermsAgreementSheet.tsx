import { useState } from 'react'
import { cn } from '@/shared/utils/cn'

import BottomSheetHeader from '@/shared/components/BottomSheetHeader'
import BottomSheet from '@/shared/components/BottomSheet'
import CheckBoxIcon from '@/icons/CheckBoxIcon'
import Checkbox from '@/shared/components/Checkbox'

interface Props {
  isOpen: boolean
  onClose: () => void
  onConfirm: (agreeMarketing: boolean) => void
}

export default function TermsAgreementSheet({ isOpen, onClose, onConfirm }: Props) {
  const [age, setAge] = useState(false)
  const [terms, setTerms] = useState(false)
  const [privacy, setPrivacy] = useState(false)
  const [marketing, setMarketing] = useState(false)

  const allRequired = age && terms && privacy
  const allChecked = allRequired && marketing

  const toggleAll = () => {
    const next = !allChecked
    setAge(next)
    setTerms(next)
    setPrivacy(next)
    setMarketing(next)
  }

  const handleConfirm = () => {
    if (!allRequired) return
    onConfirm(marketing)
    setAge(false)
    setTerms(false)
    setPrivacy(false)
    setMarketing(false)
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className='px-5'>
        <BottomSheetHeader title='서비스 이용약관 동의' onConfirm={()=>{}} onClose={()=>{}}/>
      </div>
      <CheckBoxIcon/>
      <Checkbox/>
    </BottomSheet>
  )
}
