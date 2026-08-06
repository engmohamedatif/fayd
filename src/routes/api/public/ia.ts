import { createFileRoute } from "@tanstack/react-router";

const ALLOWED = /(^|\.)archive\.org$/i;

async function proxy(request: Request, method: "GET" | "HEAD") {
  const target = new URL(request.url).searchParams.get("u");
  if (!target) return new Response("missing u", { status: 400 });

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return new Response("bad url", { status: 400 });
  }
  if (parsed.protocol !== "https:" || !ALLOWED.test(parsed.hostname)) {
    return new Response("forbidden host", { status: 403 });
  }

  const headers: Record<string, string> = { "user-agent": "Mozilla/5.0 (compatible; FaydApp/1.0)" };
  const range = request.headers.get("range");
  if (range) headers["range"] = range;

  const upstream = await fetch(parsed.toString(), { method, headers, redirect: "follow" });

  const out = new Headers();
  for (const key of ["content-type", "content-length", "content-range", "accept-ranges", "last-modified", "etag"]) {
    const value = upstream.headers.get(key);
    if (value) out.set(key, value);
  }
  out.set("access-control-allow-origin", "*");
  out.set("cache-control", "public, max-age=3600");
  out.delete("content-disposition");

  return new Response(method === "HEAD" ? null : upstream.body, { status: upstream.status, headers: out });
}

export const Route = createFileRoute("/api/public/ia")({
  server: {
    handlers: {
      GET: ({ request }) => proxy(request, "GET"),
      HEAD: ({ request }) => proxy(request, "HEAD"),
    },
  },
});
