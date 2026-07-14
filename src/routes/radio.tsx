import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Radio as RadioIcon } from "lucide-react";
import { AudioPlayer } from "@/components/AudioPlayer";

export const Route = createFileRoute("/radio")({
  head: () => ({
    meta: [
      { title: "إذاعة القرآن الكريم مباشر - فيض" },
      { name: "description", content: "استمع لإذاعة القرآن الكريم مباشر من القاهرة." },
    ],
  }),
  component: RadioPage,
});

const STREAM = "https://n11.radiojar.com/8s5u5tpdtwzuv";

function RadioPage() {
  const [streamUrl] = useState(() => STREAM + "?t=" + Date.now());
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <div className="h-32 w-32 rounded-full bg-foreground text-background flex items-center justify-center">
              <RadioIcon className="h-14 w-14" />
            </div>
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-extrabold">إذاعة القرآن الكريم</h1>
          <p className="text-sm text-muted-foreground mt-1">بث مباشر من القاهرة</p>
        </div>
        <AudioPlayer src={streamUrl} live title="إذاعة القرآن الكريم" subtitle="القاهرة" />
      </div>
    </div>
  );
}