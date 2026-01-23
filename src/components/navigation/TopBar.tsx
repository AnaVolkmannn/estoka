import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { useTheme } from "@/components/theme-provider";

import logoLight from "@/assets/logo/logo-light.png";
import logoDark from "@/assets/logo/logo-dark.png";

export function Topbar() {
  const { theme } = useTheme();
  const logo = theme === "dark" ? logoDark : logoLight;

  return (
    <header className="bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Estoka" className="h-11 w-auto" />
        </Link>

        {/* Links */}
        <nav className="hidden gap-6 md:flex">
          <a
            href="#features"
            className="
              text-sm transition-colors
              text-(--nav-link)
              hover:text-(--nav-link-hover)
            "
          >
            Funcionalidades
          </a>

          <a
            href="#how-it-works"
            className="
              text-sm transition-colors
              text-(--nav-link)
              hover:text-(--nav-link-hover)
            "
          >
            Como funciona
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <ModeToggle />

          <Link to="/login">
            <Button variant="outline">Entrar</Button>
          </Link>

          <Link to="/register">
            <Button variant="default">Criar conta</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
