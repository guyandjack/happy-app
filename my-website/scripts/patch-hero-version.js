// Patch index.html hero image URLs to include ?v=<YYYY-season>
// Tries to read backend/public/images/landingPage/version.json written by the scheduler.
// Falls back to computing the season locally if absent.

import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.join(__dirname, '..');
const INDEX_HTML = path.join(ROOT, 'index.html');
const VERSION_JSON = path.join(ROOT, 'backend', 'public', 'images', 'landingPage', 'version.json');

function seasonFor(date = new Date()) {
  const y = date.getUTCFullYear();
  const utc = (m, d) => Date.UTC(y, m - 1, d, 0, 0, 0);
  const now = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0);
  const D21 = utc(12, 21);
  const M21 = utc(3, 21);
  const J21 = utc(6, 21);
  const S21 = utc(9, 21);
  if (now >= D21 || now < M21) return 'winter';
  if (now >= M21 && now < J21) return 'spring';
  if (now >= J21 && now < S21) return 'summer';
  return 'autumn';
}

function seasonVersion(date = new Date()) {
  return `${date.getUTCFullYear()}-${seasonFor(date)}`;
}

async function getVersion() {
  try {
    const raw = await readFile(VERSION_JSON, 'utf8');
    const obj = JSON.parse(raw);
    if (obj && typeof obj.version === 'string' && obj.version.trim()) return obj.version.trim();
  } catch {}
  return seasonVersion();
}

function patchHtml(html, version) {
  const re = /(https:\/\/api\.helveclick\.ch\/images\/landingPage\/(500|1000|1500|2000)\.webp)(?:\?v=[^\s"'>]*)?/g;
  return html.replace(re, (_m, base) => `${base}?v=${version}`);
}

async function main() {
  const v = await getVersion();
  const html = await readFile(INDEX_HTML, 'utf8');
  const patched = patchHtml(html, v);
  if (patched !== html) {
    await writeFile(INDEX_HTML, patched, 'utf8');
    console.log(`[patch-hero-version] Updated index.html with v=${v}`);
  } else {
    console.log('[patch-hero-version] No changes needed');
  }
}

main().catch((e) => {
  console.error('[patch-hero-version] Failed:', e);
  process.exitCode = 1;
});

