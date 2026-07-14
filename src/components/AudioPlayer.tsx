import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Loader2 } from "lucide-react";

type Props = {
  src: string;
  live?: boolean;
  autoPlay?: boolean;
  onEnded?: () => void;
  title?: string;
  subtitle?: string;
};

function fmt(t: number) {
  if (!isFinite(t) || t < 0) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function AudioPlayer({ src, live = false, autoPlay = false, onEnded, title, subtitle }: Props) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);
  const [vol, setVol] = useState(0.9);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const a = ref.current;
    if (!a) return;
    setCur(0);
    setDur(0);
    if (autoPlay && src) {
      setLoading(true);
      a.play().catch(() => setPlaying(false));
    }
  }, [src, autoPlay]);

  const toggle = async () => {
    const a = ref.current;
    if (!a || !src) return;
    if (playing) {
      a.pause();
    } else {
      setLoading(true);
      try {
        await a.play();
      } catch {
        setPlaying(false);
        setLoading(false);
      }
    }
  };

  const seek = (v: number) => {
    const a = ref.current;
    if (!a || live || !isFinite(dur)) return;
    a.currentTime = v;
    setCur(v);
  };

  const pct = dur > 0 ? (cur / dur) * 100 : 0;

  return (
    <div className="rounded-3xl border border-border bg-card p-5 md:p-6 shadow-sm">
      <audio
        ref={ref}
        src={src}
        preload="metadata"
        onPlay={() => { setPlaying(true); setLoading(false); }}
        onPause={() => setPlaying(false)}
        onWaiting={() => setLoading(true)}
        onCanPlay={() => setLoading(false)}
        onPlaying={() => setLoading(false)}
        onLoadedMetadata={(e) => setDur((e.currentTarget as HTMLAudioElement).duration || 0)}
        onTimeUpdate={(e) => setCur((e.currentTarget as HTMLAudioElement).currentTime)}
        onEnded={() => { setPlaying(false); onEnded?.(); }}
      />

      {(title || subtitle) && (
        <div className="text-center mb-4">
          {title && <div className="font-bold text-base md:text-lg truncate">{title}</div>}
          {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
        </div>
      )}

      <div className="flex items-center justify-center gap-4 mb-4">
        <button
          onClick={toggle}
          disabled={!src}
          className="relative h-16 w-16 md:h-20 md:w-20 rounded-full bg-foreground text-background flex items-center justify-center md:hover:scale-105 active:scale-95 transition disabled:opacity-40 shadow-lg"
          aria-label={playing ? "إيقاف" : "تشغيل"}
        >
          {loading && !playing ? (
            <Loader2 className="h-7 w-7 animate-spin" />
          ) : playing ? (
            <Pause className="h-7 w-7 md:h-8 md:w-8" />
          ) : (
            <Play className="h-7 w-7 md:h-8 md:w-8 mr-[-3px]" />
          )}
        </button>
      </div>

      {live ? (
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className={`absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 ${playing ? "animate-ping" : ""}`}></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          <span className="text-xs font-bold tracking-wide">مباشر</span>
        </div>
      ) : (
        <div className="space-y-1.5 mb-3">
          <input
            type="range"
            min={0}
            max={dur || 0}
            step={0.1}
            value={cur}
            onChange={(e) => seek(Number(e.target.value))}
            className="fayd-range w-full"
            style={{ ["--pct" as string]: `${pct}%` }}
            dir="ltr"
          />
          <div className="flex justify-between text-[11px] text-muted-foreground tabular-nums" dir="ltr">
            <span>{fmt(cur)}</span>
            <span>{fmt(dur)}</span>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 max-w-[220px] mx-auto">
        <button
          onClick={() => {
            const a = ref.current;
            if (!a) return;
            a.muted = !a.muted;
            setMuted(a.muted);
          }}
          className="p-1.5 rounded-full md:hover:bg-muted text-muted-foreground"
          aria-label={muted ? "إلغاء الكتم" : "كتم"}
        >
          {muted || vol === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={muted ? 0 : vol}
          onChange={(e) => {
            const v = Number(e.target.value);
            setVol(v);
            if (ref.current) {
              ref.current.volume = v;
              ref.current.muted = v === 0;
              setMuted(v === 0);
            }
          }}
          className="fayd-range w-full"
          style={{ ["--pct" as string]: `${(muted ? 0 : vol) * 100}%` }}
          dir="ltr"
        />
      </div>
    </div>
  );
}