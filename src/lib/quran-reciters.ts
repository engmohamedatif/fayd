// Classic reciters via mp3quran.net (full-surah audio) + verse-by-verse via alquran.cloud
export type MP3Reciter = {
  id: string;
  name: string;
  server: string; // ends with /
};

// Curated legendary reciters (mp3quran servers). Files: `${server}${padded_surah}.mp3`
export const MP3_RECITERS: MP3Reciter[] = [
  { id: "yasser", name: "ياسر الدوسري", server: "https://server11.mp3quran.net/yasser/" },
  { id: "minsh", name: "محمد صديق المنشاوي (مرتل)", server: "https://server10.mp3quran.net/minsh/" },
  { id: "minsh-mjw", name: "محمد صديق المنشاوي (مجود)", server: "https://server10.mp3quran.net/minsh/Almusshaf-Al-Mojawwad/" },
  { id: "abdulbasit-mjw", name: "عبد الباسط عبد الصمد (مجود)", server: "https://server7.mp3quran.net/basit/Almusshaf-Al-Mojawwad/" },
  { id: "tblawi", name: "محمد الطبلاوي", server: "https://server12.mp3quran.net/tblawi/Al-Mojawwad/" },
  { id: "mustafa", name: "الشيخ مصطفى إسماعيل", server: "https://server8.mp3quran.net/mustafa/Almusshaf-Al-Mojawwad/" },
  { id: "refat", name: "الشيخ محمد رفعت", server: "https://server14.mp3quran.net/refat/" },
  { id: "bna", name: "الشيخ محمود علي البنا", server: "https://server8.mp3quran.net/bna/Almusshaf-Al-Mojawwad/" },
];

export function surahAudioUrl(server: string, surahNumber: number) {
  return `${server}${String(surahNumber).padStart(3, "0")}.mp3`;
}

// Verse-by-verse (alquran.cloud) — for auto-advance ayah-by-ayah playback
export const VERSE_RECITERS: { identifier: string; name: string }[] = [
  { identifier: "ar.alafasy", name: "مشاري العفاسي" },
  { identifier: "ar.abdulsamad", name: "عبد الباسط عبد الصمد" },
  { identifier: "ar.husary", name: "محمود خليل الحصري" },
  { identifier: "ar.husarymujawwad", name: "الحصري (مجود)" },
  { identifier: "ar.mahermuaiqly", name: "ماهر المعيقلي" },
  { identifier: "ar.abdurrahmaansudais", name: "عبد الرحمن السديس" },
  { identifier: "ar.saoodshuraym", name: "سعود الشريم" },
  { identifier: "ar.ahmedajamy", name: "أحمد العجمي" },
  { identifier: "ar.hanirifai", name: "هاني الرفاعي" },
  { identifier: "ar.hudhaify", name: "علي الحذيفي" },
  { identifier: "ar.muhammadayyoub", name: "محمد أيوب" },
  { identifier: "ar.muhammadjibreel", name: "محمد جبريل" },
  { identifier: "ar.shaatree", name: "أبو بكر الشاطري" },
  { identifier: "ar.abdullahbasfar", name: "عبد الله بصفر" },
  { identifier: "ar.ibrahimakhbar", name: "إبراهيم الأخضر" },
];