import { useState } from "react";
import { Check, Download, Loader2 } from "lucide-react";
import { downloadFile } from "@/lib/media";
import { cn } from "@/lib/utils";

type Props = {
  url: string;
  filename: string;
  label?: string;
  className?: string;
  variant?: "solid" | "outline" | "icon";
};

export function DownloadButton({ url, filename, label = "تحميل", className, variant = "outline" }: Props) {
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const [pct, setPct] = useState(0);

  const run = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (state === "busy") return;
    setState("busy");
    setPct(0);
    await downloadFile(url, filename, setPct);
    setState("done");
    setTimeout(() => setState("idle"), 2200);
  };

  const base =
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden font-bold transition-all duration-300 active:scale-[0.97] disabled:opacity-60";
  const styles =
    variant === "solid"
      ? "rounded-full bg-foreground text-background px-5 py-2.5 text-sm shadow-sm md:hover:shadow-lg"
      : variant === "icon"
        ? "h-10 w-10 rounded-full border border-border bg-card md:hover:bg-foreground md:hover:text-background"
        : "rounded-full border border-border bg-card px-4 py-2 text-sm md:hover:bg-foreground md:hover:text-background";

  return (
    <button onClick={run} className={cn(base, styles, className)} aria-label={label} title={label}>
      {state === "busy" && pct > 0 && (
        <span
          className="absolute inset-y-0 right-0 bg-foreground/10 transition-all duration-200"
          style={{ width: `${pct}%` }}
        />
      )}
      <span className="relative flex items-center gap-2">
        {state === "busy" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : state === "done" ? (
          <Check className="h-4 w-4 animate-in zoom-in duration-200" />
        ) : (
          <Download className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
        )}
        {variant !== "icon" && (
          <span>{state === "busy" ? (pct ? `${pct}%` : "جارٍ التحميل") : state === "done" ? "تم الحفظ" : label}</span>
        )}
      </span>
    </button>
  );
}
