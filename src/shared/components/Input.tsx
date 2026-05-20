import { useState } from "react"

interface InputProps {
    option : 'primary' | 'secondary'
    title : string 
    placeholder : string
    onChange? : (value : string) => void
    showCount? : 'always' | 'focus'
    maxLength? : number
}

export default function Input({ 
    option,
    title,
    placeholder,
    onChange,
    showCount,
    maxLength,
}:InputProps){
    const optionClasses ={
        primary : "text-md text-bluegray-black",
        secondary : 'text-s text-bluegray-dark'
    }

    const [value, setValue] = useState("")
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = maxLength ? e.target.value.slice(0, maxLength) : e.target.value
        setValue(newValue)
        onChange?.(newValue)
    } 

    const [isFocused, setIsFocused] = useState(false)
  
    return (
    <div className="w-full">
        <p className={optionClasses[option]}>{title}</p>
        <input 
        type="text" 
        placeholder={placeholder} 
        onChange={handleChange}
        onFocus={()=>setIsFocused(true)}
        onBlur={()=>setIsFocused(false)}
        className="w-full h-12.25 bg-bluegray-light mt-2 mb-1 rounded-xl px-4
        hover:border hover:border-blue-normal
        "
        />
         {maxLength && (showCount === 'always' || (showCount === 'focus' &&
        isFocused)) && (
        <p className="text-xs text-bluegray-normal text-right">
            {value.length}/{maxLength}
        </p>
        )}
    </div>
  )
}

