import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Minus, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/adhkar")({
  head: () => ({ meta: [{ title: "الأذكار - فيض" }, { name: "description", content: "أذكار الصباح والمساء وأذكار متنوعة." }] }),
  component: AdhkarPage,
});

type Zekr = { category: string; zekr: string; count: string | number; description?: string; reference?: string };

const CATEGORIES_URL = "https://raw.githubusercontent.com/nawafalqari/azkar-api/master/azkar.json";

function AdhkarPage() {
  const [data, setData] = useState<Record<string, Zekr[]> | null>(null);
  const [cat, setCat] = useState<string>("");
  const [err, setErr] = useState(false);

  useEffect(() => {
    fetch(CATEGORIES_URL)
      .then((r) => r.json())
      .then((j) => {
        setData(j);
        const keys = Object.keys(j);
        if (keys.length) setCat(keys[0]);
      })
      .catch(() => setErr(true));
  }, []);

  if (err) return <div className="mx-auto max-w-3xl px-4 py-10 text-center text-muted-foreground">تعذر تحميل الأذكار.</div>;
  if (!data) return <div className="mx-auto max-w-3xl px-4 py-10 text-center">جاري التحميل...</div>;

  const categories = Object.keys(data);
  const items = data[cat] ?? [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      <h1 className="text-2xl md:text-3xl font-extrabold text-center">الأذكار</h1>
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`text-sm px-3 py-1.5 rounded-full border ${cat === c ? "bg-foreground text-background border-foreground" : "border-border hover:bg-muted"}`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {items.map((z, i) => (
          <ZekrCard key={i} z={z} />
        ))}
      </div>
    </div>
  );
}

function ZekrCard({ z }: { z: Zekr }) {
  const target = Math.max(1, Number(z.count) || 1);
  const [n, setN] = useState(0);
  const done = n >= target;
  return (
    <div className={`rounded-2xl border border-border p-5 ${done ? "opacity-60" : ""}`}>
      <p className="leading-loose text-lg font-arabic-quran">{z.zekr}</p>
      {z.description && <p className="text-xs text-muted-foreground mt-2">{z.description}</p>}
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="text-sm text-muted-foreground">التكرار: {target}</div>
        <div className="flex items-center gap-2">
          <button onClick={() => setN(0)} className="p-2 rounded-full border border-border hover:bg-muted" aria-label="تصفير">
            <RotateCcw className="h-4 w-4" />
          </button>
          <button onClick={() => setN((x) => Math.max(0, x - 1))} className="p-2 rounded-full border border-border hover:bg-muted">
            <Minus className="h-4 w-4" />
          </button>
          <div className="min-w-14 text-center font-bold text-lg tabular-nums">{n}/{target}</div>
          <button onClick={() => setN((x) => Math.min(target, x + 1))} className="p-2 rounded-full bg-foreground text-background hover:opacity-90">
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}