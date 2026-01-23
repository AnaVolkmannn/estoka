import { Outlet } from "react-router-dom"
import { DashboardSidebar } from "@/components/navigation/SideBar"

export function DashboardLayout() {
  return (
    
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}
