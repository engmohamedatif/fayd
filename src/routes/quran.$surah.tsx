import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, Play, Pause, SkipBack, SkipForward } from "lucide-react";

export const Route = createFileRoute("/quran/$surah")({
  head: () => ({ meta: [{ title: "قراءة السورة - فيض" }] }),
  component: SurahPage,
});

type Ayah = { number: number; numberInSurah: number; text: string; audio?: string };
type SurahData = { number: number; name: string; englishName: string; numberOfAyahs: number; ayahs: Ayah[] };
type Reciter = { identifier: string; language: string; name: string; englishName: string; format: string; type: string };

function SurahPage() {
  const { surah } = Route.useParams();
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [reciter, setReciter] = useState<string>("ar.alafasy");
  const [text, setText] = useState<SurahData | null>(null);
  const [audio, setAudio] = useState<SurahData | null>(null);
  const [current, setCurrent] = useState<number>(0);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetch("https://api.alquran.cloud/v1/edition?format=audio&language=ar&type=versebyverse")
      .then((r) => r.json())
      .then((j) => setReciters(j.data ?? []))
      .catch(() => setReciters([]));
  }, []);

  useEffect(() => {
    setText(null);
    fetch(`https://api.alquran.cloud/v1/surah/${surah}/quran-uthmani`)
      .then((r) => r.json())
      .then((j) => setText(j.data));
  }, [surah]);

  useEffect(() => {
    setAudio(null);
    setCurrent(0);
    setPlaying(false);
    fetch(`https://api.alquran.cloud/v1/surah/${surah}/${reciter}`)
      .then((r) => r.json())
      .then((j) => setAudio(j.data))
      .catch(() => setAudio(null));
  }, [surah, reciter]);

  const ayahs = text?.ayahs ?? [];
  const audioAyahs = audio?.ayahs ?? [];
  const currentAyah = audioAyahs[current];
  const currentText = ayahs[current];

  useEffect(() => {
    const a = audioRef.current;
    if (!a || !currentAyah?.audio) return;
    a.src = currentAyah.audio;
    if (playing) a.play().catch(() => setPlaying(false));
  }, [current, currentAyah?.audio]);

  const togglePlay = async () => {
    const a = audioRef.current;
    if (!a || !currentAyah?.audio) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      if (!a.src) a.src = currentAyah.audio;
      await a.play();
      setPlaying(true);
    }
  };

  const onEnded = () => {
    if (current < audioAyahs.length - 1) setCurrent((c) => c + 1);
    else setPlaying(false);
  };

  const scrollTo = (idx: number) => {
    const el = document.getElementById(`ayah-${idx}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  useEffect(() => {
    if (playing) scrollTo(current);
  }, [current, playing]);

  const groupedReciters = useMemo(() => reciters, [reciters]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 pb-40 space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/quran" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4 rotate-180" /> السور
        </Link>
        <div className="text-sm text-muted-foreground">
          {text ? `${text.name} · ${text.numberOfAyahs} آية` : "..."}
        </div>
      </div>

      <div className="text-center py-4 border-y border-border">
        <div className="text-4xl font-arabic-quran font-bold">{text?.name}</div>
        {Number(surah) !== 1 && Number(surah) !== 9 && (
          <div className="text-xl font-arabic-quran mt-3">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
        )}
      </div>

      <div>
        <label className="block text-sm mb-2 text-muted-foreground">اختر القارئ:</label>
        <select
          value={reciter}
          onChange={(e) => setReciter(e.target.value)}
          className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm"
        >
          {groupedReciters.length === 0 && <option value="ar.alafasy">مشاري راشد العفاسي</option>}
          {groupedReciters.map((r) => (
            <option key={r.identifier} value={r.identifier}>
              {r.name} — {r.englishName}
            </option>
          ))}
        </select>
      </div>

      {!text && <div className="text-center py-8">جاري تحميل السورة...</div>}

      <div className="space-y-2 leading-loose text-2xl font-arabic-quran text-right">
        {ayahs.map((a, i) => (
          <span
            key={a.number}
            id={`ayah-${i}`}
            onClick={() => {
              setCurrent(i);
              setPlaying(true);
            }}
            className={`cursor-pointer rounded px-1 transition ${
              i === current ? "bg-foreground text-background" : "hover:bg-muted"
            }`}
          >
            {a.text}
            <span className="inline-flex items-center justify-center mx-1 h-7 w-7 rounded-full border border-current text-xs align-middle">
              {a.numberInSurah}
            </span>{" "}
          </span>
        ))}
      </div>

      <audio ref={audioRef} onEnded={onEnded} onPause={() => setPlaying(false)} onPlay={() => setPlaying(true)} />

      {/* Sticky player */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-3xl px-4 py-3 space-y-2">
          {currentText && (
            <div className="text-center text-sm md:text-base font-arabic-quran line-clamp-2 leading-relaxed">
              {currentText.text}
            </div>
          )}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setCurrent((c) => Math.min((audioAyahs.length || 1) - 1, c + 1))}
              className="p-2 rounded-full border border-border hover:bg-muted"
              aria-label="التالية"
            >
              <SkipForward className="h-5 w-5 rotate-180" />
            </button>
            <button
              onClick={togglePlay}
              className="h-12 w-12 rounded-full bg-foreground text-background flex items-center justify-center hover:opacity-90"
            >
              {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </button>
            <button
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              className="p-2 rounded-full border border-border hover:bg-muted"
              aria-label="السابقة"
            >
              <SkipBack className="h-5 w-5 rotate-180" />
            </button>
            <div className="text-xs text-muted-foreground tabular-nums">
              {current + 1} / {audioAyahs.length || ayahs.length || 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}