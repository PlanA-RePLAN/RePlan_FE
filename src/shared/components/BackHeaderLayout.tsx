import { useNavigate } from 'react-router-dom'

// components
import BackHeader from './BackHeader'

interface BackHeaderLayoutProps {
  title: string
  onBack?: () => void
  className?: string
  children: React.ReactNode
}

export default function BackHeaderLayout({
  title,
  onBack,
  className,
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
      <BackHeader title={title} onBack={handleBack} className={className} />
      <main className="pt-15">{children}</main>
    </>
  )
}
