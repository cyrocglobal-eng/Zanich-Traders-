export const publicSite = {
  url: (
    process.env.NEXT_PUBLIC_SITE_URL || "https://zanichtraders.co.ke"
  ).replace(/\/$/, ""),
  indexable: process.env.SITE_INDEXABLE === "true",
};
export function absoluteUrl(path: string) {
  return new URL(path, `${publicSite.url}/`).toString();
}
