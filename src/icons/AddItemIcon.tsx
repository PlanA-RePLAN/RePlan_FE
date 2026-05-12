interface AddItemIconProps extends React.SVGProps<SVGSVGElement> {
  width?: number
  height?: number
  color?: string
}

export default function AddItemIcon({
  width = 28,
  height = 28,
  color = '#878C94',
}: AddItemIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="14" cy="14" r="12" fill="#F2F3F5" />
      <path d="M14 9V19" stroke={color} strokeWidth="1.5" />
      <path d="M19 14H9" stroke={color} strokeWidth="1.5" />
    </svg>
  )
}
