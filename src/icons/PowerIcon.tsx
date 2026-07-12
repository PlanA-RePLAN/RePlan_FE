export default function PowerIcon({ ...props }: React.SVGProps<SVGSVGElement>) {
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
        d="M8 2V7"
        stroke="#A9AFB9"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M11.5 3.5A6 6 0 1 1 4.5 3.5"
        stroke="#A9AFB9"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}
