import localAssets from "./local-assets.json";

/**
 * Prefer bundled brand assets; resolve other Lovable assets against the configured CDN.
 *
 * Inside the Lovable sandbox the dev server proxies `/__l5e/assets-v1/*`
 * requests automatically. Outside that environment (e.g. Vercel) we need to
 * prefix the path with `VITE_ASSET_ORIGIN` so the browser fetches the image
 * from the correct CDN.
 */
export function assetUrl(asset: { url: string }): string {
  const local = (localAssets as Record<string, string>)[asset.url];
  if (local) return local;
  const origin = import.meta.env.VITE_ASSET_ORIGIN ?? "";
  // If the url is already absolute, return as-is.
  if (asset.url.startsWith("http")) return asset.url;
  return `${origin}${asset.url}`;
}
