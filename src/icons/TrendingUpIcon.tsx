interface TrendingUpIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string
}

export default function TrendingUpIcon({
  color,
  ...props
}: TrendingUpIconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3.078 14.24L2 13.162L7.698 7.4255L10.778 10.5055L14.782 6.54H12.78V5H17.4V9.62H15.86V7.618L10.778 12.7L7.698 9.62L3.078 14.24Z"
        fill={color ?? '#202021'}
      />
    </svg>
  )
}
