import ChevronDownIcon from "@/icons/ChevronDownIcon"
import { useState } from "react"

interface DropdownProps {
  items: string[]
  defaultValue?: string
  onChange: (item: string) => void
}

export default function Dropdown({ items, defaultValue, onChange }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [value, setValue] = useState(defaultValue ?? items[0])

  const handleClick = (item: string) => {
    setValue(item)
    setIsOpen(false)
    onChange(item)
  }

  return (
    <div className="relative flex">
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="px-3 py-1.5 rounded-2xl bg-white border border-bluegray-light-hover flex items-center justify-center gap-1.25 cursor-pointer"
      >
        <p className="text-xs font-semibold">{value}</p>
        <ChevronDownIcon className={`transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`} />
      </div>
      {isOpen && (
        <div className="absolute top-9 w-21 py-1.5 bg-white rounded-md shadow-[0px_4px_12px_rgba(0,0,0,0.08)] z-10">
          {items.map((item) => (
            <div
              key={item}
              onClick={(e) => { e.stopPropagation(); handleClick(item) }}
              className="py-1.75 flex justify-center items-center hover:bg-bluegray-light cursor-pointer"
            >
              <p className="text-bluegray-darker text-xs">{item}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
