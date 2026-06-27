interface ExampleTagProps {
  tag: string
  onClick?: () => void
}

export default function ExampleTag({ tag, onClick }: ExampleTagProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-fit shrink-0 px-3 py-1.5 border border-bluegray-light-hover rounded-full text-bluegray-dark text-xs font-medium"
    >
      {tag}
    </button>
  )
}
