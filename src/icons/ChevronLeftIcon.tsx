interface ChevronRightIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string
}

export default function ChecvronRightIcon(props: ChevronRightIconProps) {
  return (
    <svg
      width={props.width || '24'}
      height={props.height || '24'}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M16 4L8 11.7714L16 20"
        stroke={props.color || '#65696F'}
        strokeWidth="2"
        strokeLinecap="square"
      />
    </svg>
  )
}
