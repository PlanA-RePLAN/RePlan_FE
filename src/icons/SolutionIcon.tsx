export default function SolutionIcon({
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="10" cy="10.5" r="7" fill="#579DEC" />
      <path
        d="M10 6.5L8.75 9.25L6 10.5L8.75 11.75L10 14.5L11.25 11.75L14 10.5L11.25 9.25"
        fill={props.color ?? '#F6F7F8'}
      />
    </svg>
  )
}
