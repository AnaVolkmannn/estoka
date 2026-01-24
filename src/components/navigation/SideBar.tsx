import { NavLink } from "react-router-dom"
import { cn } from "@/lib/utils"

import {
  LayoutDashboard,
  Package,
  Truck,
  FileText,
  ClipboardList,
  LogOut,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

import logoLight from "@/assets/logo/logo-light.png";
import logoDark from "@/assets/logo/logo-dark.png";
import { useTheme } from "@/components/theme-provider";
import { ModeToggle } from "../mode-toggle"
/* ======================================================
   MENU CONFIG
====================================================== */
const menuItems = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Produtos",
    to: "/dashboard/produtos",
    icon: Package,
  },
  {
    label: "Fornecedores",
    to: "/dashboard/Fornecedores",
    icon: Truck,
  },
  {
    label: "Lançar NF",
    to: "/dashboard/lancamentos/nf",
    icon: FileText,
  },
  {
    label: "Lançamento manual",
    to: "/dashboard/lancamentos/manual",
    icon: ClipboardList,
  },
]

/* ======================================================
   SIDEBAR (DESKTOP)
====================================================== */

export function DashboardSidebar() {
  return (
    <>
      {/* Desktop */}
      <aside className="hidden h-screen w-64 flex-col border-r bg-background md:flex">
        <SidebarContent />
      </aside>

      {/* Mobile */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              ☰
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}

/* ======================================================
   CONTENT
====================================================== */

function SidebarContent() {
  const { theme } = useTheme();
  const logo = theme === "dark" ? logoDark : logoLight;
  return (
    <div className="flex h-full flex-col">
      {/* LOGO */}
      <img src={logo} alt="Estoka" className="h-auto w-auto px-14 pt-2" />
    
      <Separator />

      {/* MENU */}
      <nav className="flex-1 space-y-1 px-2 py-4">
        {menuItems.map((item) => (
          <SidebarItem key={item.to} {...item} />
        ))}
      </nav>

      <Separator />

      {/* FOOTER */}
      <div className="p-4">
        <ModeToggle />
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
  )
}

/* ======================================================
   ITEM
====================================================== */

type SidebarItemProps = {
  label: string
  to: string
  icon: React.ElementType
}

function SidebarItem({ label, to, icon: Icon }: SidebarItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )
      }
    >
      <Icon className="h-4 w-4" />
      {label}
    </NavLink>
  )
}
