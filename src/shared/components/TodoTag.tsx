import { cn } from '@/shared/utils/cn'

const FIXED_STYLES: Record<string, string> = {
  Study: 'bg-tag1-back text-tag1-text',
  Project: 'bg-tag2-back text-tag2-text',
  Health: 'bg-tag1-back text-tag1-text',
  Rest: 'bg-tag3-back text-tag3-text',
  Other: 'bg-tag4-back text-tag4-text',
  미선택: 'bg-white border border-bluegray-light-active text-bluegray-dark',
}

interface TodoTagProps {
  category: string
}

export default function TodoTag({ category }: TodoTagProps) {
  const style = FIXED_STYLES[category] ?? 'bg-tag4-back text-tag4-text'
  return (
    <div className={cn('px-2 py-1 rounded-full text-xs font-semibold', style)}>
      {category}
    </div>
  )
}
