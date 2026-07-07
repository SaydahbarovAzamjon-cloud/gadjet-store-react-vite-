// Backend rasm yo'llari nisbiy bo'lib keladi (masalan "uploads/products/xxx.jpg").
// Prod build'da (serve dist) Vite proxy yo'q, shuning uchun to'liq manzil kerak:
//   http://localhost:2005/uploads/products/xxx.jpg  (VITE_API_URL dan olinadi)
//
// Bu yordamchi:
//  - to'liq URL (http/https), data:, blob: yo'llarga tegmaydi (fallback rasmlar, upload preview)
//  - nisbiy yo'llarga backend prefiksini qo'yadi
const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export function getImageUrl(path?: string | null): string {
  if (!path) return "";
  // Allaqachon to'liq manzil bo'lsa — o'zgartirmaymiz
  if (/^(https?:|data:|blob:)/i.test(path) || path.startsWith("//")) return path;
  // Nisbiy yo'l — bitta '/' bilan backendga ulaymiz
  return `${API_URL}/${path.replace(/^\//, "")}`;
}
