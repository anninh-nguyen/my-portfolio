import { NavLink } from "react-router-dom";
import { useProfile } from "@/hooks/usePortfolioData";
import { cn } from "@/lib/utils";

export default function SiteHeader() {
  const { data: profile } = useProfile();
  const cover = (profile as { cover_url?: string } | undefined)?.cover_url;
  const tab = ({ isActive }: { isActive: boolean }) =>
    cn(
      "-mb-px border-b-2 px-3 py-2.5 text-sm transition-colors",
      isActive ? "border-primary font-semibold text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
    );
  return (
    <header>
      <div className="relative aspect-[4/1] w-full overflow-hidden bg-gradient-to-r from-secondary via-muted to-accent">
        {cover && <img src={cover} alt="Cover" className="h-full w-full object-cover" />}
      </div>
      <nav className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto scrollbar-none flex max-w-4xl overflow-x-auto overflow-y-hidden px-4">
          <NavLink to="/" end className={tab}>Profile</NavLink>
          <NavLink to="/experience" className={tab}>Experience</NavLink>
          <NavLink to="/portfolio" className={tab}>Portfolio</NavLink>
          <NavLink to="/contact" className={tab}>Contact</NavLink>
        </div>
      </nav>
    </header>
  );
}
