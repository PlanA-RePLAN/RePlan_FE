interface LoopLeftIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string
}

export default function LoopLeftIcon({
  width = 16,
  height = 16,
  color = '#A9AFB9',
  ...props
}: LoopLeftIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8 3.33334C10.9455 3.33334 13.3333 5.72115 13.3333 8.66668C13.3333 11.6122 10.9455 14 8 14C5.68556 14 3.71382 12.5099 2.99461 10.4444"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M2.66667 6.66668V10H6"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
