import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Play, Pause, Radio as RadioIcon, Volume2 } from "lucide-react";

export const Route = createFileRoute("/radio")({
  head: () => ({
    meta: [
      { title: "إذاعة القرآن الكريم مباشر - فيض" },
      { name: "description", content: "استمع لإذاعة القرآن الكريم مباشر من القاهرة." },
    ],
  }),
  component: RadioPage,
});

const STREAM = "https://n11.radiojar.com/8s5u5tpdtwzuv";

function RadioPage() {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [vol, setVol] = useState(0.9);

  const toggle = async () => {
    const a = ref.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      setLoading(true);
      try {
        a.src = STREAM + "?t=" + Date.now();
        await a.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="rounded-3xl border border-border bg-card p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <div className={`h-32 w-32 rounded-full bg-foreground text-background flex items-center justify-center ${playing ? "animate-pulse" : ""}`}>
              <RadioIcon className="h-14 w-14" />
            </div>
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-extrabold">إذاعة القرآن الكريم</h1>
          <p className="text-sm text-muted-foreground mt-1">بث مباشر من القاهرة</p>
        </div>
        <button
          onClick={toggle}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-8 py-3 font-bold hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "جاري التشغيل..." : playing ? <><Pause className="h-5 w-5" /> إيقاف</> : <><Play className="h-5 w-5" /> استماع مباشر</>}
        </button>
        <div className="flex items-center gap-3 max-w-xs mx-auto">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={vol}
            onChange={(e) => {
              const v = Number(e.target.value);
              setVol(v);
              if (ref.current) ref.current.volume = v;
            }}
            className="w-full accent-black"
          />
        </div>
        <audio ref={ref} preload="none" />
      </div>
    </div>
  );
}