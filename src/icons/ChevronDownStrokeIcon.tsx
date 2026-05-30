interface ChevronDownStrokeIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string
}

export default function ChevronDownStrokeIcon({
  width = 24,
  height = 24,
  color = '#202021',
  ...props
}: ChevronDownStrokeIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M7 9L12.5 14.5L18 9" stroke={color} strokeWidth="2" />
    </svg>
  )
}
