import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/tafsir/$surah")({
  head: () => ({ meta: [{ title: "تفسير السورة - فيض" }] }),
  component: TafsirPage,
});

const EDITIONS = [
  { id: "ar.muyassar", name: "التفسير الميسر" },
  { id: "ar.jalalayn", name: "تفسير الجلالين" },
  { id: "ar.qurtubi", name: "تفسير القرطبي" },
  { id: "ar.baghawi", name: "تفسير البغوي" },
  { id: "ar.waseet", name: "التفسير الوسيط" },
  { id: "ar.miqbas", name: "تنوير المقباس" },
];

type Ayah = { number: number; numberInSurah: number; text: string };
type SurahData = { number: number; name: string; numberOfAyahs: number; ayahs: Ayah[] };

function TafsirPage() {
  const { surah } = Route.useParams();
  const [edition, setEdition] = useState(EDITIONS[0].id);
  const [quran, setQuran] = useState<SurahData | null>(null);
  const [tafsir, setTafsir] = useState<SurahData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`https://api.alquran.cloud/v1/surah/${surah}/quran-uthmani`).then((r) => r.json()),
      fetch(`https://api.alquran.cloud/v1/surah/${surah}/${edition}`).then((r) => r.json()),
    ])
      .then(([q, t]) => { setQuran(q.data); setTafsir(t.data); })
      .finally(() => setLoading(false));
  }, [surah, edition]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/tafsir" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4 rotate-180" /> السور
        </Link>
        <div className="text-sm text-muted-foreground">{quran ? `${quran.name} · ${quran.numberOfAyahs} آية` : "..."}</div>
      </div>
      <div className="text-center py-4 border-y border-border">
        <div className="text-4xl font-arabic-quran font-bold">{quran?.name}</div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {EDITIONS.map((e) => (
          <button key={e.id} onClick={() => setEdition(e.id)} className={`text-sm px-3 py-1.5 rounded-full border ${edition === e.id ? "bg-foreground text-background border-foreground" : "border-border hover:bg-muted"}`}>
            {e.name}
          </button>
        ))}
      </div>

      {loading && <div className="text-center py-8">جاري التحميل...</div>}

      {!loading && quran && tafsir && (
        <div className="space-y-4">
          {quran.ayahs.map((a, i) => (
            <div key={a.number} className="rounded-2xl border border-border p-5 space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full border border-current flex items-center justify-center text-xs shrink-0">{a.numberInSurah}</div>
                <div className="font-arabic-quran text-xl leading-loose flex-1">{a.text}</div>
              </div>
              <div className="text-base leading-loose text-foreground/85 pr-11 border-t border-border pt-3">
                {tafsir.ayahs[i]?.text}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
