import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/usePortfolioData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Props { userId: string; }

interface FormData {
  full_name: string; title: string; bio: string;
  email: string; phone: string; location: string;
  linkedin_url: string; github_url: string; website_url: string;
}

export default function ProfileForm({ userId }: Props) {
  const { data: profile } = useProfile();
  const { toast } = useToast();
  const qc = useQueryClient();
  const form = useForm<FormData>({ defaultValues: { full_name: "", title: "", bio: "", email: "", phone: "", location: "", linkedin_url: "", github_url: "", website_url: "" } });

  useEffect(() => {
    if (profile) form.reset({
      full_name: profile.full_name, title: profile.title, bio: profile.bio,
      email: profile.email, phone: profile.phone, location: profile.location,
      linkedin_url: profile.linkedin_url, github_url: profile.github_url, website_url: profile.website_url,
    });
  }, [profile, form]);

  const onSubmit = async (data: FormData) => {
    if (profile) {
      const { error } = await supabase.from("profile").update(data).eq("id", profile.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    } else {
      const { error } = await supabase.from("profile").insert({ ...data, user_id: userId });
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    }
    qc.invalidateQueries({ queryKey: ["profile"] });
    toast({ title: "Saved!" });
  };

  return (
    <section>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Profile & Contact</h2>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <Field label="Full Name"><Input {...form.register("full_name")} /></Field>
        <Field label="Title / Tagline"><Input {...form.register("title")} /></Field>
        <Field label="Bio"><Textarea rows={3} {...form.register("bio")} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Email"><Input {...form.register("email")} /></Field>
          <Field label="Phone"><Input {...form.register("phone")} /></Field>
        </div>
        <Field label="Location"><Input {...form.register("location")} /></Field>
        <div className="grid grid-cols-3 gap-3">
          <Field label="LinkedIn URL"><Input {...form.register("linkedin_url")} /></Field>
          <Field label="GitHub URL"><Input {...form.register("github_url")} /></Field>
          <Field label="Website URL"><Input {...form.register("website_url")} /></Field>
        </div>
        <Button type="submit" size="sm">Save Profile</Button>
      </form>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}
