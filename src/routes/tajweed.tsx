import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { cleanText } from "@/lib/media";
import { AudioPlayer } from "@/components/AudioPlayer";
import { ArchiveBrowser } from "@/components/ArchiveBrowser";

export const Route = createFileRoute("/tajweed")({
  head: () => ({
    meta: [
      { title: "تعلّم التجويد: الأحكام والتدريبات الصوتية - فيض" },
      { name: "description", content: "أحكام التجويد بمراجع موثقة مع تدريبات صوتية عملية على كل حكم." },
      { property: "og:title", content: "تعلّم التجويد - فيض" },
      { property: "og:description", content: "أحكام التجويد وتدريبات صوتية عملية." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TajweedPage,
});

type Rule = { title: string; slug: string; drill: { label: string; surah: number; ayah: number } };

const RULES: Rule[] = [
  { title: "علم التجويد", slug: "تجويد", drill: { label: "الفاتحة 1", surah: 1, ayah: 1 } },
  { title: "الاستعاذة والبسملة", slug: "بسملة", drill: { label: "النحل 98", surah: 16, ayah: 98 } },
  { title: "أحكام النون الساكنة والتنوين", slug: "أحكام_النون_الساكنة_والتنوين", drill: { label: "البقرة 5", surah: 2, ayah: 5 } },
  { title: "الإظهار", slug: "إظهار", drill: { label: "الأنعام 26", surah: 6, ayah: 26 } },
  { title: "الإدغام", slug: "إدغام", drill: { label: "البقرة 26", surah: 2, ayah: 26 } },
  { title: "الإقلاب", slug: "إقلاب_(تجويد)", drill: { label: "الهمزة 4", surah: 104, ayah: 4 } },
  { title: "الإخفاء", slug: "إخفاء", drill: { label: "النبأ 1", surah: 78, ayah: 1 } },
  { title: "أحكام الميم الساكنة", slug: "أحكام_الميم_الساكنة", drill: { label: "الفيل 4", surah: 105, ayah: 4 } },
  { title: "المدود", slug: "مد_(تجويد)", drill: { label: "البقرة 255", surah: 2, ayah: 255 } },
  { title: "القلقلة", slug: "قلقلة", drill: { label: "المسد 1", surah: 111, ayah: 1 } },
  { title: "التفخيم والترقيق", slug: "تفخيم", drill: { label: "الفاتحة 2", surah: 1, ayah: 2 } },
  { title: "الوقف والابتداء", slug: "وقف_(تجويد)", drill: { label: "البقرة 2", surah: 2, ayah: 2 } },
];

type Summary = { extract?: string; content_urls?: { desktop: { page: string } } };

function ayahAudio(surah: number, ayah: number) {
  const s = String(surah).padStart(3, "0");
  const a = String(ayah).padStart(3, "0");
  return `https://everyayah.com/data/Husary_128kbps/${s}${a}.mp3`;
}

function TajweedPage() {
  const [tab, setTab] = useState<"rules" | "lessons">("rules");
  const [rule, setRule] = useState<Rule>(RULES[0]);
  const [sum, setSum] = useState<Summary | null>(null);
  const [ayahText, setAyahText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tab !== "rules") return;
    let alive = true;
    setLoading(true);
    setSum(null);
    setAyahText(null);
    fetch(`https://ar.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(rule.slug)}`)
      .then((r) => r.json())
      .then((j) => alive && setSum(j))
      .catch(() => alive && setSum(null))
      .finally(() => alive && setLoading(false));
    fetch(`https://api.alquran.cloud/v1/ayah/${rule.drill.surah}:${rule.drill.ayah}/quran-uthmani`)
      .then((r) => r.json())
      .then((j) => alive && setAyahText(j?.data?.text ?? null))
      .catch(() => alive && setAyahText(null));
    return () => {
      alive = false;
    };
  }, [rule, tab]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <header className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold">تعلّم التجويد</h1>
        <p className="text-muted-foreground text-sm">أحكام التجويد + تدريب صوتي عملي على كل حكم.</p>
      </header>

      <div className="mx-auto flex w-fit overflow-hidden rounded-full border border-border bg-card">
        {(["rules", "lessons"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-2 text-sm font-bold transition-all duration-300 border-l border-border last:border-l-0 ${
              tab === t ? "bg-foreground text-background" : "md:hover:bg-muted"
            }`}
          >
            {t === "rules" ? "الأحكام والتدريبات" : "دروس صوتية"}
          </button>
        ))}
      </div>

      {tab === "lessons" ? (
        <ArchiveBrowser
          topics={["التجويد", "أحكام التجويد", "أيمن سويد التجويد", "متون التجويد", "الجزرية", "تحفة الأطفال"].map((q) => ({
            label: q,
            query: q,
          }))}
          mediatype="audio"
        />
      ) : (
        <div className="grid md:grid-cols-[260px_1fr] gap-6">
          <aside className="overflow-hidden rounded-2xl border border-border bg-card divide-y divide-border md:sticky md:top-20 md:self-start">
            {RULES.map((r) => (
              <button
                key={r.slug}
                onClick={() => setRule(r)}
                className={`w-full text-right px-4 py-2.5 text-sm transition-all duration-300 ${
                  rule.slug === r.slug ? "bg-foreground text-background" : "md:hover:bg-muted"
                }`}
              >
                {r.title}
              </button>
            ))}
          </aside>

          <article className="rounded-2xl border border-border bg-card p-6 space-y-5 min-h-[320px]">
            <h2 className="text-2xl font-extrabold">{rule.title}</h2>
            {loading && (
              <div className="flex justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            )}
            {sum?.extract && (
              <p className="leading-loose text-lg whitespace-pre-wrap animate-in fade-in duration-300">
                {cleanText(sum.extract)}
              </p>
            )}

            <div className="pt-4 border-t border-border space-y-3">
              <h3 className="font-bold">تدريب صوتي — {rule.drill.label}</h3>
              {ayahText && <p className="font-quran text-2xl leading-loose text-center">{ayahText}</p>}
              <AudioPlayer
                src={ayahAudio(rule.drill.surah, rule.drill.ayah)}
                title={rule.drill.label}
                subtitle="بصوت الشيخ محمود خليل الحصري — مرتل مجوّد"
              />
            </div>
          </article>
        </div>
      )}
    </div>
  );
}