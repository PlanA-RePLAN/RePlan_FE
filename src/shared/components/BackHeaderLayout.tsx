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
  return (
    <>
      <BackHeader title={title} onBack={onBack} />
      <main className="pt-18">{children}</main>
    </>
  )
}
