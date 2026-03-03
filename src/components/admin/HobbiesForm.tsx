import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useHobbies } from "@/hooks/usePortfolioData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";

interface Props { userId: string; }

export default function HobbiesForm({ userId }: Props) {
  const { data: items = [] } = useHobbies();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  const save = async () => {
    if (!name.trim()) return;
    if (editId) {
      const { error } = await supabase.from("hobbies").update({ name, icon }).eq("id", editId);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    } else {
      const { error } = await supabase.from("hobbies").insert({ name, icon, user_id: userId, sort_order: items.length });
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    }
    qc.invalidateQueries({ queryKey: ["hobbies"] });
    setName(""); setIcon(""); setEditId(null);
    toast({ title: "Saved!" });
  };

  const remove = async (id: string) => {
    await supabase.from("hobbies").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["hobbies"] });
  };

  const startEdit = (item: typeof items[0]) => {
    setEditId(item.id); setName(item.name); setIcon(item.icon);
  };

  return (
    <section>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Hobbies</h2>
      {items.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs">
              <button type="button" onClick={() => startEdit(item)} className="text-foreground">
                {item.icon && <span className="mr-1">{item.icon}</span>}{item.name}
              </button>
              <button type="button" onClick={() => remove(item.id)} className="ml-1 text-muted-foreground hover:text-destructive">
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-end gap-3 rounded border border-border p-3">
        <div className="space-y-1">
          <Label className="text-xs">Emoji</Label>
          <Input className="w-16" value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="🎨" />
        </div>
        <div className="flex-1 space-y-1">
          <Label className="text-xs">Hobby Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Painting" />
        </div>
        <Button size="sm" type="button" onClick={save}><Plus className="mr-1 h-3.5 w-3.5" />{editId ? "Update" : "Add"}</Button>
        {editId && <Button size="sm" variant="outline" type="button" onClick={() => { setName(""); setIcon(""); setEditId(null); }}>Cancel</Button>}
      </div>
    </section>
  );
}
