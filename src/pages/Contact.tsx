import { useProfile } from "@/hooks/usePortfolioData";
import { Mail, Phone, MapPin, Linkedin, Github, Globe, Share2, MessageSquare } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import { Separator } from "@/components/ui/separator";
import SiteHeader from "@/components/SiteHeader";

export default function Contact() {
  const { data } = useProfile();
  const profile = data ?? ({} as NonNullable<typeof data>);
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="mb-2 text-2xl font-bold text-heading">Contact</h1>
        {/* Contact */}
        {(profile.email || profile.phone || profile.location || profile.website_url) && (
          <>
            <Separator className="my-6" />
            <section className="mb-8">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-heading">Contact</h2>
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
                {profile.website_url && (
                  <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary">
                    <Globe className="h-3.5 w-3.5" /> Website
                  </a>
                )}
              </div>
            </section>
          </>
        )}

        {/* Social */}
        {(profile.linkedin_url || profile.github_url) && (
          <>
            <Separator className="my-6" />
            <section className="mb-8">
              <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-heading">
                <Share2 className="h-3.5 w-3.5" /> Social
              </h2>
              <div className="flex flex-wrap gap-4 text-sm text-foreground/80">
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
              </div>
            </section>
          </>
        )}
        {/* Contact Form */}
        <Separator className="my-6" />
        <section className="mb-8">
          <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-heading">
            <MessageSquare className="h-3.5 w-3.5" /> Get in touch
          </h2>
          <ContactForm />
        </section>
      </div>
    </div>
  );
}
