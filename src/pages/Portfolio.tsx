import { sanitizeHtml } from "@/lib/sanitize";
import SiteHeader from "@/components/SiteHeader";
import { usePortfolios, useProjects } from "@/hooks/usePortfolioData";
import type { Tables } from "@/integrations/supabase/types";

function ProjectCard({ p }: { p: Tables<"projects"> }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-md border border-border bg-card shadow-sm">
      <div className="flex-1 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold uppercase leading-snug tracking-wide text-heading">{p.title}</h3>
          {p.image_url && <img src={p.image_url} alt={p.title} className="h-[83px] w-[83px] shrink-0 rounded object-cover" />}
        </div>
        {(p.role || p.client_location) && (
          <p className="mt-2 text-sm text-foreground/80">
            {p.role && <>My role. <span className="font-semibold text-primary">{p.role}</span></>}
            {p.role && p.client_location && " ; "}
            {p.client_location && <>Client's location <span className="font-semibold text-primary">{p.client_location}</span></>}
          </p>
        )}
        {p.description && <div className="prose prose-sm mt-2 max-w-none text-sm text-foreground/80 [&_*]:text-sm" dangerouslySetInnerHTML={{ __html: sanitizeHtml(p.description) }} />}
        {p.technologies && (
          <div className="mt-3 text-sm">
            <p className="font-semibold text-foreground">Technologies</p>
            <p className="text-foreground/80">{p.technologies}</p>
          </div>
        )}
        {p.achievements && (
          <div className="mt-3 text-sm">
            <p className="font-semibold text-foreground">Achievement</p>
            <div className="prose prose-sm max-w-none text-sm text-foreground/80 [&_*]:text-sm prose-ul:list-none prose-ul:pl-0 [&_li]:relative [&_li]:pl-5 [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:content-['➢']" dangerouslySetInnerHTML={{ __html: sanitizeHtml(p.achievements) }} />
          </div>
        )}
      </div>
      <div className="h-1 bg-primary" />
    </article>
  );
}

export default function Portfolio() {
  const { data: portfolios = [] } = usePortfolios();
  const { data: projects = [], isLoading } = useProjects();
  const ungrouped = projects.filter((p) => !p.portfolio_id || !portfolios.some((g) => g.id === p.portfolio_id));
  const groups = [
    ...portfolios.map((g) => ({ ...g, items: projects.filter((p) => p.portfolio_id === g.id) })),
    ...(ungrouped.length ? [{ id: "other", name: portfolios.length ? "Other projects" : "", description: "", items: ungrouped }] : []),
  ].filter((g) => g.items.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-heading">Portfolio</h1>
        {isLoading ? <p className="text-muted-foreground">Loading…</p> : groups.length === 0 ? (
          <p className="text-muted-foreground">No projects yet.</p>
        ) : groups.map((g) => (
          <section key={g.id} className="mb-10">
            {g.name && <h2 className="mb-1 text-xs font-semibold uppercase tracking-wider text-heading">{g.name}</h2>}
            {g.description && <p className="mb-3 text-sm text-foreground/70">{g.description}</p>}
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              {g.items.map((p) => <ProjectCard key={p.id} p={p} />)}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
