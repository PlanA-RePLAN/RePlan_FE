import { getTodoTag, type TodoTagId } from '@/shared/types/todo'

interface TodoTagProps {
  category: TodoTagId | string
}

export default function TodoTag({ category }: TodoTagProps) {
  const tag = getTodoTag(category)

  if (!tag) return null

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
