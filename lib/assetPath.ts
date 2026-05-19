export function assetPath(src: string): string {
  if (!src) return src;
  if (src.startsWith("http")) return src;
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}${src}`;
}
