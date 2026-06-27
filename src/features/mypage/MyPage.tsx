import { useNavigate } from "react-router-dom"

// components
import MyPageList from "@/features/mypage/components/MyPageList"
import MyPageProfileIcon from "@/icons/MyPageProfileIcon"
import MyPageNoticeIcon from "@/icons/MyPageNoticeIcon"
import MyPageNotificationIcon from "@/icons/MyPageNotificationIcon"
import MyPagePrivacyIcon from "@/icons/MyPagePrivacyIcon"
import MyPageTermsIcon from "@/icons/MyPageTermsIcon"
import MyPageOpenSourceIcon from "@/icons/MyPageOpenSourceIcon"
import MyPageAppVersionIcon from "@/icons/MyPageAppVersionIcon"

export default function MyPage() {
    const navigate = useNavigate()

    const handleProfileSettingClick = () => {
        navigate('/mypage/profile-setting')
    }

    const handleNotificationSettingClick = () => {
        navigate('/mypage/notification-setting')
    }


    const SECTIONS = [
        { key: "service", label: "서비스"},
        { key: "info", label: "정보"},
        { key: "app", label: ""},
    ]

    const MYPAGE_ITEMS=[
        { id:1, title: "프로필", icon:<MyPageProfileIcon/>, section: "service", hasNewAlert: false, onClick: handleProfileSettingClick  },
        { id:2, title: "알림 설정", icon:<MyPageNoticeIcon/>, section: "service", hasNewAlert: false, onClick: handleNotificationSettingClick },
        { id:3, title: "공지사항", icon:<MyPageNotificationIcon/>, section: "info", hasNewAlert: true, onClick: () => window.open('https://app.notion.com/p/37712dc6738b80bda3d6c65eb341bd36?v=37712dc6738b8066ba35000cdde11b2c', '_blank') },
        { id:4, title: "개인정보 처리방침", icon:<MyPagePrivacyIcon/>, section: "info", hasNewAlert: false, onClick: () => window.open('https://app.notion.com/p/37712dc6738b80a0a8e7c5fb9324dff7', '_blank') },
        { id:5, title: "서비스 이용약관", icon:<MyPageTermsIcon/>, section: "info", hasNewAlert: false, onClick: () => window.open('https://app.notion.com/p/37712dc6738b80aa80f9e7cbb84ce0db', '_blank') },
        { id:6, title: "오픈 소스", icon:<MyPageOpenSourceIcon/>, section: "info", hasNewAlert: false, onClick: () => window.open('https://app.notion.com/p/37712dc6738b80e0a63ad6494eb9112b', '_blank') },
        { id:7, title: "앱 버전", icon:<MyPageAppVersionIcon/>, section: "app", hasNewAlert: false, rightContent: <span className="text-sm text-bluegray-normal">1.0.0</span> },
    ]
    
   
  return (
    <div>
        {SECTIONS.map(({ key, label }) => {
            const items = MYPAGE_ITEMS.filter((item) => item.section === key)
            if (items.length === 0) return null
            return (
            <div key={key}>
                {label && (
                <p className="px-5 py-3 text-bluegray-normal-active text-[14px] font-semibold">
                    {label}
                </p>
                )}
                {items.map((item) => (
                <MyPageList
                  key={item.id}
                  title={item.title}
                  icon={item.icon}
                  hasNewAlert={item.hasNewAlert}
                  rightContent={item.rightContent}
                  onClick={item.onClick}
                />
                ))}
                {key !== "app" && <div className="border-b-4 border-bluegray-light-hover"></div>}
            </div>
            )
        })}
    </div>
  )
}
