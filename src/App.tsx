import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { listenForegroundPush } from '@/shared/firebase'

// components
import Index from '@/features/profileSetup'
import ProfileSetup from '@/features/profileSetup/ProfileSetup'
import OnBoarding from '@/features/onBoarding'
import Goal from './features/goal/Goal'
import LayoutWithNav from '@/shared/components/LayoutWithNav'
import Home from './features/home/Home'
import MyPage from './features/mypage/MyPage'
import ProfileSetting from './features/mypage/ProfileSetting'
import NotificationSetting from './features/mypage/NotificationSetting'
import ReplanPage from '@/features/replan'
import Statics from './features/statics/Statics'
import Notification from '@/features/notification/Notification'
import KakaoCallback from '@/features/oauth/KakaoCallback'
import NaverCallback from '@/features/oauth/NaverCallback'

function App() {
  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      listenForegroundPush()
    }
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        {/* Nav 미사용 페이지 */}
        <Route path="/oauth/kakao" element={<KakaoCallback />} />
        <Route path="/oauth/naver" element={<NaverCallback />} />
        <Route path="/" element={<Index />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="/onboarding" element={<OnBoarding />} />
        <Route
          path="/mypage/notification-setting"
          element={<NotificationSetting />}
        />
        <Route path="/mypage/profile-setting" element={<ProfileSetting />} />
        <Route path="/replan/:todoId" element={<ReplanPage />} />
        <Route path="/notification" element={<Notification />} />

        {/* Nav 사용 페이지 */}
        <Route element={<LayoutWithNav />}>
          <Route path="/goal" element={<Goal />} />
          <Route path="/home" element={<Home />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/statics" element={<Statics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
