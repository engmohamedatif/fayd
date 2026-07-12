import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/duas")({
  head: () => ({ meta: [{ title: "الأدعية - فيض" }, { name: "description", content: "مجموعة من الأدعية المأثورة." }] }),
  component: DuasPage,
});

type Dua = { title?: string; category?: string; arabic?: string; content?: string; zekr?: string; description?: string; reference?: string };

const URLS = [
  "https://raw.githubusercontent.com/nawafalqari/azkar-api/master/duaa.json",
  "https://raw.githubusercontent.com/nawafalqari/azkar-api/master/duas.json",
];

function DuasPage() {
  const [items, setItems] = useState<Dua[] | null>(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    (async () => {
      for (const u of URLS) {
        try {
          const r = await fetch(u);
          if (!r.ok) continue;
          const j = await r.json();
          const arr: Dua[] = Array.isArray(j) ? j : Array.isArray(j.duaa) ? j.duaa : Object.values(j).flat() as Dua[];
          setItems(arr);
          return;
        } catch { /* try next */ }
      }
      setErr(true);
    })();
  }, []);

  if (err) return <div className="mx-auto max-w-3xl px-4 py-10 text-center text-muted-foreground">تعذر تحميل الأدعية.</div>;
  if (!items) return <div className="mx-auto max-w-3xl px-4 py-10 text-center">جاري التحميل...</div>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      <h1 className="text-2xl md:text-3xl font-extrabold text-center">الأدعية</h1>
      <p className="text-center text-sm text-muted-foreground">{items.length} دعاء</p>
      <div className="space-y-3">
        {items.map((d, i) => {
          const text = d.arabic || d.content || d.zekr || "";
          const title = d.title || d.category || d.description;
          return (
            <div key={i} className="rounded-2xl border border-border p-5">
              {title && <div className="text-sm font-bold mb-2 text-muted-foreground">{title}</div>}
              <p className="leading-loose text-lg font-arabic-quran">{text}</p>
              {d.reference && <div className="text-xs text-muted-foreground mt-2">{d.reference}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}