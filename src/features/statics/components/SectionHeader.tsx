export default function SectionHeader({
  icon,
  title,
}: {
  icon: React.ReactNode
  title: string
}) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-base font-bold text-bluegray-black">{title}</span>
    </div>
  )
}
