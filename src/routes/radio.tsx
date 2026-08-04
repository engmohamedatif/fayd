import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Radio as RadioIcon, RotateCcw, PauseCircle } from "lucide-react";
import { AudioPlayer } from "@/components/AudioPlayer";

export const Route = createFileRoute("/radio")({
  head: () => ({
    meta: [
      { title: "إذاعة القرآن الكريم مباشر - فيض" },
      { name: "description", content: "استمع لإذاعة القرآن الكريم مباشر من القاهرة." },
      { property: "og:title", content: "إذاعة القرآن الكريم مباشر - فيض" },
      { property: "og:description", content: "استمع لإذاعة القرآن الكريم مباشر من القاهرة." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RadioPage,
});

const STREAM = "https://n11.radiojar.com/8s5u5tpdtwzuv";

function RadioPage() {
  const [mode, setMode] = useState<"live" | "resume">("live");
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <div className="h-32 w-32 rounded-full bg-foreground text-background flex items-center justify-center">
              <RadioIcon className="h-14 w-14" />
            </div>
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-extrabold">إذاعة القرآن الكريم</h1>
          <p className="text-sm text-muted-foreground mt-1">بث مباشر من القاهرة</p>
        </div>
        <div className="grid grid-cols-2 overflow-hidden rounded-lg border border-border bg-card" role="tablist" aria-label="طريقة الاستماع">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "live"}
            onClick={() => setMode("live")}
            className={`flex min-h-12 items-center justify-center gap-2 border-l border-border px-3 py-2 text-sm font-bold transition-colors ${mode === "live" ? "bg-foreground text-background" : "hover:bg-muted"}`}
          >
            <RotateCcw className="h-4 w-4" /> البث اللحظي
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "resume"}
            onClick={() => setMode("resume")}
            className={`flex min-h-12 items-center justify-center gap-2 px-3 py-2 text-sm font-bold transition-colors ${mode === "resume" ? "bg-foreground text-background" : "hover:bg-muted"}`}
          >
            <PauseCircle className="h-4 w-4" /> استكمال التوقف
          </button>
        </div>
        <AudioPlayer
          key={mode}
          src={`${STREAM}?mode=${mode}`}
          live
          refreshOnPlay={mode === "live"}
          title="إذاعة القرآن الكريم"
          subtitle={mode === "live" ? "البث الحالي من القاهرة" : "يكمل من اللحظة التي توقفت عندها"}
        />
      </div>
    </div>
  );
}