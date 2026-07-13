import { useState } from 'react'

import BottomSheetHeader from '@/shared/components/BottomSheetHeader'
import BottomSheet from '@/shared/components/BottomSheet'
import Checkbox from '@/shared/components/Checkbox'
import { TERMS_CONTENT, PRIVACY_CONTENT, MARKETING_CONTENT } from '../constants/agreementContents'

const AGREEMENT_DATA = [
  { index: 1, required: true,  label: '만 14세 이상입니다',     hasDetail: false, content: null },
  { index: 2, required: true,  label: '서비스 이용약관',         hasDetail: true,  content: TERMS_CONTENT },
  { index: 3, required: true,  label: '개인정보 수집 및 이용',   hasDetail: true,  content: PRIVACY_CONTENT },
  { index: 4, required: false, label: '마케팅 정보 수신',        hasDetail: true,  content: MARKETING_CONTENT },
]

interface Props {
  isOpen: boolean
  onClose: () => void
  onConfirm: (agreeMarketing: boolean) => void
}

export default function TermsAgreementSheet({ isOpen, onClose, onConfirm }: Props) {
  const [agreeAge, setAgreeAge] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [agreePrivacy, setAgreePrivacy] = useState(false)
  const [agreeMarketing, setAgreeMarketing] = useState(false)
  const [detailIndex, setDetailIndex] = useState<number | null>(null)

  const allRequired = agreeAge && agreeTerms && agreePrivacy
  const allChecked = allRequired && agreeMarketing

  const toggleAll = () => {
    const next = !allChecked
    setAgreeAge(next)
    setAgreeTerms(next)
    setAgreePrivacy(next)
    setAgreeMarketing(next)
  }

  const handleConfirm = () => {
    if (!allRequired) return
    onConfirm(agreeMarketing)
  }

  const checkMap: Record<number, boolean> = {
    1: agreeAge,
    2: agreeTerms,
    3: agreePrivacy,
    4: agreeMarketing,
  }

  const toggleMap: Record<number, () => void> = {
    1: () => setAgreeAge((p) => !p),
    2: () => setAgreeTerms((p) => !p),
    3: () => setAgreePrivacy((p) => !p),
    4: () => setAgreeMarketing((p) => !p),
  }

  return (
    <>
      <BottomSheet isOpen={isOpen} onClose={onClose}>
        <div className="px-5">
          <BottomSheetHeader
            title="서비스 이용약관 동의"
            onConfirm={handleConfirm}
            confirmDisabled={!allRequired}
            onClose={onClose}
          />
          <div
            onClick={toggleAll}
            className="flex gap-3 items-center w-full h-12.25 bg-bluegray-light rounded-xl px-4 cursor-pointer"
          >
            <Checkbox checked={allChecked} color="black" />
            <h2>전체 동의하기</h2>
          </div>
          <div className="mt-6 mb-6 border-t border-bluegray-light-hover">
            <div className="flex flex-col gap-4 mt-6">
              {AGREEMENT_DATA.map((item) => (
                <div key={item.index} className="flex justify-between items-center">
                  <div
                    onClick={toggleMap[item.index]}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Checkbox checked={checkMap[item.index]} color="black" />
                    {item.required
                      ? <span className="bg-blue-light px-2.5 py-0.5 text-[12px] text-blue-normal rounded-[29px]">필수</span>
                      : <span className="bg-bluegray-light px-2.5 py-0.5 text-[12px] text-bluegray-normal rounded-[29px]">선택</span>
                    }
                    <p>{item.label}</p>
                  </div>
                  {item.hasDetail && (
                    <p
                      onClick={() => setDetailIndex(item.index)}
                      className="text-[12px] text-bluegray-normal underline cursor-pointer shrink-0"
                    >
                      보기
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </BottomSheet>

      <BottomSheet isOpen={detailIndex !== null} onClose={() => setDetailIndex(null)}>
        {detailIndex !== null && (
          <div className="px-5 ">
            <BottomSheetHeader
              title={AGREEMENT_DATA.find((d) => d.index === detailIndex)?.label ?? ''}
              onClose={() => setDetailIndex(null)}
              onConfirm={() => {
                if (!checkMap[detailIndex]) toggleMap[detailIndex]()
                setDetailIndex(null)
              }}
            />
            <div className="h-full max-h-[803px] overflow-y-auto text-s text-bluegray-dark whitespace-pre-wrap">
              {AGREEMENT_DATA.find((d) => d.index === detailIndex)?.content}
            </div>
          </div>
        )}
      </BottomSheet>
    </>
  )
}
