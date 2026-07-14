import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, X } from "lucide-react";

export const Route = createFileRoute("/quran-read/$surah")({
  head: () => ({ meta: [{ title: "قراءة السورة - فيض" }] }),
  component: SurahReadPage,
});

type Ayah = { number: number; numberInSurah: number; text: string };
type SurahData = { number: number; name: string; englishName: string; numberOfAyahs: number; ayahs: Ayah[] };

function SurahReadPage() {
  const { surah } = Route.useParams();
  const [data, setData] = useState<SurahData | null>(null);
  const [tafsir, setTafsir] = useState<{ ayah: Ayah; text: string | null } | null>(null);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setData(null);
    fetch(`https://api.alquran.cloud/v1/surah/${surah}/quran-uthmani`).then((r) => r.json()).then((j) => setData(j.data));
  }, [surah]);

  const openTafsir = async (a: Ayah) => {
    setTafsir({ ayah: a, text: null });
    try {
      const r = await fetch(`https://api.alquran.cloud/v1/ayah/${surah}:${a.numberInSurah}/ar.muyassar`);
      const j = await r.json();
      setTafsir({ ayah: a, text: j?.data?.text ?? "تعذر تحميل التفسير." });
    } catch {
      setTafsir({ ayah: a, text: "تعذر تحميل التفسير." });
    }
  };

  const startPress = (a: Ayah) => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
    pressTimer.current = setTimeout(() => openTafsir(a), 500);
  };
  const cancelPress = () => {
    if (pressTimer.current) { clearTimeout(pressTimer.current); pressTimer.current = null; }
  };

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
      <p className="text-xs text-center text-muted-foreground">اضغط مطولاً على الآية لعرض التفسير</p>
      {!data && <div className="text-center py-8">جاري تحميل السورة...</div>}
      <div className="leading-loose text-2xl font-arabic-quran text-justify">
        {data?.ayahs.map((a) => (
          <span
            key={a.number}
            onContextMenu={(e) => { e.preventDefault(); openTafsir(a); }}
            onPointerDown={() => startPress(a)}
            onPointerUp={cancelPress}
            onPointerLeave={cancelPress}
            onPointerCancel={cancelPress}
            className="cursor-pointer select-none rounded px-0.5 transition md:hover:bg-muted"
          >
            {a.text}
            <span className="inline-flex items-center justify-center mx-1 h-7 w-7 rounded-full border border-current text-xs align-middle">{a.numberInSurah}</span>{" "}
          </span>
        ))}
      </div>

      {tafsir && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setTafsir(null)}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-background border border-border shadow-xl p-6 space-y-4 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">تفسير الميسر · آية {tafsir.ayah.numberInSurah}</div>
              <button onClick={() => setTafsir(null)} className="p-1 rounded-full hover:bg-muted" aria-label="إغلاق">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="text-xl font-arabic-quran leading-loose text-center border-b border-border pb-4">
              {tafsir.ayah.text}
            </div>
            <div className="text-base leading-loose">
              {tafsir.text ?? "جاري التحميل..."}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}