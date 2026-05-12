interface TitleProps {
  children: React.ReactNode
  className?: string
}

export default function Title({ children, className }: TitleProps) {
  return (
    <h1
      className={`text-2xl font-bold leading-[130%] text-bluegray-black ${className}`}
    >
      {children}
    </h1>
  )
}
