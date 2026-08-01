import { createFileRoute } from "@tanstack/react-router";
import { ArchiveBrowser } from "@/components/ArchiveBrowser";

export const Route = createFileRoute("/books")({
  head: () => ({
    meta: [
      { title: "مكتبة الكتب الإسلامية - فيض" },
      { name: "description", content: "مكتبة كتب إسلامية في التفسير والحديث والفقه والعقيدة والسيرة بمصادر موثقة." },
      { property: "og:title", content: "مكتبة الكتب الإسلامية - فيض" },
      { property: "og:description", content: "تصفح وحمّل أمهات الكتب الإسلامية مع توثيق المرجع." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BooksPage,
});

const TOPICS = [
  "التفسير",
  "الحديث",
  "الفقه",
  "العقيدة",
  "السيرة النبوية",
  "أصول الفقه",
  "علوم القرآن",
  "الرقائق",
  "التجويد",
  "الفتاوى",
].map((t) => ({ label: t, query: t }));

function BooksPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      <header className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold">مكتبة الكتب</h1>
        <p className="text-muted-foreground text-sm">
          كتب إسلامية بصيغة PDF مصنّفة حسب الفن، مع رابط المرجع الأصلي لكل كتاب.
        </p>
      </header>
      <ArchiveBrowser topics={TOPICS} mediatype="texts" />
    </div>
  );
}