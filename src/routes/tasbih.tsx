import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RotateCcw, CircleDot } from "lucide-react";

export const Route = createFileRoute("/tasbih")({
  head: () => ({ meta: [{ title: "السبحة الإلكترونية - فيض" }, { name: "description", content: "سبحة إلكترونية لعدّ الأذكار." }] }),
  component: TasbihPage,
});

const PHRASES = [
  "سبحان الله",
  "الحمد لله",
  "الله أكبر",
  "لا إله إلا الله",
  "أستغفر الله",
  "لا حول ولا قوة إلا بالله",
  "اللهم صل وسلم على نبينا محمد",
];

function TasbihPage() {
  const [phrase, setPhrase] = useState(PHRASES[0]);
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);

  useEffect(() => {
    const s = typeof localStorage !== "undefined" ? localStorage.getItem("tasbih") : null;
    if (s) {
      try {
        const p = JSON.parse(s);
        setCount(p.count ?? 0);
        setPhrase(p.phrase ?? PHRASES[0]);
        setTarget(p.target ?? 33);
      } catch { /* noop */ }
    }
  }, []);

  useEffect(() => {
    if (typeof localStorage !== "undefined")
      localStorage.setItem("tasbih", JSON.stringify({ count, phrase, target }));
  }, [count, phrase, target]);

  const tap = () => {
    if (navigator.vibrate) navigator.vibrate(20);
    setCount((c) => c + 1);
  };

  const rounds = Math.floor(count / target);
  const remainder = count % target;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
      <h1 className="text-2xl md:text-3xl font-extrabold text-center">السبحة الإلكترونية</h1>

      <div className="flex flex-wrap gap-2 justify-center">
        {PHRASES.map((p) => (
          <button
            key={p}
            onClick={() => setPhrase(p)}
            className={`text-sm px-3 py-1.5 rounded-full border transition ${phrase === p ? "bg-foreground text-background border-foreground" : "border-border hover:bg-muted"}`}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        onClick={tap}
        className="w-full aspect-square max-w-sm mx-auto rounded-full bg-foreground text-background flex flex-col items-center justify-center gap-3 active:scale-95 transition select-none"
      >
        <div className="text-2xl md:text-3xl font-bold px-4">{phrase}</div>
        <div className="text-6xl md:text-7xl font-extrabold tabular-nums">{remainder}</div>
        <div className="text-sm opacity-70">من {target}</div>
        <div className="text-xs opacity-60">دورات كاملة: {rounds}</div>
      </button>

      <div className="flex items-center justify-center gap-3">
        <label className="text-sm text-muted-foreground">الهدف:</label>
        {[33, 99, 100].map((t) => (
          <button
            key={t}
            onClick={() => setTarget(t)}
            className={`px-3 py-1 rounded-full text-sm border ${target === t ? "bg-foreground text-background border-foreground" : "border-border"}`}
          >
            {t}
          </button>
        ))}
        <button onClick={() => setCount(0)} className="ms-2 inline-flex items-center gap-1 text-sm rounded-full border border-border px-3 py-1 hover:bg-muted">
          <RotateCcw className="h-4 w-4" /> تصفير
        </button>
      </div>

      <div className="flex justify-center text-muted-foreground">
        <CircleDot className="h-5 w-5" />
      </div>
    </div>
  );
}