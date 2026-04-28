import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Mail } from "lucide-react";
import { format } from "date-fns";

export default function MessagesList() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["contact_messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    qc.invalidateQueries({ queryKey: ["contact_messages"] });
    toast({ title: "Message deleted" });
  };

  return (
    <section>
      <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        <Mail className="h-3.5 w-3.5" /> Messages ({messages.length})
      </h2>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : messages.length === 0 ? (
        <p className="text-sm text-muted-foreground">No messages yet.</p>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m.id} className="rounded-md border border-border p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{m.name}</p>
                  <a href={`mailto:${m.email}`} className="text-xs text-muted-foreground hover:text-primary">{m.email}</a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{format(new Date(m.created_at), "MMM d, yyyy")}</span>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDelete(m.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm text-foreground/80">{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
