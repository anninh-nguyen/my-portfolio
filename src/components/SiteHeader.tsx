import { NavLink } from "react-router-dom";
import { useProfile } from "@/hooks/usePortfolioData";
import { cn } from "@/lib/utils";

export default function SiteHeader() {
  const { data: profile } = useProfile();
  const link = ({ isActive }: { isActive: boolean }) =>
    cn("text-sm transition-colors hover:text-primary", isActive ? "font-semibold text-primary" : "text-muted-foreground");
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <span className="text-sm font-semibold text-foreground">{profile?.full_name || "Portfolio"}</span>
        <nav className="flex gap-5">
          <NavLink to="/" end className={link}>Profile</NavLink>
          <NavLink to="/portfolio" className={link}>Portfolio</NavLink>
        </nav>
      </div>
    </header>
  );
}
