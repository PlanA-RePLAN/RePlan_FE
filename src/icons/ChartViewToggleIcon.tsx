interface ChartViewToggleIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string
}

export default function ChartViewToggleIcon(props: ChartViewToggleIconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 9.375H8.5V19H5V9.375ZM15.5 12.875H19V19H15.5V12.875ZM10.25 5H13.75V19H10.25V5Z"
        fill={props.color || '#E4E6E9'}
      />
    </svg>
  )
}
