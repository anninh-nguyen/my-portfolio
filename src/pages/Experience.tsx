import { sanitizeHtml } from "@/lib/sanitize";
import { useWorkExperience } from "@/hooks/usePortfolioData";
import { Briefcase } from "lucide-react";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import SiteHeader from "@/components/SiteHeader";

export default function Experience() {
  const { data: experiences = [], isLoading } = useWorkExperience();
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="mb-2 text-2xl font-bold text-heading">Experience</h1>
        {!isLoading && experiences.length === 0 && <p className="text-muted-foreground">No experience yet.</p>}
        {/* Work Experience */}
        {experiences.length > 0 && (
          <>
            <Separator className="my-6" />
            <section className="mb-8">
              <h2 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-heading">
                <Briefcase className="h-3.5 w-3.5" /> Experience
              </h2>
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="border-l-2 border-border pl-4">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-sm font-semibold text-heading">{exp.job_title}</h3>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {exp.start_date ? format(new Date(exp.start_date), "MMM yyyy") : ""}
                        {" — "}
                        {exp.is_current ? "Present" : exp.end_date ? format(new Date(exp.end_date), "MMM yyyy") : ""}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{exp.company}</p>
                    {exp.description && <div className="mt-1 prose prose-sm max-w-none text-sm text-foreground/80 [&_*]:text-sm" dangerouslySetInnerHTML={{ __html: sanitizeHtml(exp.description) }} />}
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
