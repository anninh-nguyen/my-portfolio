import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEducation } from "@/hooks/usePortfolioData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";

interface Props { userId: string; }

interface EntryForm {
  degree: string; institution: string; field: string; graduation_year: string;
  is_certificate: boolean; issuer: string; issue_date: string;
}

const empty: EntryForm = { degree: "", institution: "", field: "", graduation_year: "", is_certificate: false, issuer: "", issue_date: "" };

export default function EducationForm({ userId }: Props) {
  const { data: items = [] } = useEducation();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [form, setForm] = useState<EntryForm>(empty);
  const [editId, setEditId] = useState<string | null>(null);

  const set = (key: keyof EntryForm, val: any) => setForm((p) => ({ ...p, [key]: val }));

  const save = async () => {
    const payload = {
      user_id: userId,
      degree: form.degree,
      institution: form.institution,
      field: form.field,
      graduation_year: form.graduation_year ? parseInt(form.graduation_year) : null,
      is_certificate: form.is_certificate,
      issuer: form.issuer,
      issue_date: form.issue_date || null,
      sort_order: editId ? undefined : items.length,
    };
    if (editId) {
      const { user_id, sort_order, ...updatePayload } = payload as any;
      const { error } = await supabase.from("education").update(updatePayload).eq("id", editId);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    } else {
      const { error } = await supabase.from("education").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    }
    qc.invalidateQueries({ queryKey: ["education"] });
    setForm(empty); setEditId(null);
    toast({ title: "Saved!" });
  };

  const remove = async (id: string) => {
    await supabase.from("education").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["education"] });
  };

  const startEdit = (item: typeof items[0]) => {
    setEditId(item.id);
    setForm({
      degree: item.degree, institution: item.institution, field: item.field,
      graduation_year: item.graduation_year?.toString() ?? "", is_certificate: item.is_certificate,
      issuer: item.issuer, issue_date: item.issue_date ?? "",
    });
  };

  return (
    <section>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Education & Certificates</h2>
      {items.length > 0 && (
        <div className="mb-4 space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded border border-border p-2 text-sm">
              <button type="button" className="text-left" onClick={() => startEdit(item)}>
                <span className="font-medium text-foreground">{item.degree}</span>
                <span className="ml-2 text-muted-foreground">{item.is_certificate ? item.issuer : item.institution}</span>
              </button>
              <Button variant="ghost" size="icon" onClick={() => remove(item.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          ))}
        </div>
      )}
      <div className="space-y-3 rounded border border-border p-3">
        <p className="text-xs font-medium text-muted-foreground">{editId ? "Edit entry" : "Add new"}</p>
        <div className="flex items-center gap-2">
          <Checkbox id="is_cert" checked={form.is_certificate} onCheckedChange={(v) => set("is_certificate", !!v)} />
          <Label htmlFor="is_cert" className="text-xs">This is a certificate</Label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1"><Label className="text-xs">{form.is_certificate ? "Certificate Name" : "Degree"}</Label><Input value={form.degree} onChange={(e) => set("degree", e.target.value)} /></div>
          <div className="space-y-1"><Label className="text-xs">{form.is_certificate ? "Issuer" : "Institution"}</Label><Input value={form.is_certificate ? form.issuer : form.institution} onChange={(e) => set(form.is_certificate ? "issuer" : "institution", e.target.value)} /></div>
        </div>
        {!form.is_certificate && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1"><Label className="text-xs">Field of Study</Label><Input value={form.field} onChange={(e) => set("field", e.target.value)} /></div>
            <div className="space-y-1"><Label className="text-xs">Graduation Year</Label><Input value={form.graduation_year} onChange={(e) => set("graduation_year", e.target.value)} placeholder="2020" /></div>
          </div>
        )}
        {form.is_certificate && (
          <div className="space-y-1"><Label className="text-xs">Issue Date</Label><Input type="date" value={form.issue_date} onChange={(e) => set("issue_date", e.target.value)} /></div>
        )}
        <div className="flex gap-2">
          <Button size="sm" type="button" onClick={save}><Plus className="mr-1 h-3.5 w-3.5" />{editId ? "Update" : "Add"}</Button>
          {editId && <Button size="sm" variant="outline" type="button" onClick={() => { setForm(empty); setEditId(null); }}>Cancel</Button>}
        </div>
      </div>
    </section>
  );
}
