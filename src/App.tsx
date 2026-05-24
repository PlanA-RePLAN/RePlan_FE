import { BrowserRouter, Routes, Route } from 'react-router-dom'

// components
import Index from '@/features/profileSetup'
import ProfileSetup from '@/features/profileSetup/ProfileSetup'
import OnBoarding from '@/features/onBoarding'
import Goal from './features/goal/Goal'
import LayoutWithNav from '@/shared/components/LayoutWithNav'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Nav 미사용 페이지 */}
        <Route path="/" element={<Index />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="/onboarding" element={<OnBoarding />} />

        {/* Nav 사용 페이지 */}
        <Route element={<LayoutWithNav />}>
          <Route path="/goal" element={<Goal />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
