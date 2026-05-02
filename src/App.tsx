import { BrowserRouter, Routes, Route } from 'react-router-dom'

// components
import OnBoarding from '@/features/onBoarding';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OnBoarding />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
