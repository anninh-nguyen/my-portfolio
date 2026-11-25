import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { usePortfolios, useProjects } from "@/hooks/usePortfolioData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { ImageUpload } from "@/components/ImageUpload";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Pencil } from "lucide-react";

const empty = { title: "", image_url: "", role: "", client_location: "", description: "", technologies: "", achievements: "", portfolio_id: "", completed_date: "" };

export default function ProjectsForm({ userId }: { userId: string }) {
  const { data: items = [] } = useProjects();
  const { data: portfolios = [] } = usePortfolios();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [f, setF] = useState(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [key, setKey] = useState(0);
  const set = (k: keyof typeof empty) => (v: string) => setF((s) => ({ ...s, [k]: v }));
  const reset = () => { setF(empty); setEditId(null); setKey((k) => k + 1); };

  const save = async () => {
    if (!f.title.trim()) return;
    const payload = { ...f, portfolio_id: f.portfolio_id || null, completed_date: f.completed_date || null };
    const { error } = editId
      ? await supabase.from("projects").update(payload).eq("id", editId)
      : await supabase.from("projects").insert({ ...payload, user_id: userId, sort_order: items.length });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    qc.invalidateQueries({ queryKey: ["projects"] }); reset(); toast({ title: "Saved!" });
  };
  const remove = async (id: string) => { await supabase.from("projects").delete().eq("id", id); qc.invalidateQueries({ queryKey: ["projects"] }); };
  const edit = (p: typeof items[0]) => {
    setEditId(p.id); setKey((k) => k + 1);
    setF({ title: p.title, image_url: p.image_url, role: p.role, client_location: p.client_location, description: p.description, technologies: p.technologies, achievements: p.achievements, portfolio_id: p.portfolio_id ?? "", completed_date: p.completed_date ?? "" });
  };

  return (
    <section>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Projects</h2>
      <div className="mb-4 space-y-2">
        {items.map((p) => (
          <div key={p.id} className="flex items-center gap-2 rounded border border-border px-3 py-2 text-sm">
            {p.image_url && <img src={p.image_url} alt="" className="h-8 w-8 rounded object-cover" />}
            <span className="flex-1 font-medium">{p.title}</span>
            <span className="text-xs text-muted-foreground">{portfolios.find((g) => g.id === p.portfolio_id)?.name}</span>
            <button onClick={() => edit(p)} className="text-muted-foreground"><Pencil className="h-3.5 w-3.5" /></button>
            <button onClick={() => remove(p.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
        ))}
      </div>
      <div className="space-y-3 rounded border border-border p-3">
        <div className="space-y-1"><Label className="text-xs">Title</Label><Input value={f.title} onChange={(e) => set("title")(e.target.value)} /></div>
        <div className="space-y-1"><Label className="text-xs">Image</Label><ImageUpload userId={userId} folder="projects" value={f.image_url} onChange={set("image_url")} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Portfolio</Label>
            <select value={f.portfolio_id} onChange={(e) => set("portfolio_id")(e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
              <option value="">— None —</option>
              {portfolios.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>
          <div className="space-y-1"><Label className="text-xs">Completed</Label><Input type="date" value={f.completed_date} onChange={(e) => set("completed_date")(e.target.value)} /></div>
          <div className="space-y-1"><Label className="text-xs">My Role</Label><Input value={f.role} onChange={(e) => set("role")(e.target.value)} /></div>
          <div className="space-y-1"><Label className="text-xs">Client's Location</Label><Input value={f.client_location} onChange={(e) => set("client_location")(e.target.value)} /></div>
        </div>
        <div className="space-y-1"><Label className="text-xs">Description</Label><RichTextEditor key={`d${key}`} value={f.description} onChange={set("description")} /></div>
        <div className="space-y-1"><Label className="text-xs">Technologies</Label><Input value={f.technologies} onChange={(e) => set("technologies")(e.target.value)} placeholder="Flutter/Dart, Swift, .Net" /></div>
        <div className="space-y-1"><Label className="text-xs">Achievements</Label><RichTextEditor key={`a${key}`} value={f.achievements} onChange={set("achievements")} /></div>
        <div className="flex gap-2">
          <Button size="sm" type="button" onClick={save}><Plus className="mr-1 h-3.5 w-3.5" />{editId ? "Update" : "Add"}</Button>
          {editId && <Button size="sm" variant="outline" type="button" onClick={reset}>Cancel</Button>}
        </div>
      </div>
    </section>
  );
}
