interface ChevronLeftIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string
}

export default function ChecvronLeftIcon({ color = '#65696F', width = 24, height = 24, ...props }: ChevronLeftIconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M16 4L8 11.7714L16 20" stroke={color} strokeWidth="2" strokeLinecap="square"/>
    </svg>
  )
}