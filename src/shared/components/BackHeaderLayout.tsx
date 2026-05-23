import { useNavigate } from 'react-router-dom'

// components
import BackHeader from './BackHeader'

interface BackHeaderLayoutProps {
  title: string
  onBack?: () => void
  children: React.ReactNode
}

export default function BackHeaderLayout({
  title,
  onBack,
  children,
}: BackHeaderLayoutProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate(-1)
    }
  }

  return (
    <>
      <BackHeader title={title} onBack={handleBack} />
      <main className="pt-18">{children}</main>
    </>
  )
}
