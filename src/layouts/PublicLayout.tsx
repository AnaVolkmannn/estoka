import { Outlet } from "react-router-dom";
import { Topbar } from "@/components/navigation/TopBar";

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Topbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
