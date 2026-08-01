/**
 * A small, deterministic palette used for two things:
 *  1. The design system (see apps/web/src/styles/tokens.css for the CSS
 *     custom properties derived from these values).
 *  2. Deterministic product placeholder images: every product is assigned
 *     one of these colors (hashed from its slug) and rendered client-side
 *     as an SVG with the product's initial, so the catalog always has
 *     coherent, non-broken imagery even without real product photography.
 */
export const PLACEHOLDER_PALETTE = [
  "#2F5D50", // deep green
  "#C2571B", // burnt orange (brand accent)
  "#1F4E79", // deep blue
  "#7A3E9D", // plum
  "#A32638", // brick red
  "#4A5859", // slate
  "#8C6D1F", // ochre
  "#2E6F95", // teal blue
] as const;

export function pickPlaceholderColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return PLACEHOLDER_PALETTE[hash % PLACEHOLDER_PALETTE.length];
}
