import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { cleanText } from "@/lib/media";

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

function stripHtml(html: string) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<table[\s\S]*?<\/table>/gi, "")
    .replace(/<h(\d)[^>]*>([\s\S]*?)<\/h\1>/gi, "\n\n■ $2\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<\/li>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\[\d+\]/g, "")
    .replace(/&#\d+;|&[a-z]+;/gi, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function SeerahPage() {
  const [selected, setSelected] = useState(TOPICS[0]);
  const [data, setData] = useState<Summary | null>(null);
  const [full, setFull] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErr(null);
    setData(null);
    setFull(null);
    fetch(`https://ar.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(selected.slug)}`)
      .then((r) => r.json())
      .then((j) => alive && setData(j))
      .catch(() => alive && setErr("تعذّر التحميل"))
      .finally(() => alive && setLoading(false));

    const params = new URLSearchParams({
      action: "query",
      prop: "extracts",
      titles: selected.slug.replace(/_/g, " "),
      explaintext: "1",
      format: "json",
      origin: "*",
      redirects: "1",
    });
    fetch(`https://ar.wikipedia.org/w/api.php?${params.toString()}`)
      .then((r) => r.json())
      .then((j) => {
        if (!alive) return;
        const pages = j?.query?.pages ?? {};
        const first = Object.values(pages)[0] as { extract?: string } | undefined;
        setFull(first?.extract ? stripHtml(first.extract) : null);
      })
      .catch(() => alive && setFull(null));
    return () => {
      alive = false;
    };
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
            <p className="leading-loose text-lg whitespace-pre-wrap animate-in fade-in duration-300">
              {cleanText(full ?? data.extract)}
            </p>
          </>
        )}
      </article>
    </div>
  );
}