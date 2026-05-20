import { BrowserRouter, Routes, Route } from 'react-router-dom'

// components
import Index from '@/features/profileSetup'
import ProfileSetup from '@/features/profileSetup/ProfileSetup'
import OnBoarding from '@/features/onBoarding'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="/onboarding" element={<OnBoarding />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
