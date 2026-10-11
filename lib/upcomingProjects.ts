// Case study slugs for projects that aren't finished yet. Their cards sit at the
// bottom of the homepage, look muted, show "Coming soon" and don't link to the
// (unfinished) case study. Remove a slug from this list when it's ready to launch.
const UPCOMING_SLUGS = new Set([
  "qlair",
  "skyroam-solis",
  "wwf---the-tree-of-hope",
]);

export function isUpcoming(slug?: string | null): boolean {
  return !!slug && UPCOMING_SLUGS.has(slug);
}
