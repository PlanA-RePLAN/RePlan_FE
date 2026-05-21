interface ChartNavIconProps {
    isActive?: boolean
}

export default function ChartNavIcon({ isActive = false }: ChartNavIconProps) {
    const color = isActive ? "#202021" : "#A9AFB9"
    return (
        <svg width="32" height="32" viewBox="225 13 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M231 22.875H236.5V38H231V22.875ZM247.5 28.375H253V38H247.5V28.375ZM239.25 16H244.75V38H239.25V16Z" fill={color} />
        </svg>
    )
}
