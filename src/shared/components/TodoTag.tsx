import { getTodoTag, type TodoTagId } from '@/shared/types/todo'

interface TodoTagProps {
  category: TodoTagId | string
  color?: string | null
}

export default function TodoTag({ category, color }: TodoTagProps) {
  const tag = getTodoTag(category)

  if (tag) {
    return (
      <div
        style={{
          backgroundColor: tag.bgColor,
          color: tag.textColor,
          border: tag.dashed ? `1px dashed ${tag.textColor}` : 'none',
        }}
        className="w-17 py-1 rounded-full text-xs font-semibold flex items-center justify-center"
      >
        {tag.label}
      </div>
    )
  }

  if (!category) return null

  return (
    <div
      style={{
        backgroundColor: color ? `${color}1A` : 'transparent',
        color: color ?? '#A9AFB9',
      }}
      className="w-17 py-1 rounded-full text-xs font-semibold flex items-center justify-center"
    >
      {category}
    </div>
  )
}
