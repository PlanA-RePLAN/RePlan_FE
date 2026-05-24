import { Outlet } from "react-router-dom"
import Nav from "@/shared/components/Nav"

export default function LayoutWithNav() {
  return (
    <div>
      <Outlet />
      <Nav />
    </div>
  )
}
