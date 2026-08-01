import { useEffect, useState } from "react";
import { ChevronLeft, ExternalLink, FileText, Loader2, Search, Play } from "lucide-react";
import { AudioPlayer } from "@/components/AudioPlayer";
import {
  searchArchive,
  getArchiveFiles,
  audioFiles,
  textFiles,
  fileUrl,
  itemUrl,
  creatorOf,
  type ArchiveDoc,
  type ArchiveFile,
} from "@/lib/archive";

type Topic = { label: string; query: string };

type Props = {
  topics: Topic[];
  mediatype: "audio" | "texts";
  emptyHint?: string;
};

export function ArchiveBrowser({ topics, mediatype, emptyHint }: Props) {
  const [topic, setTopic] = useState<Topic>(topics[0]);
  const [custom, setCustom] = useState("");
  const [docs, setDocs] = useState<ArchiveDoc[] | null>(null);
  const [total, setTotal] = useState(0);
  const [err, setErr] = useState<string | null>(null);
  const [selected, setSelected] = useState<ArchiveDoc | null>(null);

  useEffect(() => {
    let alive = true;
    setDocs(null);
    setErr(null);
    searchArchive({ query: `"${topic.query}"`, mediatype, rows: 24 })
      .then((r) => {
        if (!alive) return;
        setDocs(r.docs);
        setTotal(r.total);
      })
      .catch(() => alive && setErr("تعذّر تحميل النتائج، حاول مرة أخرى."));
    return () => {
      alive = false;
    };
  }, [topic, mediatype]);

  if (selected) return <ItemView doc={selected} mediatype={mediatype} onBack={() => setSelected(null)} />;

  return (
    <div className="space-y-5">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const q = custom.trim();
          if (q) setTopic({ label: q, query: q });
        }}
        className="flex items-center gap-2"
      >
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="ابحث عن عالم أو عنوان..."
            className="w-full rounded-full border border-border bg-card py-2.5 pr-10 pl-4 text-sm outline-none focus:border-foreground"
          />
        </div>
        <button type="submit" className="rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-bold">
          بحث
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {topics.map((t) => (
          <button
            key={t.label}
            onClick={() => setTopic(t)}
            className={`rounded-full border border-border px-4 py-1.5 text-sm transition ${
              topic.label === t.label ? "bg-foreground text-background" : "md:hover:bg-muted"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="text-xs text-muted-foreground">
        {docs ? `${docs.length} نتيجة معروضة من أصل ${total.toLocaleString("ar-EG")}` : "جاري البحث..."} — المصدر:
        أرشيف الإنترنت (archive.org)
      </div>

      {err && <div className="text-destructive text-sm">{err}</div>}
      {!docs && !err && (
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}
      {docs && docs.length === 0 && (
        <div className="text-center text-muted-foreground py-10 text-sm">{emptyHint ?? "لا توجد نتائج."}</div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {docs?.map((d) => (
          <button
            key={d.identifier}
            onClick={() => setSelected(d)}
            className="text-right rounded-2xl border border-border bg-card p-4 md:hover:bg-muted transition"
          >
            <div className="font-bold leading-relaxed line-clamp-2">{d.title ?? d.identifier}</div>
            <div className="text-xs text-muted-foreground mt-2 line-clamp-1">{creatorOf(d)}</div>
            <div className="mt-3 inline-flex items-center gap-1 text-xs">
              {mediatype === "audio" ? <Play className="h-3.5 w-3.5" /> : <FileText className="h-3.5 w-3.5" />}
              {mediatype === "audio" ? "استماع" : "تصفح الكتاب"}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ItemView({
  doc,
  mediatype,
  onBack,
}: {
  doc: ArchiveDoc;
  mediatype: "audio" | "texts";
  onBack: () => void;
}) {
  const [files, setFiles] = useState<ArchiveFile[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [track, setTrack] = useState<ArchiveFile | null>(null);

  useEffect(() => {
    setFiles(null);
    getArchiveFiles(doc.identifier)
      .then(setFiles)
      .catch(() => setErr("تعذّر تحميل الملفات."));
  }, [doc.identifier]);

  const list = files ? (mediatype === "audio" ? audioFiles(files) : textFiles(files)) : null;

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-4 w-4 rotate-180" /> رجوع للنتائج
      </button>
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold leading-relaxed">{doc.title ?? doc.identifier}</h2>
        <div className="text-sm text-muted-foreground mt-1">{creatorOf(doc)}</div>
      </div>

      {track && (
        <AudioPlayer src={fileUrl(doc.identifier, track.name)} title={track.title || track.name} subtitle={doc.title} />
      )}

      {err && <div className="text-destructive text-sm">{err}</div>}
      {!list && !err && (
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {mediatype === "audio" ? (
        <div className="space-y-2">
          {list?.map((f) => (
            <button
              key={f.name}
              onClick={() => setTrack(f)}
              className={`w-full text-right rounded-xl border border-border px-4 py-3 text-sm transition ${
                track?.name === f.name ? "bg-foreground text-background" : "md:hover:bg-muted"
              }`}
            >
              {f.title || f.name}
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {list?.map((f) => (
            <a
              key={f.name}
              href={fileUrl(doc.identifier, f.name)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl border border-border px-4 py-3 text-sm md:hover:bg-muted"
            >
              <FileText className="h-4 w-4 shrink-0" /> {f.name}
            </a>
          ))}
        </div>
      )}

      {list && list.length === 0 && (
        <div className="text-sm text-muted-foreground">لا توجد ملفات قابلة للتشغيل في هذا العنصر.</div>
      )}

      <div className="pt-3 border-t border-border text-xs text-muted-foreground space-y-1">
        <a href={itemUrl(doc.identifier)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-foreground">
          <ExternalLink className="h-3.5 w-3.5" /> صفحة المرجع الأصلية
        </a>
        <div>المرجع: أرشيف الإنترنت — المُعرِّف: {doc.identifier}</div>
      </div>
    </div>
  );
}