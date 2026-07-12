import { createFileRoute, Link, Outlet, useMatches } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/quran")({
  head: () => ({ meta: [{ title: "القرآن الكريم - فيض" }, { name: "description", content: "قراءة واستماع للقرآن الكريم بأصوات كبار المشايخ." }] }),
  component: QuranLayout,
});

type Surah = { number: number; name: string; englishName: string; numberOfAyahs: number; revelationType: string };

function QuranLayout() {
  const matches = useMatches();
  const isChild = matches.some((m) => m.routeId === "/quran/$surah");
  if (isChild) return <Outlet />;
  return <SurahList />;
}

function SurahList() {
  const [surahs, setSurahs] = useState<Surah[] | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    fetch("https://api.alquran.cloud/v1/surah")
      .then((r) => r.json())
      .then((j) => setSurahs(j.data))
      .catch(() => setSurahs([]));
  }, []);

  const filtered = surahs?.filter((s) => s.name.includes(q) || s.englishName.toLowerCase().includes(q.toLowerCase())) ?? [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      <h1 className="text-2xl md:text-3xl font-extrabold text-center">القرآن الكريم</h1>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="ابحث عن سورة..."
        className="w-full rounded-full border border-border bg-card px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
      />
      {!surahs && <div className="text-center">جاري التحميل...</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {filtered.map((s) => (
          <Link
            key={s.number}
            to="/quran/$surah"
            params={{ surah: String(s.number) }}
            className="flex items-center gap-3 rounded-2xl border border-border p-4 hover:bg-foreground hover:text-background transition"
          >
            <div className="h-10 w-10 rounded-full border border-current flex items-center justify-center font-bold text-sm shrink-0">
              {s.number}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-arabic-quran font-bold text-lg truncate">{s.name}</div>
              <div className="text-xs opacity-70">{s.numberOfAyahs} آية · {s.revelationType === "Meccan" ? "مكية" : "مدنية"}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}