import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, Play, Pause, SkipBack, SkipForward, Loader2 } from "lucide-react";
import { MP3_RECITERS, VERSE_RECITERS, surahAudioUrl } from "@/lib/quran-reciters";
import { z } from "zod";
import { DownloadButton } from "@/components/DownloadButton";

const searchSchema = z.object({ mode: z.enum(["verse", "full"]).default("full") });

function fmtT(t: number) {
  if (!isFinite(t) || t < 0) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export const Route = createFileRoute("/quran-listen/$reciter")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({ meta: [{ title: "الاستماع - فيض" }] }),
  component: ReciterPage,
});

type Surah = { number: number; name: string; englishName: string; numberOfAyahs: number };
type Ayah = { number: number; numberInSurah: number; text: string; audio?: string };

function ReciterPage() {
  const { reciter } = Route.useParams();
  const { mode } = Route.useSearch();
  const [surahs, setSurahs] = useState<Surah[] | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    fetch("https://api.alquran.cloud/v1/surah").then((r) => r.json()).then((j) => setSurahs(j.data));
  }, []);

  const reciterName = useMemo(() => {
    if (mode === "verse") return VERSE_RECITERS.find((r) => r.identifier === reciter)?.name ?? reciter;
    return MP3_RECITERS.find((r) => r.id === reciter)?.name ?? reciter;
  }, [reciter, mode]);

  const filtered = surahs?.filter((s) => s.name.includes(q) || s.englishName.toLowerCase().includes(q.toLowerCase())) ?? [];

  if (selected) {
    return <PlayerView reciter={reciter} mode={mode} surahs={surahs ?? []} surahNumber={selected} onBack={() => setSelected(null)} reciterName={reciterName} />;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/quran-listen" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4 rotate-180" /> القراء
        </Link>
        <div className="text-sm font-bold">{reciterName}</div>
      </div>
      <h1 className="text-xl md:text-2xl font-extrabold text-center">اختر السورة</h1>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث عن سورة..." className="w-full rounded-full border border-border bg-card px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground" />
      {!surahs && <div className="text-center">جاري التحميل...</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {filtered.map((s) => (
          <button key={s.number} onClick={() => setSelected(s.number)} className="flex items-center gap-3 rounded-2xl border border-border p-4 md:hover:bg-foreground md:hover:text-background transition text-right">
            <div className="h-10 w-10 rounded-full border border-current flex items-center justify-center font-bold text-sm shrink-0">{s.number}</div>
            <div className="flex-1 min-w-0">
              <div className="font-arabic-quran font-bold text-lg truncate">{s.name}</div>
              <div className="text-xs opacity-70">{s.numberOfAyahs} آية</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function PlayerView({ reciter, mode, surahs, surahNumber, onBack, reciterName }: { reciter: string; mode: "verse" | "full"; surahs: Surah[]; surahNumber: number; onBack: () => void; reciterName: string }) {
  const surahMeta = surahs.find((s) => s.number === surahNumber);
  const [ayahs, setAyahs] = useState<Ayah[] | null>(null);
  const [audioAyahs, setAudioAyahs] = useState<Ayah[] | null>(null);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [curT, setCurT] = useState(0);
  const [durT, setDurT] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/quran-uthmani`).then((r) => r.json()).then((j) => setAyahs(j.data.ayahs));
  }, [surahNumber]);

  useEffect(() => {
    setCurrent(0);
    setPlaying(false);
    if (mode === "verse") {
      fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/${reciter}`).then((r) => r.json()).then((j) => setAudioAyahs(j.data.ayahs));
    } else {
      setAudioAyahs(null);
    }
  }, [surahNumber, reciter, mode]);

  const currentAyah = mode === "verse" ? audioAyahs?.[current] : undefined;
  const currentText = ayahs?.[current];
  const fullServer = MP3_RECITERS.find((r) => r.id === reciter)?.server;
  const currentAudioUrl = mode === "verse" ? currentAyah?.audio : fullServer ? surahAudioUrl(fullServer, surahNumber) : undefined;

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (mode === "verse") {
      if (!currentAyah?.audio) return;
      a.src = currentAyah.audio;
      if (playing) a.play().catch(() => setPlaying(false));
    } else {
      const server = MP3_RECITERS.find((r) => r.id === reciter)?.server;
      if (!server) return;
      a.src = surahAudioUrl(server, surahNumber);
      if (playing) a.play().catch(() => setPlaying(false));
    }
     
  }, [current, currentAyah?.audio, surahNumber, mode, reciter]);

  const onEnded = () => {
    if (mode === "verse" && audioAyahs && current < audioAyahs.length - 1) {
      setCurrent((c) => c + 1);
      setPlaying(true);
    } else {
      setPlaying(false);
    }
  };

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) { a.pause(); setPlaying(false); }
    else {
      if (!a.src) {
        if (mode === "verse" && currentAyah?.audio) a.src = currentAyah.audio;
        else {
          const server = MP3_RECITERS.find((r) => r.id === reciter)?.server;
          if (server) a.src = surahAudioUrl(server, surahNumber);
        }
      }
      try { await a.play(); setPlaying(true); } catch { setPlaying(false); }
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4 rotate-180" /> السور
        </button>
        <div className="text-sm text-muted-foreground">{reciterName}</div>
      </div>

      <div className="text-center py-4 border-y border-border">
        <div className="text-4xl font-arabic-quran font-bold">{surahMeta?.name}</div>
        <div className="text-xs text-muted-foreground mt-1">{surahMeta?.numberOfAyahs} آية</div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-8 md:p-10 mx-auto max-w-xl text-center space-y-6 shadow-sm">
        <div className="min-h-24 flex items-center justify-center">
          {mode === "verse" ? (
            currentText ? (
              <div className="text-xl md:text-2xl font-arabic-quran leading-relaxed">{currentText.text}</div>
            ) : <div className="text-muted-foreground text-sm">جاري التحميل...</div>
          ) : (
            <div className="text-lg text-muted-foreground">استمع للسورة كاملة</div>
          )}
        </div>
        <div className="flex items-center justify-center gap-4">
          {mode === "verse" && (
            <button onClick={() => setCurrent((c) => Math.min((audioAyahs?.length ?? 1) - 1, c + 1))} className="p-3 rounded-full border border-border md:hover:bg-muted" aria-label="التالية">
              <SkipForward className="h-5 w-5 rotate-180" />
            </button>
          )}
          <button onClick={toggle} className="h-16 w-16 rounded-full bg-foreground text-background flex items-center justify-center md:hover:opacity-90">
            {playing ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7" />}
          </button>
          {mode === "verse" && (
            <button onClick={() => setCurrent((c) => Math.max(0, c - 1))} className="p-3 rounded-full border border-border md:hover:bg-muted" aria-label="السابقة">
              <SkipBack className="h-5 w-5 rotate-180" />
            </button>
          )}
        </div>
        {mode === "verse" && audioAyahs && (
          <div className="text-xs text-muted-foreground tabular-nums">{current + 1} / {audioAyahs.length}</div>
        )}
      </div>

      <audio
        ref={audioRef}
        onEnded={onEnded}
        onPause={() => setPlaying(false)}
        onPlay={() => { setPlaying(true); setLoading(false); }}
        onWaiting={() => setLoading(true)}
        onCanPlay={() => setLoading(false)}
        onLoadedMetadata={(e) => setDurT((e.currentTarget as HTMLAudioElement).duration || 0)}
        onTimeUpdate={(e) => setCurT((e.currentTarget as HTMLAudioElement).currentTime)}
        className="hidden"
      />
      <div className="mx-auto max-w-xl">
        <div className="space-y-1.5" dir="ltr">
          <input
            type="range"
            min={0}
            max={durT || 0}
            step={0.1}
            value={curT}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (audioRef.current) audioRef.current.currentTime = v;
              setCurT(v);
            }}
            className="fayd-range w-full"
            style={{ ["--pct" as string]: `${durT > 0 ? (curT / durT) * 100 : 0}%` }}
          />
          <div className="flex justify-between text-[11px] text-muted-foreground tabular-nums">
            <span>{fmtT(curT)}</span>
            <span>{fmtT(durT)}</span>
          </div>
        </div>
        {loading && (
          <div className="flex justify-center mt-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        )}
        {currentAudioUrl && (
          <div className="mt-5 flex justify-center">
            <DownloadButton
              url={currentAudioUrl}
              filename={`${reciterName}-${surahMeta?.name ?? surahNumber}${mode === "verse" ? `-آية-${current + 1}` : ""}.mp3`}
              label={mode === "verse" ? "تحميل الآية" : "تحميل السورة"}
              variant="solid"
            />
          </div>
        )}
      </div>

      {mode === "verse" && ayahs && (
        <div className="leading-loose text-xl font-arabic-quran text-justify">
          {ayahs.map((a, i) => (
            <span key={a.number} onClick={() => { setCurrent(i); setPlaying(true); }} className={`cursor-pointer rounded px-1 transition ${i === current ? "bg-foreground text-background" : "md:hover:bg-muted"}`}>
              {a.text}
              <span className="inline-flex items-center justify-center mx-1 h-6 w-6 rounded-full border border-current text-xs align-middle">{a.numberInSurah}</span>{" "}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}