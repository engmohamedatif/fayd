import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/asma")({
  head: () => ({
    meta: [
      { title: "أسماء الله الحسنى - فيض" },
      { name: "description", content: "أسماء الله الحسنى التسعة والتسعون مع المعاني." },
    ],
  }),
  component: AsmaPage,
});

type Name = { name: string; transliteration: string; number: number; en: { meaning: string } };

function AsmaPage() {
  const [names, setNames] = useState<Name[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://api.aladhan.com/v1/asmaAlHusna")
      .then((r) => r.json())
      .then((j) => setNames(j.data))
      .catch(() => setErr("تعذّر التحميل"));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <header className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold">أسماء الله الحسنى</h1>
        <p className="text-muted-foreground">التسعة والتسعون اسماً مع معانيها</p>
      </header>
      {err && <div className="text-center text-destructive">{err}</div>}
      {!names && !err && <div className="text-center text-muted-foreground">جاري التحميل...</div>}
      {names && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {names.map((n) => (
            <div key={n.number} className="rounded-2xl border border-border bg-card p-4 text-center">
              <div className="text-xs text-muted-foreground">{n.number}</div>
              <div className="text-2xl font-extrabold my-1">{n.name}</div>
              <div className="text-xs text-muted-foreground">{n.transliteration}</div>
              <div className="text-sm mt-1">{n.en.meaning}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}