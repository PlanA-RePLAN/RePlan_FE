interface ExampleTagProps {
  tag: string
}

export default function ExampleTag({ tag }: ExampleTagProps) {
  return (
    <div className="w-fit px-3 py-1.5 border border-bluegray-light-hover rounded-full text-bluegray-dark text-xs font-medium">
      {tag}
    </div>
  )
}
