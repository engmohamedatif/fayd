import { useEffect, useRef, useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { cleanText, extOf } from "@/lib/media";

type Props = { url: string; name: string };

export function DocumentViewer({ url, name }: Props) {
  const ext = extOf(name);
  const epubRoot = useRef<HTMLDivElement | null>(null);
  const pdfRoot = useRef<HTMLDivElement | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [pages, setPages] = useState(0);

  useEffect(() => {
    let alive = true;
    let cleanup: (() => void) | undefined;
    setContent(null);
    setLoading(true);
    setFailed(false);
    setPages(0);

    const load = async () => {
      try {
        if (ext === "txt") {
          const response = await fetch(url);
          if (!response.ok) throw new Error("fetch failed");
          if (alive) setContent(cleanText(await response.text()));
        } else if (ext === "pdf") {
          const pdfjs = await import("pdfjs-dist/build/pdf.min.mjs");
          pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
          const response = await fetch(url);
          if (!response.ok) throw new Error("fetch failed");
          const data = await response.arrayBuffer();
          const doc = await pdfjs.getDocument({ data }).promise;
          if (!alive || !pdfRoot.current) return void doc.cleanup();
          const host = pdfRoot.current;
          host.innerHTML = "";
          setPages(doc.numPages);
          const width = Math.min(host.clientWidth || 900, 1000);
          const limit = Math.min(doc.numPages, 40);
          for (let i = 1; i <= limit; i++) {
            if (!alive) break;
            const page = await doc.getPage(i);
            const base = page.getViewport({ scale: 1 });
            const viewport = page.getViewport({ scale: width / base.width });
            const canvas = document.createElement("canvas");
            canvas.width = Math.floor(viewport.width);
            canvas.height = Math.floor(viewport.height);
            canvas.className = "mx-auto mb-4 w-full max-w-4xl rounded-lg border border-border bg-white";
            host.appendChild(canvas);
            const ctx = canvas.getContext("2d");
            if (ctx) await page.render({ canvas, canvasContext: ctx, viewport }).promise;
            if (i === 1 && alive) setLoading(false);
          }
          cleanup = () => { host.innerHTML = ""; void doc.cleanup(); };
        } else if (ext === "doc" || ext === "docx") {
          const [response, mammoth] = await Promise.all([fetch(url), import("mammoth/mammoth.browser")]);
          if (!response.ok) throw new Error("fetch failed");
          const result = await mammoth.convertToHtml({ arrayBuffer: await response.arrayBuffer() });
          if (alive) setContent(result.value);
        } else if (ext === "epub") {
          const [response, ePubModule] = await Promise.all([fetch(url), import("epubjs")]);
          if (!response.ok) throw new Error("fetch failed");
          const book = ePubModule.default(await response.arrayBuffer());
          if (!alive || !epubRoot.current) return;
          const rendition = book.renderTo(epubRoot.current, { width: "100%", height: "100%", spread: "none" });
          await rendition.display();
          cleanup = () => { rendition.destroy(); book.destroy(); };
        } else {
          throw new Error("unsupported");
        }
      } catch (error) {
        console.error("viewer", error);
        if (alive) setFailed(true);
      } finally {
        if (alive) setLoading(false);
      }
    };

    load();
    return () => { alive = false; cleanup?.(); };
  }, [ext, url]);

  if (failed) return <div className="flex min-h-[65dvh] flex-col items-center justify-center gap-4 p-8 text-center text-sm text-muted-foreground"><FileText className="h-10 w-10" /><p>تعذّر تجهيز معاينة هذا الملف على جهازك.</p><a href={url} target="_blank" rel="noreferrer" className="rounded-md bg-foreground px-5 py-2.5 font-bold text-background">فتح الملف مباشرة</a></div>;

  return (
    <div className="relative min-h-[75dvh] h-full bg-background">
      {loading && <div className="absolute inset-0 z-10 grid place-items-center bg-background"><Loader2 className="h-7 w-7 animate-spin text-muted-foreground" /></div>}
      {ext === "pdf" && (
        <div className="p-3 md:p-6">
          {pages > 0 && <div className="mb-3 text-center text-xs text-muted-foreground">{pages} صفحة</div>}
          <div ref={pdfRoot} />
        </div>
      )}
      {ext === "txt" && content !== null && <pre className="mx-auto max-w-4xl whitespace-pre-wrap p-6 font-sans text-base leading-loose md:p-10">{content}</pre>}
      {(ext === "doc" || ext === "docx") && content !== null && <article className="prose prose-neutral mx-auto max-w-4xl p-6 leading-loose md:p-10" dangerouslySetInnerHTML={{ __html: content }} />}
      {ext === "epub" && <div ref={epubRoot} className="h-[75dvh] w-full" />}
    </div>
  );
}