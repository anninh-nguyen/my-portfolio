import { useProfile, useWorkExperience, useEducation, useHobbies } from "@/hooks/usePortfolioData";
import { Mail, Phone, MapPin, Linkedin, Github, Globe, Briefcase, GraduationCap, Award, Heart } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

const Index = () => {
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: experiences = [] } = useWorkExperience();
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
          <h1 className="mb-2 text-2xl font-bold text-foreground">No portfolio yet</h1>
          <p className="text-muted-foreground">
            Log in at <a href="/login" className="text-primary underline">/login</a> to set up your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-12">
        {/* Hero / Bio */}
        <section className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">{profile.full_name || "Your Name"}</h1>
          {profile.title && <p className="mt-1 text-lg text-muted-foreground">{profile.title}</p>}
          {profile.bio && <p className="mt-3 text-sm leading-relaxed text-foreground/80">{profile.bio}</p>}
        </section>

        {/* Contact */}
        {(profile.email || profile.phone || profile.location || profile.linkedin_url || profile.github_url || profile.website_url) && (
          <>
            <Separator className="my-6" />
            <section className="mb-8">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contact</h2>
              <div className="flex flex-wrap gap-4 text-sm text-foreground/80">
                {profile.email && (
                  <a href={`mailto:${profile.email}`} className="flex items-center gap-1.5 hover:text-primary">
                    <Mail className="h-3.5 w-3.5" /> {profile.email}
                  </a>
                )}
                {profile.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" /> {profile.phone}
                  </span>
                )}
                {profile.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" /> {profile.location}
                  </span>
                )}
                {profile.linkedin_url && (
                  <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary">
                    <Linkedin className="h-3.5 w-3.5" /> LinkedIn
                  </a>
                )}
                {profile.github_url && (
                  <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary">
                    <Github className="h-3.5 w-3.5" /> GitHub
                  </a>
                )}
                {profile.website_url && (
                  <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary">
                    <Globe className="h-3.5 w-3.5" /> Website
                  </a>
                )}
              </div>
            </section>
          </>
        )}

        {/* Work Experience */}
        {experiences.length > 0 && (
          <>
            <Separator className="my-6" />
            <section className="mb-8">
              <h2 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Briefcase className="h-3.5 w-3.5" /> Experience
              </h2>
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="border-l-2 border-border pl-4">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-sm font-semibold text-foreground">{exp.job_title}</h3>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {exp.start_date ? format(new Date(exp.start_date), "MMM yyyy") : ""}
                        {" — "}
                        {exp.is_current ? "Present" : exp.end_date ? format(new Date(exp.end_date), "MMM yyyy") : ""}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{exp.company}</p>
                    {exp.description && <p className="mt-1 text-xs leading-relaxed text-foreground/70">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* Education */}
        {degrees.length > 0 && (
          <>
            <Separator className="my-6" />
            <section className="mb-8">
              <h2 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <GraduationCap className="h-3.5 w-3.5" /> Education
              </h2>
              <div className="space-y-3">
                {degrees.map((edu) => (
                  <div key={edu.id} className="border-l-2 border-border pl-4">
                    <h3 className="text-sm font-semibold text-foreground">{edu.degree}</h3>
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
              <h2 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Award className="h-3.5 w-3.5" /> Certificates
              </h2>
              <div className="space-y-3">
                {certificates.map((cert) => (
                  <div key={cert.id} className="border-l-2 border-border pl-4">
                    <h3 className="text-sm font-semibold text-foreground">{cert.degree}</h3>
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
              <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
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
