const MIMES: Record<string, string> = {
  ".avif": 'image/avif',
  ".css": 'text/css',
  ".gif": 'image/gif',
  ".ico": 'image/x-icon',
  ".jpeg": 'image/jpeg',
  ".jpg": 'image/jpeg',
  ".js": 'text/javascript',
  ".json": 'application/json',
  ".mjs": 'text/javascript',
  ".mp4": 'video/mp4',
  ".png": 'image/png',
  ".svg": 'image/svg+xml',
  ".tif": 'image/tiff',
  ".tiff": 'image/tiff',
  ".webm": 'video/webm',
  ".weba": 'audio/webm',
  ".webp": 'image/webp',
  ".woff": 'font/woff',
  ".woff2": 'font/woff2',
};

export function getMime(ext: string) {
  return MIMES[ext];
}