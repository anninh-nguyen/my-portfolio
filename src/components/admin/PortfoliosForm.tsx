import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { usePortfolios } from "@/hooks/usePortfolioData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Pencil, ArrowUp, ArrowDown } from "lucide-react";

export default function PortfoliosForm({ userId }: { userId: string }) {
  const { data: items = [] } = usePortfolios();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const refresh = () => qc.invalidateQueries({ queryKey: ["portfolios"] });
  const reset = () => { setName(""); setDescription(""); setEditId(null); };

  const save = async () => {
    if (!name.trim()) return;
    const { error } = editId
      ? await supabase.from("portfolios").update({ name, description }).eq("id", editId)
      : await supabase.from("portfolios").insert({ name, description, user_id: userId, sort_order: items.length });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    refresh(); reset(); toast({ title: "Saved!" });
  };
  const remove = async (id: string) => { await supabase.from("portfolios").delete().eq("id", id); refresh(); qc.invalidateQueries({ queryKey: ["projects"] }); };
  const move = async (i: number, d: number) => {
    const j = i + d; if (j < 0 || j >= items.length) return;
    await Promise.all([
      supabase.from("portfolios").update({ sort_order: j }).eq("id", items[i].id),
      supabase.from("portfolios").update({ sort_order: i }).eq("id", items[j].id),
    ]);
    refresh();
  };

  return (
    <section>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Portfolios</h2>
      <div className="mb-4 space-y-2">
        {items.map((g, i) => (
          <div key={g.id} className="flex items-center gap-2 rounded border border-border px-3 py-2 text-sm">
            <span className="flex-1 font-medium">{g.name}</span>
            <button onClick={() => move(i, -1)} className="text-muted-foreground"><ArrowUp className="h-3.5 w-3.5" /></button>
            <button onClick={() => move(i, 1)} className="text-muted-foreground"><ArrowDown className="h-3.5 w-3.5" /></button>
            <button onClick={() => { setEditId(g.id); setName(g.name); setDescription(g.description); }} className="text-muted-foreground"><Pencil className="h-3.5 w-3.5" /></button>
            <button onClick={() => remove(g.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
        ))}
      </div>
      <div className="space-y-2 rounded border border-border p-3">
        <div className="space-y-1"><Label className="text-xs">Portfolio Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Manufacturing" /></div>
        <div className="space-y-1"><Label className="text-xs">Short Intro</Label><Input value={description} onChange={(e) => setDescription(e.target.value)} /></div>
        <div className="flex gap-2">
          <Button size="sm" type="button" onClick={save}><Plus className="mr-1 h-3.5 w-3.5" />{editId ? "Update" : "Add"}</Button>
          {editId && <Button size="sm" variant="outline" type="button" onClick={reset}>Cancel</Button>}
        </div>
      </div>
    </section>
  );
}
