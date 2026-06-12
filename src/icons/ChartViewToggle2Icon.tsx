export default function ChartViewToggle2Icon(
  props: React.SVGProps<SVGSVGElement>,
) {
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
        d="M1 13.2H3.44444V10.8H1V13.2ZM1 18H3.44444V15.6H1V18ZM1 8.4H3.44444V6H1V8.4ZM5.88889 13.2H23V10.8H5.88889V13.2ZM5.88889 18H23V15.6H5.88889V18ZM5.88889 6V8.4H23V6H5.88889Z"
        fill={props.color || '#E4E6E9'}
      />
    </svg>
  )
}
