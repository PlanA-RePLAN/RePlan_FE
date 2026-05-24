import { cn } from '@/shared/utils/cn'

interface TodoTagProps {
  category: 'Study' | 'Project' | 'Health' | 'Rest' | 'Other' | '미선택'
}

export default function TodoTag({ category }: TodoTagProps) {
  const optionStlyes = {
    Study: 'bg-tag1-back text-tag1-text',
    Project: 'bg-tag2-back text-tag2-text',
    Health: 'bg-tag1-back text-tag1-text',
    Rest: 'bg-tag3-back text-tag3-text',
    Other: 'bg-tag4-back text-tag4-text',
    미선택: 'bg-white border border-bluegray-light-active text-bluegray-dark',
  }
  return (
    <div
      className={cn(
        'px-2 py-1 rounded-full text-xs font-semibold',
        optionStlyes[category],
      )}
    >
      {category}
    </div>
  )
}
