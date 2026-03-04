import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useWorkExperience } from "@/hooks/usePortfolioData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";

interface Props { userId: string; }

interface EntryForm {
  job_title: string; company: string; start_date: string; end_date: string;
  is_current: boolean; description: string;
}

const empty: EntryForm = { job_title: "", company: "", start_date: "", end_date: "", is_current: false, description: "" };

export default function WorkExperienceForm({ userId }: Props) {
  const { data: items = [] } = useWorkExperience();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [form, setForm] = useState<EntryForm>(empty);
  const [editId, setEditId] = useState<string | null>(null);

  const set = (key: keyof EntryForm, val: any) => setForm((p) => ({ ...p, [key]: val }));

  const save = async () => {
    const payload = {
      ...form,
      user_id: userId,
      start_date: form.start_date || null,
      end_date: form.is_current ? null : form.end_date || null,
      sort_order: editId ? undefined : items.length,
    };
    if (editId) {
      const { user_id, sort_order, ...updatePayload } = payload as any;
      const { error } = await supabase.from("work_experience").update(updatePayload).eq("id", editId);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    } else {
      const { error } = await supabase.from("work_experience").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    }
    qc.invalidateQueries({ queryKey: ["work_experience"] });
    setForm(empty); setEditId(null);
    toast({ title: "Saved!" });
  };

  const remove = async (id: string) => {
    await supabase.from("work_experience").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["work_experience"] });
  };

  const startEdit = (item: typeof items[0]) => {
    setEditId(item.id);
    setForm({
      job_title: item.job_title, company: item.company,
      start_date: item.start_date ?? "", end_date: item.end_date ?? "",
      is_current: item.is_current, description: item.description,
    });
  };

  return (
    <section>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Work Experience</h2>
      {items.length > 0 && (
        <div className="mb-4 space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded border border-border p-2 text-sm">
              <button type="button" className="text-left" onClick={() => startEdit(item)}>
                <span className="font-medium text-foreground">{item.job_title}</span>
                <span className="ml-2 text-muted-foreground">{item.company}</span>
              </button>
              <Button variant="ghost" size="icon" onClick={() => remove(item.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          ))}
        </div>
      )}
      <div className="space-y-3 rounded border border-border p-3">
        <p className="text-xs font-medium text-muted-foreground">{editId ? "Edit entry" : "Add new"}</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1"><Label className="text-xs">Job Title</Label><Input value={form.job_title} onChange={(e) => set("job_title", e.target.value)} /></div>
          <div className="space-y-1"><Label className="text-xs">Company</Label><Input value={form.company} onChange={(e) => set("company", e.target.value)} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1"><Label className="text-xs">Start Date</Label><Input type="date" value={form.start_date} onChange={(e) => set("start_date", e.target.value)} /></div>
          <div className="space-y-1"><Label className="text-xs">End Date</Label><Input type="date" value={form.end_date} onChange={(e) => set("end_date", e.target.value)} disabled={form.is_current} /></div>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="is_current" checked={form.is_current} onCheckedChange={(v) => set("is_current", !!v)} />
          <Label htmlFor="is_current" className="text-xs">Currently working here</Label>
        </div>
        <div className="space-y-1"><Label className="text-xs">Description</Label><RichTextEditor value={form.description} onChange={(v) => set("description", v)} /></div>
        <div className="flex gap-2">
          <Button size="sm" type="button" onClick={save}><Plus className="mr-1 h-3.5 w-3.5" />{editId ? "Update" : "Add"}</Button>
          {editId && <Button size="sm" variant="outline" type="button" onClick={() => { setForm(empty); setEditId(null); }}>Cancel</Button>}
        </div>
      </div>
    </section>
  );
}
