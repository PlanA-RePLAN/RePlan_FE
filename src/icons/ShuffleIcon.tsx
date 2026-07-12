export default function ShuffleIcon({
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
      <path
        d="M2 12.5L13 3.5M13 3.5H9M13 3.5V7.5"
        stroke="#A9AFB9"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 3.5L13 12.5M13 12.5H9M13 12.5V8.5"
        stroke="#A9AFB9"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
