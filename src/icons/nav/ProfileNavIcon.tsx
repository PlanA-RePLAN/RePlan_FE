interface ProfileNavIconProps {
    isActive?: boolean
}

export default function ProfileNavIcon({ isActive = false }: ProfileNavIconProps) {
    const color = isActive ? "#202021" : "#A9AFB9"
    return (
        <svg width="32" height="32" viewBox="319 13 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M338.777 28.2227C342.091 28.2227 344.777 30.9089 344.777 34.2227V37.7998C344.777 37.9101 344.688 37.9998 344.578 38H324.2C324.09 38 324 37.9103 324 37.7998V34.2227C324 30.9089 326.686 28.2227 330 28.2227H338.777ZM334.389 16C337.426 16 339.889 18.4624 339.889 21.5C339.889 24.5376 337.426 27 334.389 27C331.351 27 328.889 24.5376 328.889 21.5C328.889 18.4624 331.351 16 334.389 16Z" fill={color} />
        </svg>
    )
}
