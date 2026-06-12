import Toggle from "@/shared/components/Toggle"

interface NotificationItemProps {
    title: string
    content: string
}

export default function NotificationItem({
    title, content
}) {
  return (
    <div className="p-5 flex justify-between items-center border-b border-bluegray-light-hover">
        <div className="flex flex-col gap-1">
            <h3 className="text-[16px]">{title}</h3>
        <p className="text-[12px] text-bluegray-dark">{content}</p>
        </div>
        <Toggle checked onChange={()=>{}}/>
    </div>
  )
}
