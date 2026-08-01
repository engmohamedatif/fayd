import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArchiveBrowser } from "@/components/ArchiveBrowser";

export const Route = createFileRoute("/fatwa")({
  head: () => ({
    meta: [
      { title: "الفتاوى وسؤال وجواب - فيض" },
      { name: "description", content: "فتاوى كبار العلماء صوتية ومكتوبة مع توثيق المرجع لكل فتوى." },
      { property: "og:title", content: "الفتاوى وسؤال وجواب - فيض" },
      { property: "og:description", content: "فتاوى موثقة صوتية ومكتوبة لكبار أهل العلم." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FatwaPage,
});

const AUDIO_TOPICS = [
  "فتاوى ابن باز",
  "فتاوى ابن عثيمين",
  "فتاوى نور على الدرب",
  "فتاوى الألباني",
  "فتاوى الصيام",
  "فتاوى الحج",
  "فتاوى الصلاة",
  "فتاوى الزكاة",
].map((t) => ({ label: t.replace("فتاوى ", ""), query: t }));

const TEXT_TOPICS = [
  "فتاوى اللجنة الدائمة",
  "مجموع فتاوى ابن باز",
  "مجموع فتاوى ابن عثيمين",
  "مجموع الفتاوى ابن تيمية",
  "فتاوى المعاملات",
  "فتاوى النساء",
].map((t) => ({ label: t, query: t }));

function FatwaPage() {
  const [tab, setTab] = useState<"audio" | "texts">("audio");
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      <header className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold">الفتاوى وسؤال وجواب</h1>
        <p className="text-muted-foreground text-sm">
          فتاوى مسموعة ومقروءة لكبار أهل العلم، مع رابط المرجع الأصلي لكل مادة. عند اختلاف الفتوى استشر أهل العلم في بلدك.
        </p>
      </header>

      <div className="flex justify-center gap-2">
        {(["audio", "texts"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-5 py-2 text-sm font-bold border border-border transition ${
              tab === t ? "bg-foreground text-background" : "md:hover:bg-muted"
            }`}
          >
            {t === "audio" ? "فتاوى صوتية" : "فتاوى مكتوبة"}
          </button>
        ))}
      </div>

      {tab === "audio" ? (
        <ArchiveBrowser topics={AUDIO_TOPICS} mediatype="audio" />
      ) : (
        <ArchiveBrowser topics={TEXT_TOPICS} mediatype="texts" />
      )}
    </div>
  );
}