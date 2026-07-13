import { createFileRoute, Link, Outlet, useMatches } from "@tanstack/react-router";
import { MP3_RECITERS, VERSE_RECITERS } from "@/lib/quran-reciters";
import { Mic2, PlayCircle } from "lucide-react";

export const Route = createFileRoute("/quran-listen")({
  head: () => ({ meta: [{ title: "الاستماع للقرآن الكريم - فيض" }, { name: "description", content: "استمع للقرآن الكريم بأصوات كبار المشايخ آية بآية أو سورة كاملة." }] }),
  component: Layout,
});

function Layout() {
  const matches = useMatches();
  const isChild = matches.some((m) => m.routeId === "/quran-listen/$reciter");
  if (isChild) return <Outlet />;
  return <ReciterGrid />;
}

function ReciterGrid() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-extrabold">الاستماع للقرآن الكريم</h1>
        <p className="text-sm text-muted-foreground">اختر القارئ للبدء في الاستماع</p>
      </div>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <PlayCircle className="h-5 w-5" />
          <h2 className="text-lg font-bold">مشغل آية بآية (تشغيل تلقائي)</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {VERSE_RECITERS.map((r) => (
            <Link key={r.identifier} to="/quran-listen/$reciter" params={{ reciter: r.identifier }} search={{ mode: "verse" as const }} className="group flex items-center gap-3 rounded-2xl border border-border p-4 md:hover:bg-foreground md:hover:text-background transition">
              <div className="h-11 w-11 rounded-full bg-muted flex items-center justify-center shrink-0">
                <Mic2 className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="font-arabic-quran font-bold text-lg truncate">{r.name}</div>
                <div className="text-xs opacity-70">آية بآية</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <PlayCircle className="h-5 w-5" />
          <h2 className="text-lg font-bold">قراء السور الكاملة (كبار المشايخ)</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {MP3_RECITERS.map((r) => (
            <Link key={r.id} to="/quran-listen/$reciter" params={{ reciter: r.id }} search={{ mode: "full" as const }} className="group flex items-center gap-3 rounded-2xl border border-border p-4 md:hover:bg-foreground md:hover:text-background transition">
              <div className="h-11 w-11 rounded-full bg-muted flex items-center justify-center shrink-0">
                <Mic2 className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="font-arabic-quran font-bold text-lg truncate">{r.name}</div>
                <div className="text-xs opacity-70">سورة كاملة</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}