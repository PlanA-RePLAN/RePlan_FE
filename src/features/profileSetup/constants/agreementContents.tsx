import InfoIcon from "@/icons/InfoIcon"

const h = (text: string) => <p className="text-m font-semibold text-bluegray-black mt-4">{text}</p>
const p = (text: string) => <p className="text-s text-bluegray-dark">{text}</p>

export const TERMS_CONTENT = (
  <div>
    {h('제1조 (목적)')}
    {p('본 약관은 PlanA가 제공하는 Re:Plan 및 관련 제반 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무, 책임 소재 및 기타 필요한 사항을 규정함을 목적으로 합니다.')}

    {h('제2조 (용어의 정의)')}
    {p('"서비스"란 단말기(PC, 휴대형 단말기 등)와 상관없이 이용자가 이용할 수 있는 Re:Plan의 할 일 관리, 실패 패턴 분석, AI 목표 구체화 및 투두 재구성 등의 기능을 의미합니다.')}
    {p('"이용자"란 본 서비스에 접속하여 본 약관에 따라 회사가 제공하는 서비스를 이용하는 회원을 말합니다.')}

    {h('제3조 (이용계약의 체결 및 소셜 로그인)')}
    {p('이용계약은 이용자가 본 약관 및 개인정보 처리방침에 동의하고 소셜 로그인(카카오, Apple, Naver, Google)을 통해 회원가입을 완료함으로써 체결됩니다.')}
    {p('회사는 소셜 로그인 연동을 통해 이용자의 식별 정보를 수집하며, 이용자는 본인의 소셜 계정을 안전하게 관리할 책임이 있습니다.')}

    {h('제4조 (서비스의 제공 및 변경)')}
    {p('회사는 이용자에게 할 일 작성, 실패 사유 분석, 외부 AI 모델(Google Gemini API 등)을 활용한 목표 구체화 및 텍스트 재구성 서비스를 제공합니다.')}
    {p('회사는 서비스의 개선, 운영상 또는 기술상의 필요에 따라 제공하고 있는 서비스를 변경하거나 종료할 수 있으며, 이 경우 앱 내 공지사항을 통해 사전 안내합니다.')}

    {h('제5조 (이용자의 의무)')}
    {p('이용자는 다음 행위를 하여서는 안 됩니다.')}
    {p('서비스 이용 과정에서 타인의 정보 도용 또는 허위 사실 기재')}
    {p('서비스 내 제공되는 AI 분석 기능 등을 비정상적인 방법으로 과도하게 호출하여 서버에 무리를 주는 행위')}
    {p('불법적, 폭력적, 혐오적인 내용의 할 일이나 목표를 입력하여 시스템에 악영향을 미치는 행위')}
    {p('회사의 동의 없이 서비스를 영리 목적으로 이용하는 행위')}

    {h('제6조 (권리의 귀속 및 데이터 활용)')}
    {p('서비스에 대한 저작권 및 지식재산권은 회사에 귀속됩니다.')}
    {p('이용자가 서비스 내에 작성한 투두리스트, 목표, 실패 사유 등 데이터에 대한 권리는 이용자에게 있습니다. 다만 이용자는 회사가 서비스 제공, 개선 및 신규 기능 개발 목적의 범위 내에서 해당 데이터를 사용할 수 있는 권한을 부여합니다.')}
    {p('이용자가 서비스 내에 작성한 투두리스트, 실패 사유 등의 데이터는 익명화 및 통계화되어 서비스 개선, AI 프롬프트 고도화 및 신규 기능 개발을 위해 영구적으로 활용될 수 있습니다.')}

    {h('제7조 (면책 조항)')}
    {p("AI 결과물의 한계: 서비스에서 제공하는 '목표 구체화' 및 '투두 재구성' 기능은 외부 인공지능(AI) 모델을 기반으로 생성됩니다. 회사는 AI가 생성한 결과물의 정확성, 신뢰성, 적합성 및 완벽성을 보증하지 않으며, 이용자가 해당 결과물을 활용하여 발생한 결과에 대해 일체의 책임을 지지 않습니다.")}
    {p('서비스 중단: 회사는 천재지변, 서버 장애, 외부 API(Google Gemini 등)의 통신 장애 등 불가항력적인 사유로 인해 서비스를 제공할 수 없는 경우 서비스 제공에 관한 책임이 면제됩니다.')}
    {p('회사는 무료로 제공되는 서비스 이용과 관련하여 관련 법령에 특별한 규정이 없는 한 책임을 지지 않습니다.')}

    {h('제8조 (계약 해지 및 탈퇴)')}
    {p('이용자는 언제든지 서비스 내 설정 메뉴를 통해 회원 탈퇴를 요청할 수 있으며, 회사는 관련 법령 및 개인정보 처리방침에 따라 이용자의 데이터를 안전하게 처리(삭제 또는 익명화)합니다.')}

    {h('제9조 (분쟁 해결 및 준거법)')}
    {p('본 약관과 관련하여 회사와 이용자 간에 발생한 분쟁에 대해서는 대한민국 법을 준거법으로 하며, 관할법원은 민사소송법에 따릅니다.')}

    {h('부칙')}
    {p('본 약관은 2026년 [월] [일]부터 시행됩니다.')}
  </div>
)

