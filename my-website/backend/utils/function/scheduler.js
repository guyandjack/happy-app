// utils/function/scheduler.js (CommonJS)
const cron = require("node-cron");
const fs = require("fs/promises");
const path = require("path");

// Racines (on part de ce fichier : utils/function/)
const PROJECT_ROOT = path.join(__dirname, "..", "..");
const PUBLIC_ROOT = path.join(PROJECT_ROOT, "public");
const LP_DIR = path.join(PUBLIC_ROOT, "images", "landingPage"); // ./public/images/landingPage

// Mapping URL -> fichiers saison
const WIDTH_MAP = [
  { urlName: "500", pxName: "700px" }, // 500 -> 700px
  { urlName: "1000", pxName: "1000px" },
  { urlName: "1500", pxName: "1500px" },
  { urlName: "2000", pxName: "2000px" },
];

// Détermine la saison à partir de la date (bornes fixes)
function seasonFor(date = new Date()) {
  const y = date.getUTCFullYear();
  const utc = (m, d) => Date.UTC(y, m - 1, d, 0, 0, 0);
  const now = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    0,
    0,
    0
  );

  const D21 = utc(12, 21);
  const M21 = utc(3, 21);
  const J21 = utc(6, 21);
  const S21 = utc(9, 21);

  if (now >= D21 || now < M21) return "winter";
  if (now >= M21 && now < J21) return "spring";
  if (now >= J21 && now < S21) return "summer";
  return "autumn";
}

// Création remplaçante atomique : hardlink -> symlink -> copy, puis rename
async function atomicPoint(linkPath, targetPath) {
  // Vérifie l'existence de la cible
  await fs.access(targetPath);

  const dir = path.dirname(linkPath);
  const tmp = path.join(dir, `.tmp-${path.basename(linkPath)}-${Date.now()}`);

  // 1) Créer un "lien" temporaire
  try {
    // Hard link (meilleure compat cross-OS, même volume)
    await fs.link(targetPath, tmp);
  } catch {
    try {
      // Symlink relatif (parfait sur Linux/macOS)
      const rel = path.relative(dir, targetPath) || path.basename(targetPath);
      await fs.symlink(rel, tmp);
    } catch {
      // Copie (dernier recours)
      await fs.copyFile(targetPath, tmp);
    }
  }

  // 2) Rename -> atomique sur POSIX si la destination n'existe pas
  try {
    await fs.rename(tmp, linkPath);
    return;
  } catch {
    // 3) Compat Windows : supprimer si existe, puis rename
    try {
      await fs.rm(linkPath, { force: true });
      await fs.rename(tmp, linkPath);
    } catch (e) {
      try {
        await fs.rm(tmp, { force: true });
      } catch {}
      throw e;
    }
  }
}

// Pointe les 4 fichiers (500/1000/1500/2000 .webp) vers la saison donnée
async function pointLandingPageToSeason(season) {
  // S'assure que le dossier existe
  await fs.mkdir(LP_DIR, { recursive: true });

  const tasks = WIDTH_MAP.map(async ({ urlName, pxName }) => {
    const target = path.join(LP_DIR, `index-${season}-${pxName}.webp`);
    const link = path.join(LP_DIR, `${urlName}.webp`);
    await atomicPoint(link, target);
  });

  await Promise.all(tasks);
  // Log simple (utilise ton logger si tu veux)
  console.log(
    `[seasonal] landingPage -> ${season} @ ${new Date().toISOString()}`
  );
}

// Optionnel : garantir un placeholder 1x1.webp (utile pour le fallback)
async function ensurePlaceholder() {
  const ph = path.join(LP_DIR, "placeholder-1x1.webp");
  try {
    await fs.access(ph);
  } catch {
    // petit pixel WebP minimal (tu peux le remplacer par ton fichier)
    const onePixelWebP = Buffer.from(
      "52494646DA0000005745425056503820D2000000300000002F0000001000000000000000000000002F0000002F000000100000000000000000000000",
      "hex"
    );
    await fs.writeFile(ph, onePixelWebP);
  }
}

// Lance tout : bascule immédiate + cron quotidien
async function startScheduler() {
  try {
    await ensurePlaceholder();
    await pointLandingPageToSeason(seasonFor());
  } catch (e) {
    console.error("[seasonal] initial switch failed:", e);
  }

  // Tous les 21 du mois à 00:00 Europe/Zurich
  cron.schedule(
    "0 0 21 * *",
    async () => {
      try {
        await pointLandingPageToSeason(seasonFor());
      } catch (e) {
        console.error("[seasonal] daily switch failed:", e);
      }
    },
    { timezone: "Europe/Zurich" }
  );
}

module.exports = {
  LP_DIR,
  seasonFor,
  pointLandingPageToSeason,
  startScheduler,
};
