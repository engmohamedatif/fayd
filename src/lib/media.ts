const ENTITIES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", laquo: "«", raquo: "»",
  hellip: "…", mdash: "—", ndash: "–", rsquo: "’", lsquo: "‘", ldquo: "“", rdquo: "”",
};

function decodeEntities(s: string) {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m);
}

/** يصلح النصوص القادمة من الواجهات: وسوم HTML، الرموز المشفّرة، والحروف المكسورة. */
export function cleanText(input?: string | null): string {
  if (!input) return "";
  let s = String(input);
  s = s.replace(/<\s*(br|\/p|\/div|\/li)\s*\/?>/gi, "\n");
  s = s.replace(/<[^>]+>/g, " ");
  s = decodeEntities(s);
  // إصلاح ترميز عربي مكسور (UTF-8 مقروء كـ latin1)
  if (/[ÃØÙÛ][\u0080-\u00BF]/.test(s)) {
    try {
      const bytes = Uint8Array.from([...s].map((c) => c.charCodeAt(0) & 0xff));
      const fixed = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
      if (/[\u0600-\u06FF]/.test(fixed)) s = fixed;
    } catch { /* تجاهل */ }
  }
  s = s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFD]/g, "");
  s = s.replace(/\[\d+\]/g, "");
  s = s.replace(/[ \t\u00A0]+/g, " ").replace(/\n{3,}/g, "\n\n");
  return s.trim();
}

export function prettyName(name: string) {
  return cleanText(decodeURIComponent(name).replace(/[_-]+/g, " ").replace(/\.[a-z0-9]+$/i, ""));
}

export function extOf(name: string) {
  const m = name.match(/\.([a-z0-9]+)$/i);
  return m ? m[1].toLowerCase() : "";
}

/** تنزيل أي ملف فعليًا إلى الجهاز (بدون فتح تبويب جديد). */
export async function downloadFile(url: string, filename: string, onProgress?: (p: number) => void) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("failed");
    const total = Number(res.headers.get("content-length") || 0);
    let blob: Blob;
    if (res.body && total > 0 && onProgress) {
      const reader = res.body.getReader();
      const chunks: BlobPart[] = [];
      let loaded = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value as unknown as BlobPart);
        loaded += value!.length;
        onProgress(Math.min(100, Math.round((loaded / total) * 100)));
      }
      blob = new Blob(chunks);
    } else {
      blob = await res.blob();
    }
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(href), 4000);
  } catch {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.target = "_blank";
    a.rel = "noreferrer";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
}

/** يجلب الملف كـ blob URL لعرضه داخل الموقع. */
export async function objectUrlOf(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("failed");
  return URL.createObjectURL(await res.blob());
}