const PRIVACY_ROWS = [
  { label: '수집 항목', value: '이메일(소셜 로그인), 닉네임, 투두·목표·실패 사유 등 서비스 이용 기록' },
  { label: '이용 목적', value: '회원 식별, 목표 구체화 및 AI 기반 투두 재구성, 통계 제공' },
  { label: '보유 기간', value: '회원 탈퇴 시까지' },
  { label: '처리 위탁', value: 'AI 분석을 위해 Google Gemini API에 처리를 위탁하며, 입력 데이터는 Google의 AI 모델 학습에 사용되지 않습니다.' },
]

const MARKETING_ROWS = [
  { label: '전송 목적', value: '이벤트·혜택·신규 기능 소식 안내' },
  { label: '전송 방법', value: '이메일 / 앱 푸시' },
]

export const PRIVACY_CONTENT = (
  <div className="text-s text-bluegray-dark-active">
    {h('수집 내용')}
    <div className="mt-1 border border-bluegray-light-active rounded-xl overflow-hidden">
      {PRIVACY_ROWS.map(({ label, value }, i) => (
        <div key={label} className={`flex items-stretch ${i < PRIVACY_ROWS.length - 1 ? 'border-b border-bluegray-light' : ''}`}>
          <p className="w-[95px] shrink-0 px-4 py-4 flex items-center font-semibold text-bluegray-dark-active bg-bluegray-light">{label}</p>
          <p className="px-4 py-3 text-bluegray-dark">{value}</p>
        </div>
      ))}
    </div>
    <div className="mt-6 bg-blue-light rounded-[14px] text-[12px] text-blue-normal px-3 py-2.5">동의를 거부할 권리가 있으며, 필수 항목 미동의 시 서비스 이용이 제한됩니다.</div>
  </div>
)

export const MARKETING_CONTENT = (
  <div>
    {h('전송 내용')}
    <div className="mt-1 border border-bluegray-light-active rounded-xl overflow-hidden">
      {MARKETING_ROWS.map(({ label, value }, i) => (
        <div key={label} className={`flex items-stretch ${i < MARKETING_ROWS.length - 1 ? 'border-b border-bluegray-light' : ''}`}>
          <p className="w-[95px] shrink-0 px-4 py-4 flex items-center font-semibold text-bluegray-dark-active bg-bluegray-light">{label}</p>
          <p className="px-4 py-3 text-bluegray-dark">{value}</p>
        </div>
      ))}
    </div>
    <div className="mt-6 bg-blue-light rounded-[14px] text-[12px] text-blue-normal px-3 py-2.5">동의하지 않아도 서비스 이용에 제한이 없습니다.</div>
    <div className="flex items-center gap-2 mt-2">
      <InfoIcon variant="filled" />
      <p className="text-bluegray-normal text-[12px]">수신 동의는 설정 &gt; 알림에서 언제든 철회할 수 있습니다.</p>
    </div>
  </div>
)
