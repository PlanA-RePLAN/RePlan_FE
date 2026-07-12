import { useState } from 'react'

import BottomSheetHeader from '@/shared/components/BottomSheetHeader'
import BottomSheet from '@/shared/components/BottomSheet'
import Checkbox from '@/shared/components/Checkbox'

const AGREEMENT_DATA = [
    { required : true, label: "만 14세 이상입니다", hasDetail: false},
    { required : true, label: "서비스 이용약관", hasDetail: true},
    { required : true, label: "개인정보 수집 및 이용", hasDetail: true},
    { required : false, label: "마케팅 정보 수신", hasDetail: true},
]

interface Props {
  isOpen: boolean
  onClose: () => void
  onConfirm: (agreeMarketing: boolean) => void
}

export default function TermsAgreementSheet({ isOpen, onClose, onConfirm }: Props) {
 

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className='px-5'>
        <BottomSheetHeader title='서비스 이용약관 동의' onConfirm={()=>{}} onClose={()=>{}}/>
            <div className='flex gap-3 items-center w-full h-12.25 bg-bluegray-light rounded-xl px-4'>
                <Checkbox checked color='black'/>
                <h2>전체 동의하기</h2>
            </div>
            <div className='mt-6 mb-6 border-t border-bluegray-light-hover'>
                <div className='flex flex-col gap-4 mt-6'>
                    {AGREEMENT_DATA.map((item) => (
                        <div className='flex justify-between'>
                            <div className='flex items-center gap-2'>
                                <Checkbox checked color='black'/>
                                {item.required === true ? 
                                <span className='bg-blue-light px-2.5 py-0.5 text-[12px] text-blue-normal rounded-[29px]'>필수</span> 
                                : <span className='bg-bluegray-light px-2.5 py-0.5 text-[12px] text-bluegray-normal rounded-[29px]'>선택</span>}
                                <p>{item.label}</p>
                            </div>
                            {item.hasDetail && <p className='text-[12px] text-bluegray-normal underline'>보기</p>} 
                        </div>
                    ))}
                </div>
            </div>
      </div> 
    </BottomSheet>
  )
}
