import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/quran-read/$surah")({
  head: () => ({ meta: [{ title: "قراءة السورة - فيض" }] }),
  component: SurahReadPage,
});

type Ayah = { number: number; numberInSurah: number; text: string };
type SurahData = { number: number; name: string; englishName: string; numberOfAyahs: number; ayahs: Ayah[] };

function SurahReadPage() {
  const { surah } = Route.useParams();
  const [data, setData] = useState<SurahData | null>(null);
  useEffect(() => {
    setData(null);
    fetch(`https://api.alquran.cloud/v1/surah/${surah}/quran-uthmani`).then((r) => r.json()).then((j) => setData(j.data));
  }, [surah]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/quran-read" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4 rotate-180" /> السور
        </Link>
        <div className="text-sm text-muted-foreground">{data ? `${data.name} · ${data.numberOfAyahs} آية` : "..."}</div>
      </div>
      <div className="text-center py-4 border-y border-border">
        <div className="text-4xl font-arabic-quran font-bold">{data?.name}</div>
        {data && Number(surah) !== 1 && Number(surah) !== 9 && (
          <div className="text-xl font-arabic-quran mt-3">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
        )}
      </div>
      {!data && <div className="text-center py-8">جاري تحميل السورة...</div>}
      <div className="leading-loose text-2xl font-arabic-quran text-justify">
        {data?.ayahs.map((a) => (
          <span key={a.number}>
            {a.text}
            <span className="inline-flex items-center justify-center mx-1 h-7 w-7 rounded-full border border-current text-xs align-middle">{a.numberInSurah}</span>{" "}
          </span>
        ))}
      </div>
    </div>
  );
}