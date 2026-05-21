interface MoreIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string
}

export default function MoreIcon({
  width = 20,
  height = 20,
  color = '#A9AFB9',
  ...props
}: MoreIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="6" cy="10" r="1" fill={color} />
      <circle cx="10" cy="10" r="1" fill={color} />
      <circle cx="14" cy="10" r="1" fill={color} />
    </svg>
  )
}
