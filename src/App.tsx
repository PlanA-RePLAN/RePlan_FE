import { BrowserRouter, Routes, Route } from 'react-router-dom'

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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Nav 미사용 페이지 */}
        <Route path="/" element={<Index />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="/onboarding" element={<OnBoarding />} />
        <Route path="/mypage/notification-setting" element={<NotificationSetting />} />
        <Route path="/mypage/profile-setting" element={<ProfileSetting />} />
        <Route path="/replan" element={<ReplanPage />} />

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
