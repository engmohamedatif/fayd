import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";

export const Route = createFileRoute("/seerah")({
  head: () => ({
    meta: [
      { title: "السيرة النبوية - فيض" },
      { name: "description", content: "أحداث ومحطات من السيرة النبوية الشريفة من مصادر موثوقة." },
    ],
  }),
  component: SeerahPage,
});

const TOPICS: { title: string; slug: string }[] = [
  { title: "محمد رسول الله ﷺ", slug: "محمد" },
  { title: "المولد النبوي الشريف", slug: "المولد_النبوي" },
  { title: "بعثة النبي محمد", slug: "بعثة_النبي_محمد" },
  { title: "الدعوة السرية", slug: "الدعوة_السرية" },
  { title: "الدعوة الجهرية", slug: "الدعوة_الجهرية" },
  { title: "الإسراء والمعراج", slug: "الإسراء_والمعراج" },
  { title: "الهجرة النبوية", slug: "الهجرة_النبوية" },
  { title: "المدينة المنورة", slug: "المدينة_المنورة" },
  { title: "غزوة بدر", slug: "غزوة_بدر" },
  { title: "غزوة أحد", slug: "غزوة_أحد" },
  { title: "غزوة الخندق", slug: "غزوة_الخندق" },
  { title: "صلح الحديبية", slug: "صلح_الحديبية" },
  { title: "فتح مكة", slug: "فتح_مكة" },
  { title: "غزوة حنين", slug: "غزوة_حنين" },
  { title: "غزوة تبوك", slug: "غزوة_تبوك" },
  { title: "حجة الوداع", slug: "حجة_الوداع" },
  { title: "وفاة النبي محمد", slug: "وفاة_محمد" },
  { title: "زوجات النبي محمد", slug: "زوجات_النبي_محمد" },
  { title: "أبو بكر الصديق", slug: "أبو_بكر_الصديق" },
  { title: "عمر بن الخطاب", slug: "عمر_بن_الخطاب" },
  { title: "عثمان بن عفان", slug: "عثمان_بن_عفان" },
  { title: "علي بن أبي طالب", slug: "علي_بن_أبي_طالب" },
];

type Summary = { extract: string; thumbnail?: { source: string }; content_urls?: { desktop: { page: string } } };

function SeerahPage() {
  const [selected, setSelected] = useState(TOPICS[0]);
  const [data, setData] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setErr(null);
    setData(null);
    fetch(`https://ar.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(selected.slug)}`)
      .then((r) => r.json())
      .then((j) => setData(j))
      .catch(() => setErr("تعذّر التحميل"))
      .finally(() => setLoading(false));
  }, [selected]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 grid md:grid-cols-[280px_1fr] gap-6">
      <aside className="space-y-1 md:sticky md:top-20 md:self-start md:max-h-[calc(100vh-6rem)] md:overflow-y-auto">
        <h1 className="text-xl font-extrabold mb-3">السيرة النبوية</h1>
        {TOPICS.map((t) => (
          <button
            key={t.slug}
            onClick={() => setSelected(t)}
            className={`w-full text-right px-3 py-2 rounded-lg text-sm transition ${
              selected.slug === t.slug ? "bg-foreground text-background" : "hover:bg-muted"
            }`}
          >
            {t.title}
          </button>
        ))}
      </aside>
      <article className="rounded-2xl border border-border bg-card p-6 space-y-4 min-h-[300px]">
        <h2 className="text-2xl font-extrabold">{selected.title}</h2>
        {loading && <div className="text-muted-foreground">جاري التحميل...</div>}
        {err && <div className="text-destructive">{err}</div>}
        {data && (
          <>
            {data.thumbnail && (
              <img src={data.thumbnail.source} alt={selected.title} className="rounded-xl max-h-64 object-cover mx-auto" />
            )}
            <p className="leading-loose text-lg whitespace-pre-wrap">{data.extract}</p>
            {data.content_urls && (
              <a
                href={data.content_urls.desktop.page}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm rounded-full border border-border px-4 py-2 hover:bg-muted"
              >
                <ExternalLink className="h-4 w-4" /> اقرأ المقال كاملاً على ويكيبيديا
              </a>
            )}
            <div className="text-xs text-muted-foreground pt-2 border-t border-border">
              المصدر: موسوعة ويكيبيديا العربية — محتوى مُرخّص بموجب CC BY-SA.
            </div>
          </>
        )}
      </article>
    </div>
  );
}