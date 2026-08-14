export type ArchiveDoc = {
  identifier: string;
  title?: string;
  creator?: string | string[];
  year?: string;
  downloads?: number;
};

const SEARCH = "https://archive.org/advancedsearch.php";

export async function searchArchive(opts: {
  query: string;
  mediatype: "audio" | "texts";
  rows?: number;
  page?: number;
}): Promise<{ docs: ArchiveDoc[]; total: number }> {
  const formatFilter = opts.mediatype === "audio" ? "format:(MP3)" : "format:(PDF OR EPUB OR Text)";
  const params = new URLSearchParams({
    q: `title:(${opts.query}) AND mediatype:${opts.mediatype} AND ${formatFilter}`,
    rows: String(opts.rows ?? 20),
    page: String(opts.page ?? 1),
    output: "json",
  });
  params.append("sort[]", "downloads desc");
  ["identifier", "title", "creator", "year", "downloads"].forEach((f) => params.append("fl[]", f));
  const res = await fetch(`${SEARCH}?${params.toString()}`);
  if (!res.ok) throw new Error("archive search failed");
  const json = await res.json();
  return { docs: json?.response?.docs ?? [], total: json?.response?.numFound ?? 0 };
}

export type ArchiveFile = { name: string; format?: string; length?: string; title?: string; source?: string };

export async function getArchiveFiles(identifier: string): Promise<ArchiveFile[]> {
  const res = await fetch(`https://archive.org/metadata/${encodeURIComponent(identifier)}`);
  if (!res.ok) throw new Error("archive metadata failed");
  const json = await res.json();
  return (json?.files ?? []) as ArchiveFile[];
}

export function audioFiles(files: ArchiveFile[]) {
  return files.filter((f) => /\.(mp3|ogg|m4a)$/i.test(f.name));
}

export function textFiles(files: ArchiveFile[]) {
  const readable = files.filter((f) => {
    if (!/\.(pdf|epub|txt|doc|docx)$/i.test(f.name)) return false;
    if (/(_text|_bw|_searchable|_chocr|_djvu)\.pdf$/i.test(f.name)) return false;
    if (/(_djvu|_searchtext|_hocr|_chocr)\.txt$/i.test(f.name)) return false;
    return true;
  });

  return readable.sort((a, b) => {
    const rank = (file: ArchiveFile) => {
      const ext = file.name.split(".").pop()?.toLowerCase();
      const original = file.source === "original" ? 0 : 10;
      const type = ext === "pdf" ? 0 : ext === "epub" ? 2 : ext === "docx" ? 4 : ext === "doc" ? 5 : 6;
      return original + type;
    };
    return rank(a) - rank(b) || a.name.localeCompare(b.name, "ar", { numeric: true });
  });
}

export function fileUrl(identifier: string, name: string) {
  const direct = `https://archive.org/download/${encodeURIComponent(identifier)}/${encodeURIComponent(name)}`;
  return `/api/public/ia?u=${encodeURIComponent(direct)}`;
}

export function itemUrl(identifier: string) {
  return `https://archive.org/details/${encodeURIComponent(identifier)}`;
}

export function creatorOf(d: ArchiveDoc) {
  return Array.isArray(d.creator) ? d.creator.join("، ") : d.creator ?? "غير محدد";
}