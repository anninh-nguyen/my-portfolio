import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  message: z.string().trim().min(1, "Message is required").max(1000),
});

export default function ContactForm() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast({ title: "Invalid input", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("contact_messages").insert([parsed.data]);
    setSubmitting(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    setForm({ name: "", email: "", message: "" });
    toast({ title: "Message sent!", description: "Thanks for reaching out." });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="cf-name" className="text-xs">Name</Label>
          <Input id="cf-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={100} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="cf-email" className="text-xs">Email</Label>
          <Input id="cf-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} maxLength={255} />
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="cf-message" className="text-xs">Message</Label>
        <Textarea id="cf-message" rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} maxLength={1000} />
      </div>
      <Button type="submit" size="sm" disabled={submitting}>
        <Send className="mr-1.5 h-3.5 w-3.5" /> {submitting ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
