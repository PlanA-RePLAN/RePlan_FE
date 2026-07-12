export default function SleepIcon({ ...props }: React.SVGProps<SVGSVGElement>) {
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
        d="M4.5 2.5L2.5 4.5M11.5 2.5L13.5 4.5"
        stroke="#A9AFB9"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <circle cx="8" cy="9" r="5.5" fill="#A9AFB9" />
      <path
        d="M6.3 7H9.7L6.3 11H9.7"
        stroke="white"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}
