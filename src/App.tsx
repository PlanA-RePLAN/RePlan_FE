import { BrowserRouter, Routes, Route } from 'react-router-dom'

// components
import Index from '@/features/profileSetup'
import ProfileSetup from '@/features/profileSetup/ProfileSetup'
import OnBoarding from '@/features/onBoarding'
import Goal from './features/goal/Goal'
import LayoutWithNav from '@/shared/components/LayoutWithNav'
import Home from './features/home/Home'
import ReplanPage from '@/features/replan'
import Statics from './features/statics/Statics'
import Notification from '@/features/notification/Notification'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Nav 미사용 페이지 */}
        <Route path="/" element={<Index />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="/onboarding" element={<OnBoarding />} />
        <Route path="/replan" element={<ReplanPage />} />
        <Route path="/notification" element={<Notification />} />

        {/* Nav 사용 페이지 */}
        <Route element={<LayoutWithNav />}>
          <Route path="/goal" element={<Goal />} />
          <Route path="/home" element={<Home />} />
          <Route path="/statics" element={<Statics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
