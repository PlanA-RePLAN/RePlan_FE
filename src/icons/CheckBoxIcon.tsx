interface CheckBoxIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string
  height?: string | number
  width?: string | number
  color?: string
}

export default function CheckBoxIcon({
  className,
  height,
  width,
  color,
}: CheckBoxIconProps) {
  return (
    <svg
      width={width || '18'}
      height={height || '18'}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="18" height="18" rx="5" fill="#202021" />
      <path
        d="M12.5334 5.4668L7.91121 11.5335L5.6001 8.50013"
        stroke={color || 'white'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
