interface HomeNavIconProps {
    isActive?: boolean
}

export default function HomeNavIcon({ isActive = false }: HomeNavIconProps) {
    const color = isActive ? "#202021" : "#A9AFB9"
    return (
        <svg width="32" height="32" viewBox="42 13 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M48 38V23.3686L58 16L68 23.3686V38H60.5829V29.1041H55.4171V38H48Z" fill={color} />
        </svg>
    )
}
