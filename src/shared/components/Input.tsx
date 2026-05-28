import { createContext, useContext, useState } from 'react'

interface InputContextValue {
  value: string
  isFocused: boolean
  maxLength?: number
  showCount?: 'always' | 'focus'
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  setIsFocused: (focused: boolean) => void
}

const InputContext = createContext<InputContextValue | null>(null)

const useInputContext = () => {
  const ctx = useContext(InputContext)
  if (!ctx) throw new Error('Input 하위 컴포넌트는 Input 안에서 사용해야 해요')
  return ctx
}

interface InputProps {
  children: React.ReactNode
  value: string
  setValue: (value: string) => void
  maxLength?: number
  showCount?: 'always' | 'focus'
}

function Input({
  children,
  value,
  setValue,
  maxLength,
  showCount,
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = maxLength
      ? e.target.value.slice(0, maxLength)
      : e.target.value
    setValue(newValue)
  }

  return (
    <InputContext.Provider
      value={{
        value,
        isFocused,
        maxLength,
        showCount,
        handleChange,
        setIsFocused,
      }}
    >
      <div className="w-full">{children}</div>
    </InputContext.Provider>
  )
}

interface LabelProps {
  option: 'primary' | 'secondary'
  children: React.ReactNode
}

function Label({ option, children }: LabelProps) {
  const optionClasses = {
    primary: 'text-md text-bluegray-black font-medium',
    secondary: 'text-s text-bluegray-dark font-medium',
  }
  return <p className={optionClasses[option]}>{children}</p>
}

interface FieldProps {
  placeholder: string
  height?: number
}

function Field({ placeholder, height = 49 }: FieldProps) {
  const { handleChange, setIsFocused, maxLength } = useInputContext()
  return (
    <textarea
      placeholder={placeholder}
      onChange={handleChange}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={{ height }}
      maxLength={maxLength}
      className="w-full bg-bluegray-light text-bluegray-black mt-2 mb-1 rounded-xl px-4 py-3 resize-none hover:border hover:border-blue-normal placeholder:text-bluegray-normal font-medium"
    />
  )
}

function Bottom({ children }: { children: React.ReactNode }) {
  return <div className="flex justify-between items-center">{children}</div>
}

function Count() {
  const { value, isFocused, maxLength, showCount } = useInputContext()
  if (!maxLength) return null
  if (!(showCount === 'always' || (showCount === 'focus' && isFocused)))
    return null
  return (
    <p className="text-xs text-bluegray-normal ml-auto">
      {value.length}/{maxLength}
    </p>
  )
}

function Example({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-medium text-bluegray-normal">{children}</p>
}

Input.Label = Label
Input.Field = Field
Input.Bottom = Bottom
Input.Count = Count
Input.Example = Example

export default Input
