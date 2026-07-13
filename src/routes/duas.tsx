import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/duas")({
  head: () => ({ meta: [{ title: "الأدعية - فيض" }, { name: "description", content: "مجموعة كبيرة من الأدعية المأثورة من حصن المسلم." }] }),
  component: DuasPage,
});

type CatItem = { ID: number; TITLE: string; TEXT: string };
type Dua = { ID: number; ARABIC_TEXT: string; REPEAT: number | string };

const excludeKeywords = ["ذكر", "أذكار", "الصباح", "المساء", "النوم", "الاستيقاظ", "التسبيح", "الاستغفار"];

function DuasPage() {
  const [cats, setCats] = useState<CatItem[] | null>(null);
  const [selected, setSelected] = useState<CatItem | null>(null);
  const [items, setItems] = useState<Dua[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    fetch("https://www.hisnmuslim.com/api/ar/husn_ar.json")
      .then((r) => r.json())
      .then((j) => setCats(j["العربية"] ?? []))
      .catch(() => setErr("تعذر تحميل الأدعية. حاول لاحقاً."));
  }, []);

  const filtered = useMemo(() => {
    if (!cats) return null;
    return cats.filter((c) => !excludeKeywords.some((k) => c.TITLE.includes(k)) && c.TITLE.includes("دعاء") || (cats && !excludeKeywords.some((k) => c.TITLE.includes(k)) && !c.TITLE.includes("دعاء") ? false : false));
  }, [cats]);

  // simpler: show all categories that aren't dhikr-focused
  const list = useMemo(() => {
    if (!cats) return null;
    const base = cats.filter((c) => !excludeKeywords.some((k) => c.TITLE.includes(k)));
    if (!q.trim()) return base;
    return base.filter((c) => c.TITLE.includes(q.trim()));
  }, [cats, q]);

  useEffect(() => {
    if (!selected) return;
    setItems(null);
    const url = selected.TEXT.replace("http://", "https://");
    fetch(url).then((r) => r.json()).then((j) => setItems((Object.values(j)[0] as Dua[]) ?? [])).catch(() => setErr("تعذر تحميل الدعاء."));
  }, [selected]);

  if (err) return <div className="mx-auto max-w-3xl px-4 py-10 text-center text-muted-foreground">{err}</div>;
  if (!list) return <div className="mx-auto max-w-3xl px-4 py-10 text-center">جاري التحميل...</div>;

  void filtered;

  if (selected) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 space-y-5">
        <button onClick={() => { setSelected(null); setItems(null); }} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4 rotate-180" /> رجوع
        </button>
        <h1 className="text-2xl md:text-3xl font-extrabold text-center">{selected.TITLE}</h1>
        {!items && <div className="text-center py-6">جاري التحميل...</div>}
        <div className="space-y-3">
          {items?.map((d) => (
            <div key={d.ID} className="rounded-2xl border border-border p-5">
              <p className="leading-loose text-lg font-arabic-quran">{d.ARABIC_TEXT}</p>
              {Number(d.REPEAT) > 1 && <div className="text-xs text-muted-foreground mt-2">التكرار: {d.REPEAT}</div>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      <h1 className="text-2xl md:text-3xl font-extrabold text-center">الأدعية</h1>
      <p className="text-center text-sm text-muted-foreground">من حصن المسلم — {list.length} دعاء</p>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث..." className="w-full rounded-full border border-border bg-card px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {list.map((c) => (
          <button key={c.ID} onClick={() => setSelected(c)} className="text-right rounded-2xl border border-border p-4 md:hover:bg-foreground md:hover:text-background transition">
            <div className="font-arabic-quran font-bold text-lg">{c.TITLE}</div>
          </button>
        ))}
      </div>
    </div>
  );
}