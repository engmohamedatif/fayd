import { createFileRoute } from "@tanstack/react-router";
import { NextPrayerWidget } from "@/components/NextPrayerWidget";

export const Route = createFileRoute("/prayer-times")({
  head: () => ({ meta: [{ title: "مواقيت الصلاة - فيض" }, { name: "description", content: "مواقيت الصلاة حسب موقعك." }] }),
  component: () => (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      <h1 className="text-2xl md:text-3xl font-extrabold text-center">مواقيت الصلاة</h1>
      <NextPrayerWidget />
    </div>
  ),
});