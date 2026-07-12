export default function HourglassIcon({
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
      <rect x="3" y="1.5" width="10" height="1.3" rx="0.65" fill="#A9AFB9" />
      <rect x="3" y="13.2" width="10" height="1.3" rx="0.65" fill="#A9AFB9" />
      <path
        d="M4 2.8H12C12 5.2 10 6.8 8.3 7.7C8.1 7.8 8.1 8.2 8.3 8.3C10 9.2 12 10.8 12 13.2H4C4 10.8 6 9.2 7.7 8.3C7.9 8.2 7.9 7.8 7.7 7.7C6 6.8 4 5.2 4 2.8Z"
        fill="#A9AFB9"
      />
    </svg>
  )
}
