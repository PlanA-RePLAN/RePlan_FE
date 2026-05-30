import { Outlet } from "react-router-dom"
import MainHeader from "./MainHeader"
import Nav from "@/shared/components/Nav"

export default function LayoutWithNav() {
  return (
    <div>
      <MainHeader />
      <Outlet />
      <Nav />
    </div>
  )
}
