export default function ClockPlusIcon({
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="6.5" cy="6.5" r="6" fill="#A9AFB9" />
      <path
        d="M6.5 3.2V6.5L8.8 8"
        stroke="white"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="12.5" cy="12.5" r="3" fill="white" />
      <path
        d="M12.5 11V14M11 12.5H14"
        stroke="#A9AFB9"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  )
}
