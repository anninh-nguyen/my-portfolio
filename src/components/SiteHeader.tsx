import { NavLink } from "react-router-dom";
import { useProfile } from "@/hooks/usePortfolioData";
import { cn } from "@/lib/utils";

export default function SiteHeader() {
  const { data: profile } = useProfile();
  const cover = (profile as { cover_url?: string } | undefined)?.cover_url;
  const tab = ({ isActive }: { isActive: boolean }) =>
    cn(
      "-mb-px border-b-2 px-4 py-2.5 text-sm transition-colors",
      isActive ? "border-primary font-semibold text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
    );
  return (
    <header>
      <div className="relative h-40 w-full overflow-hidden bg-gradient-to-r from-secondary via-muted to-accent sm:h-56">
        {cover && <img src={cover} alt="Cover" className="h-full w-full object-cover" />}
      </div>
      <nav className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl px-4">
          <NavLink to="/" end className={tab}>Profile</NavLink>
          <NavLink to="/portfolio" className={tab}>Portfolio</NavLink>
        </div>
      </nav>
    </header>
  );
}
