import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

export const Route = createFileRoute("/hadith")({
  head: () => ({ meta: [{ title: "الأحاديث النبوية - فيض" }, { name: "description", content: "أحاديث نبوية من الكتب الصحيحة." }] }),
  component: HadithPage,
});

const BOOKS = [
  { id: "bukhari", name: "صحيح البخاري", edition: "ara-bukhari" },
  { id: "muslim", name: "صحيح مسلم", edition: "ara-muslim" },
  { id: "abudawud", name: "سنن أبي داود", edition: "ara-abudawud" },
  { id: "tirmidhi", name: "جامع الترمذي", edition: "ara-tirmidhi" },
  { id: "nasai", name: "سنن النسائي", edition: "ara-nasai" },
  { id: "ibnmajah", name: "سنن ابن ماجه", edition: "ara-ibnmajah" },
];

type Hadith = { hadithnumber: number; text: string };

function HadithPage() {
  const [book, setBook] = useState(BOOKS[0]);
  const [items, setItems] = useState<Hadith[] | null>(null);
  const [start, setStart] = useState(1);
  const [total, setTotal] = useState(0);
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setItems(null);
    setErr(false);
    setLoading(true);
    fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/${book.edition}.json`)
      .then((r) => r.json())
      .then((j) => {
        const hs: Hadith[] = j.hadiths ?? [];
        setTotal(hs.length);
        setItems(hs);
        setStart(1);
      })
      .catch(() => setErr(true))
      .finally(() => setLoading(false));
  }, [book]);

  const pageSize = 10;
  const shown = items?.slice(start - 1, start - 1 + pageSize) ?? [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      <h1 className="text-2xl md:text-3xl font-extrabold text-center">الأحاديث النبوية</h1>
      <div className="flex flex-wrap gap-2 justify-center">
        {BOOKS.map((b) => (
          <button
            key={b.id}
            onClick={() => setBook(b)}
            className={`text-sm px-3 py-1.5 rounded-full border ${book.id === b.id ? "bg-foreground text-background border-foreground" : "border-border hover:bg-muted"}`}
          >
            {b.name}
          </button>
        ))}
      </div>

      {err && <div className="text-center text-muted-foreground">تعذر تحميل الأحاديث.</div>}
      {loading && <div className="text-center">جاري التحميل...</div>}

      {items && !loading && (
        <>
          <div className="flex items-center justify-between text-sm">
            <div className="text-muted-foreground">
              {book.name} — {total.toLocaleString("ar-EG")} حديث
            </div>
            <button
              onClick={() => setStart(Math.max(1, Math.floor(Math.random() * total)))}
              className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 hover:bg-muted"
            >
              <RefreshCw className="h-4 w-4" /> عشوائي
            </button>
          </div>
          <div className="space-y-3">
            {shown.map((h) => (
              <div key={h.hadithnumber} className="rounded-2xl border border-border p-5">
                <div className="text-xs text-muted-foreground mb-2">حديث رقم {h.hadithnumber}</div>
                <p className="leading-loose text-lg font-arabic-quran">{h.text}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-2">
            <button
              disabled={start <= 1}
              onClick={() => setStart((s) => Math.max(1, s - pageSize))}
              className="px-4 py-2 rounded-full border border-border disabled:opacity-40"
            >
              السابق
            </button>
            <div className="text-sm text-muted-foreground">
              {start} - {Math.min(start + pageSize - 1, total)}
            </div>
            <button
              disabled={start + pageSize > total}
              onClick={() => setStart((s) => s + pageSize)}
              className="px-4 py-2 rounded-full border border-border disabled:opacity-40"
            >
              التالي
            </button>
          </div>
        </>
      )}
    </div>
  );
}