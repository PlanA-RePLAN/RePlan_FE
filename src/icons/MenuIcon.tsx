interface DescriptionProps extends React.SVGProps<SVGSVGElement> {
  width?: number
  height?: number
  color?: string
}

export default function MenuIcon({
  width = 24,
  height = 24,
  color = '#3B3D41',
}: DescriptionProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.2308 16.3077V18H4V16.3077H19.2308ZM19.2308 11.6538V13.3462H4V11.6538H19.2308ZM19.2308 7V8.69231H4V7H19.2308Z"
        fill={color}
      />
    </svg>
  )
}
