import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plus, Minus, RotateCcw, ChevronLeft, Search } from "lucide-react";
import { AudioPlayer } from "@/components/AudioPlayer";

export const Route = createFileRoute("/adhkar")({
  head: () => ({ meta: [{ title: "الأذكار - فيض" }, { name: "description", content: "أذكار الصباح والمساء وأذكار متنوعة من حصن المسلم." }] }),
  component: AdhkarPage,
});

type CatItem = { ID: number; TITLE: string; TEXT: string; AUDIO_URL?: string };
type Zekr = { ID: number; ARABIC_TEXT: string; REPEAT: number | string };

function AdhkarPage() {
  const [cats, setCats] = useState<CatItem[] | null>(null);
  const [selected, setSelected] = useState<CatItem | null>(null);
  const [items, setItems] = useState<Zekr[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    fetch("https://www.hisnmuslim.com/api/ar/husn_ar.json")
      .then((r) => r.json())
      .then((j) => setCats(j["العربية"] ?? []))
      .catch(() => setErr("تعذر تحميل الأذكار. حاول لاحقاً."));
  }, []);

  const filtered = useMemo(() => {
    if (!cats) return null;
    const term = q.trim();
    return term ? cats.filter((c) => c.TITLE.includes(term)) : cats;
  }, [cats, q]);

  useEffect(() => {
    if (!selected) return;
    setItems(null);
    const url = selected.TEXT.replace("http://", "https://");
    fetch(url)
      .then((r) => r.json())
      .then((j) => setItems((Object.values(j)[0] as Zekr[]) ?? []))
      .catch(() => setErr("تعذر تحميل الذكر."));
  }, [selected]);

  if (err) return <div className="mx-auto max-w-3xl px-4 py-10 text-center text-muted-foreground">{err}</div>;
  if (!filtered) return <div className="mx-auto max-w-3xl px-4 py-10 text-center">جاري التحميل...</div>;

  if (selected) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 space-y-5">
        <button onClick={() => { setSelected(null); setItems(null); }} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4 rotate-180" /> رجوع
        </button>
        <h1 className="text-2xl md:text-3xl font-extrabold text-center">{selected.TITLE}</h1>
        {selected.AUDIO_URL && (
          <AudioPlayer src={selected.AUDIO_URL.replace("http://", "https://")} title={selected.TITLE} subtitle="استماع — حصن المسلم" />
        )}
        {!items && <div className="text-center py-6">جاري التحميل...</div>}
        <div className="space-y-3">
          {items?.map((z) => <ZekrCard key={z.ID} z={z} />)}
        </div>
        <div className="text-xs text-muted-foreground text-center pt-3 border-t border-border">
          المرجع: كتاب حصن المسلم — سعيد بن علي بن وهف القحطاني (hisnmuslim.com).
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      <h1 className="text-2xl md:text-3xl font-extrabold text-center">الأذكار</h1>
      <p className="text-center text-sm text-muted-foreground">حصن المسلم كاملاً — {filtered.length} قسم، مع إمكانية الاستماع.</p>
      <div className="relative max-w-md mx-auto">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ابحث في الأقسام..."
          className="w-full rounded-full border border-border bg-card py-2.5 pr-10 pl-4 text-sm outline-none focus:border-foreground"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {filtered.map((c) => (
          <button key={c.ID} onClick={() => setSelected(c)} className="text-right rounded-2xl border border-border p-4 md:hover:bg-foreground md:hover:text-background transition">
            <div className="font-arabic-quran font-bold text-lg">{c.TITLE}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ZekrCard({ z }: { z: Zekr }) {
  const target = Math.max(1, Number(z.REPEAT) || 1);
  const [n, setN] = useState(0);
  const done = n >= target;
  return (
    <div className={`rounded-2xl border border-border p-5 ${done ? "opacity-60" : ""}`}>
      <p className="leading-loose text-lg font-arabic-quran">{z.ARABIC_TEXT}</p>
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="text-sm text-muted-foreground">التكرار: {target}</div>
        <div className="flex items-center gap-2">
          <button onClick={() => setN(0)} className="p-2 rounded-full border border-border md:hover:bg-muted" aria-label="تصفير"><RotateCcw className="h-4 w-4" /></button>
          <button onClick={() => setN((x) => Math.max(0, x - 1))} className="p-2 rounded-full border border-border md:hover:bg-muted"><Minus className="h-4 w-4" /></button>
          <div className="min-w-14 text-center font-bold text-lg tabular-nums">{n}/{target}</div>
          <button onClick={() => setN((x) => Math.min(target, x + 1))} className="p-2 rounded-full bg-foreground text-background md:hover:opacity-90"><Plus className="h-4 w-4" /></button>
        </div>
      </div>
    </div>
  );
}