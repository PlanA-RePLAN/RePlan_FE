interface ClockIconProps extends React.SVGProps<SVGSVGElement> {
  filled?: boolean
}

export default function ClockIcon({ filled, ...props }: ClockIconProps) {
  return (
    <>
      {filled ? (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
        >
          <path
            d="M10 3C9.08075 3 8.17049 3.18106 7.32122 3.53284C6.47194 3.88463 5.70026 4.40024 5.05025 5.05025C3.7375 6.36301 3 8.14348 3 10C3 11.8565 3.7375 13.637 5.05025 14.9497C5.70026 15.5998 6.47194 16.1154 7.32122 16.4672C8.17049 16.8189 9.08075 17 10 17C11.8565 17 13.637 16.2625 14.9497 14.9497C16.2625 13.637 17 11.8565 17 10C17 9.08075 16.8189 8.17049 16.4672 7.32122C16.1154 6.47194 15.5998 5.70026 14.9497 5.05025C14.2997 4.40024 13.5281 3.88463 12.6788 3.53284C11.8295 3.18106 10.9193 3 10 3ZM12.94 12.94L9.3 10.7V6.5H10.35V10.14L13.5 12.03L12.94 12.94Z"
            fill="#3B3D41"
          />
        </svg>
      ) : (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
        >
          <path
            d="M8 4.57141L8 8.42855L10.5714 9.91317"
            stroke="#A9AFB9"
            fill="none"
          />
          <circle cx="8" cy="8" r="5.5" stroke="#A9AFB9" fill="none" />
        </svg>
      )}
    </>
  )
}
