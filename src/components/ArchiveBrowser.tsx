import { useEffect, useState } from "react";
import { ChevronLeft, FileText, Loader2, Search, Play, BookOpen } from "lucide-react";
import { AudioPlayer } from "@/components/AudioPlayer";
import { DownloadButton } from "@/components/DownloadButton";
import { cleanText, prettyName, extOf, objectUrlOf } from "@/lib/media";
import {
  searchArchive,
  getArchiveFiles,
  audioFiles,
  textFiles,
  fileUrl,
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
  const [err, setErr] = useState<string | null>(null);
  const [selected, setSelected] = useState<ArchiveDoc | null>(null);

  useEffect(() => {
    let alive = true;
    setDocs(null);
    setErr(null);
    searchArchive({ query: `"${topic.query}"`, mediatype, rows: 24 })
      .then((r) => alive && setDocs(r.docs))
      .catch(() => alive && setErr("تعذّر تحميل النتائج، حاول مرة أخرى."));
    return () => {
      alive = false;
    };
  }, [topic, mediatype]);

  if (selected) return <ItemView doc={selected} mediatype={mediatype} onBack={() => setSelected(null)} />;

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* شريط بحث مدمج */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const q = custom.trim();
          if (q) setTopic({ label: q, query: q });
        }}
        className="flex items-stretch overflow-hidden rounded-full border border-border bg-card focus-within:border-foreground transition-colors"
      >
        <div className="relative flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="ابحث عن عالم أو عنوان..."
            className="w-full bg-transparent py-3 pr-11 pl-3 text-sm outline-none"
          />
        </div>
        <button type="submit" className="bg-foreground text-background px-6 text-sm font-bold transition-transform active:scale-95">
          بحث
        </button>
      </form>

      {/* أزرار متصلة ببعضها */}
      <div className="flex flex-wrap overflow-hidden rounded-2xl border border-border bg-card">
        {topics.map((t) => (
          <button
            key={t.label}
            onClick={() => setTopic(t)}
            className={`flex-1 min-w-[33%] sm:min-w-[20%] border-l border-b border-border last:border-l-0 px-3 py-2.5 text-sm transition-all duration-300 ${
              topic.label === t.label ? "bg-foreground text-background font-bold" : "md:hover:bg-muted"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {err && <div className="text-destructive text-sm text-center">{err}</div>}
      {!docs && !err && (
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}
      {docs && docs.length === 0 && (
        <div className="text-center text-muted-foreground py-10 text-sm">{emptyHint ?? "لا توجد نتائج."}</div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {docs?.map((d, i) => (
          <button
            key={d.identifier}
            onClick={() => setSelected(d)}
            style={{ animationDelay: `${Math.min(i, 12) * 35}ms` }}
            className="animate-in fade-in slide-in-from-bottom-2 fill-mode-backwards duration-500 text-right rounded-2xl border border-border bg-card p-4 transition-all md:hover:bg-foreground md:hover:text-background md:hover:-translate-y-0.5 active:scale-[0.99]"
          >
            <div className="font-bold leading-relaxed line-clamp-2">{cleanText(d.title) || d.identifier}</div>
            <div className="text-xs text-muted-foreground mt-2 line-clamp-1 md:group-hover:text-background">
              {cleanText(creatorOf(d))}
            </div>
            <div className="mt-3 inline-flex items-center gap-1 text-xs">
              {mediatype === "audio" ? <Play className="h-3.5 w-3.5" /> : <BookOpen className="h-3.5 w-3.5" />}
              {mediatype === "audio" ? "استماع وتحميل" : "قراءة وتحميل"}
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
  const [openFile, setOpenFile] = useState<ArchiveFile | null>(null);

  useEffect(() => {
    setFiles(null);
    getArchiveFiles(doc.identifier)
      .then(setFiles)
      .catch(() => setErr("تعذّر تحميل الملفات."));
  }, [doc.identifier]);

  const list = files ? (mediatype === "audio" ? audioFiles(files) : textFiles(files)) : null;
  const title = cleanText(doc.title) || doc.identifier;

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <button onClick={onBack} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ChevronLeft className="h-4 w-4 rotate-180" /> رجوع للنتائج
      </button>
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold leading-relaxed">{title}</h2>
        <div className="text-sm text-muted-foreground mt-1">{cleanText(creatorOf(doc))}</div>
      </div>

      {track && (
        <AudioPlayer
          src={fileUrl(doc.identifier, track.name)}
          title={cleanText(track.title) || prettyName(track.name)}
          subtitle={title}
          downloadName={prettyName(track.name)}
        />
      )}

      {err && <div className="text-destructive text-sm">{err}</div>}
      {!list && !err && (
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-border bg-card divide-y divide-border">
        {list?.map((f) => {
          const url = fileUrl(doc.identifier, f.name);
          const name = cleanText(f.title) || prettyName(f.name);
          const active = mediatype === "audio" ? track?.name === f.name : openFile?.name === f.name;
          return (
            <div
              key={f.name}
              className={`flex items-center gap-3 px-4 py-3 transition-colors ${active ? "bg-foreground text-background" : ""}`}
            >
              <button
                onClick={() => (mediatype === "audio" ? setTrack(f) : setOpenFile(f))}
                className="flex flex-1 items-center gap-2 text-right text-sm min-w-0"
              >
                {mediatype === "audio" ? <Play className="h-4 w-4 shrink-0" /> : <FileText className="h-4 w-4 shrink-0" />}
                <span className="truncate">{name}</span>
                <span className="text-[10px] opacity-60 uppercase shrink-0">{extOf(f.name)}</span>
              </button>
              <DownloadButton url={url} filename={f.name} variant="icon" label={`تحميل ${name}`} />
            </div>
          );
        })}
      </div>

      {list && list.length === 0 && (
        <div className="text-sm text-muted-foreground">لا توجد ملفات متاحة في هذا العنصر.</div>
      )}

      {openFile && (
        <FileReader
          url={fileUrl(doc.identifier, openFile.name)}
          name={openFile.name}
          onClose={() => setOpenFile(null)}
        />
      )}
    </div>
  );
}

function FileReader({ url, name, onClose }: { url: string; name: string; onClose: () => void }) {
  const ext = extOf(name);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [text, setText] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    let created: string | null = null;
    setBlobUrl(null);
    setText(null);
    setFailed(false);

    if (ext === "txt") {
      fetch(url)
        .then((r) => r.text())
        .then((t) => alive && setText(cleanText(t)))
        .catch(() => alive && setFailed(true));
    } else if (ext === "pdf" || ext === "epub") {
      objectUrlOf(url)
        .then((u) => {
          created = u;
          if (alive) setBlobUrl(u);
          else URL.revokeObjectURL(u);
        })
        .catch(() => alive && setFailed(true));
    }
    return () => {
      alive = false;
      if (created) URL.revokeObjectURL(created);
    };
  }, [url, ext]);

  const office = ["doc", "docx", "ppt", "pptx", "xls", "xlsx"].includes(ext);

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm animate-in fade-in duration-200 flex flex-col">
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <button onClick={onClose} className="rounded-full border border-border px-4 py-1.5 text-sm md:hover:bg-muted transition">
          إغلاق
        </button>
        <div className="flex-1 truncate text-sm font-bold">{prettyName(name)}</div>
        <DownloadButton url={url} filename={name} variant="solid" label="تحميل" />
      </div>

      <div className="flex-1 overflow-auto">
        {failed && (
          <div className="p-8 text-center text-sm text-muted-foreground">
            تعذّر العرض داخل الموقع لهذا الملف — يمكنك تحميله من الزر بالأعلى.
          </div>
        )}
        {office && (
          <iframe
            title={name}
            className="h-full w-full"
            src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`}
          />
        )}
        {ext === "txt" &&
          (text === null && !failed ? (
            <Spinner />
          ) : (
            <pre className="mx-auto max-w-3xl whitespace-pre-wrap p-6 text-base leading-loose font-sans">{text}</pre>
          ))}
        {(ext === "pdf" || ext === "epub") &&
          (blobUrl ? (
            <iframe title={name} className="h-full w-full" src={blobUrl} />
          ) : (
            !failed && <Spinner />
          ))}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex h-full items-center justify-center py-16">
      <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
    </div>
  );
}
