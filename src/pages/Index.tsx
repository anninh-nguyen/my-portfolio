import { useProfile, useEducation, useHobbies } from "@/hooks/usePortfolioData";
import { GraduationCap, Award, Heart } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import SiteHeader from "@/components/SiteHeader";

const Index = () => {
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: educationList = [] } = useEducation();
  const { data: hobbies = [] } = useHobbies();

  const degrees = educationList.filter((e) => !e.is_certificate);
  const certificates = educationList.filter((e) => e.is_certificate);

  if (profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold text-heading">No portfolio yet</h1>
          <p className="text-muted-foreground">
            Log in at <a href="/login" className="text-primary underline">/login</a> to set up your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-4 py-10">
        {/* Hero / Bio */}
        <section className="mb-8">
          <div>
            <div className="min-w-0">
              <h1 className="text-3xl font-bold text-heading">{profile.full_name || "Your Name"}</h1>
              {profile.title && <p className="mt-1 text-lg leading-tight text-muted-foreground">{profile.title}</p>}
            </div>
          </div>
          {profile.bio && <div className="mt-3 prose prose-sm max-w-none text-foreground/80" dangerouslySetInnerHTML={{ __html: profile.bio }} />}
        </section>

        {/* Education */}
        {degrees.length > 0 && (
          <>
            <Separator className="my-6" />
            <section className="mb-8">
              <h2 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-heading">
                <GraduationCap className="h-3.5 w-3.5" /> Education
              </h2>
              <div className="space-y-3">
                {degrees.map((edu) => (
                  <div key={edu.id} className="border-l-2 border-border pl-4">
                    <h3 className="text-sm font-semibold text-heading">{edu.degree}</h3>
                    <p className="text-sm text-muted-foreground">
                      {edu.institution}
                      {edu.field && ` · ${edu.field}`}
                      {edu.graduation_year && ` · ${edu.graduation_year}`}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* Certificates */}
        {certificates.length > 0 && (
          <>
            <Separator className="my-6" />
            <section className="mb-8">
              <h2 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-heading">
                <Award className="h-3.5 w-3.5" /> Certificates
              </h2>
              <div className="space-y-3">
                {certificates.map((cert) => (
                  <div key={cert.id} className="border-l-2 border-border pl-4">
                    <h3 className="text-sm font-semibold text-heading">{cert.degree}</h3>
                    <p className="text-sm text-muted-foreground">
                      {cert.issuer}
                      {cert.issue_date && ` · ${format(new Date(cert.issue_date), "MMM yyyy")}`}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* Hobbies */}
        {hobbies.length > 0 && (
          <>
            <Separator className="my-6" />
            <section className="mb-8">
              <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-heading">
                <Heart className="h-3.5 w-3.5" /> Hobbies
              </h2>
              <div className="flex flex-wrap gap-2">
                {hobbies.map((h) => (
                  <span key={h.id} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                    {h.icon && <span className="mr-1">{h.icon}</span>}
                    {h.name}
                  </span>
                ))}
              </div>
            </section>
          </>
        )}

      </div>
    </div>
  );
};

export default Index;
