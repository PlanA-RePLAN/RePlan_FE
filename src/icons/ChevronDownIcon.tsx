interface ChevronDownIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string
}

export default function ChevronDownIcon({
    width = 14,
    height = 14,
    color = '#E4E6E9',
    ...props
} : ChevronDownIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 14 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M8 13.5L14.0622 6H1.93782L8 13.5Z" fill={color} />
    </svg>
  )
}