import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

interface Props { userId: string; folder: string; value: string; onChange: (url: string) => void; rounded?: boolean; }

// Bucket is private (workspace blocks public buckets), so we store a long-lived signed URL.
const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

export function ImageUpload({ userId, folder, value, onChange, rounded }: Props) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();

  const upload = async (file: File) => {
    setBusy(true);
    const ext = file.name.split(".").pop() || "png";
    const path = `${userId}/${folder}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("portfolio-media").upload(path, file, { contentType: file.type });
    if (error) { setBusy(false); toast({ title: "Upload failed", description: error.message, variant: "destructive" }); return; }
    const { data, error: e2 } = await supabase.storage.from("portfolio-media").createSignedUrl(path, TEN_YEARS);
    setBusy(false);
    if (e2 || !data) { toast({ title: "Upload failed", description: e2?.message, variant: "destructive" }); return; }
    onChange(data.signedUrl);
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`h-16 w-16 overflow-hidden border border-border bg-muted ${rounded ? "rounded-full" : "rounded"}`}>
        {value && <img src={value} alt="" className="h-full w-full object-cover" />}
      </div>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
      <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => ref.current?.click()}>
        <Upload className="mr-1 h-3.5 w-3.5" />{busy ? "Uploading…" : value ? "Replace" : "Upload"}
      </Button>
    </div>
  );
}
