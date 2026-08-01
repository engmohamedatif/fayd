import { createFileRoute } from "@tanstack/react-router";
import { ArchiveBrowser } from "@/components/ArchiveBrowser";

export const Route = createFileRoute("/lectures")({
  head: () => ({
    meta: [
      { title: "دروس ومحاضرات صوتية - فيض" },
      { name: "description", content: "دروس ومحاضرات صوتية لكبار العلماء بمصادر موثقة من الأرشيف الصوتي." },
      { property: "og:title", content: "دروس ومحاضرات صوتية - فيض" },
      { property: "og:description", content: "استمع لدروس ومحاضرات كبار العلماء مع توثيق المرجع." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LecturesPage,
});

const SCHOLARS = [
  "ابن باز",
  "ابن عثيمين",
  "الألباني",
  "الشعراوي",
  "محمد الغزالي",
  "عبد الرزاق البدر",
  "صالح الفوزان",
  "عمر عبد الكافي",
  "محمد حسان",
  "أيمن سويد",
].map((s) => ({ label: s, query: s }));

function LecturesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      <header className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold">دروس ومحاضرات صوتية</h1>
        <p className="text-muted-foreground text-sm">
          مكتبة صوتية لكبار العلماء تُجلب مباشرة من الأرشيف مع توثيق المرجع لكل مادة.
        </p>
      </header>
      <ArchiveBrowser topics={SCHOLARS} mediatype="audio" />
    </div>
  );
}