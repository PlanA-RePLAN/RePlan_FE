export default function PoorConditionIcon({
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M19 9C19 7.35 17.65 6 16 6C14.35 6 13 7.35 13 9V18C13 18.55 12.55 19 12 19C11.45 19 11 18.55 11 18V6C11 4.35 9.65 3 8 3C6.35 3 5 4.35 5 6V11H2V13H6C6.55 13 7 12.55 7 12V6C7 5.45 7.45 5 8 5C8.55 5 9 5.45 9 6V18C9 19.65 10.35 21 12 21C13.65 21 15 19.65 15 18V9C15 8.45 15.45 8 16 8C16.55 8 17 8.45 17 9V12C17 12.55 17.45 13 18 13H22V11H19V9Z"
        fill="#A9AFB9"
      />
    </svg>
  )
}
