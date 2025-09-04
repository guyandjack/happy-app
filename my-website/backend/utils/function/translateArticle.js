// translateArticle.js
const axios = require("axios");

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Traduit un contenu HTML via DeepL en conservant les balises.
 * @param {string} html - HTML complet à traduire
 * @param {object} opts
 * @param {string} [opts.sourceLang='FR']
 * @param {string} [opts.targetLang='EN']
 * @param {boolean} [opts.free=true] - api-free.deepl.com si true, sinon api.deepl.com
 * @param {string[]} [opts.ignoreTags=['code','pre','script','style','kbd','samp']]
 * @returns {Promise<string>}
 */
async function translateArticle(
  html,
  {
    sourceLang = "FR",
    targetLang = "EN",
    free = true,
    ignoreTags = ["code", "pre", "script", "style", "kbd", "samp"],
  } = {}
) {
  try {
    if (!process.env.DEEPL_API_KEY) {
      throw new Error("DEEPL_API_KEY manquant (variable d'environnement).");
    }
    if (typeof html !== "string" || html.trim().length === 0) {
      throw new Error("Paramètre 'html' invalide ou vide.");
    }

    const endpoint = free
      ? "https://api-free.deepl.com/v2/translate"
      : "https://api.deepl.com/v2/translate";

    const params = new URLSearchParams();
    params.append("auth_key", process.env.DEEPL_API_KEY);
    params.append("text", html);
    params.append("target_lang", targetLang.toUpperCase());
    if (sourceLang) params.append("source_lang", sourceLang.toUpperCase());
    params.append("tag_handling", "html");
    params.append("preserve_formatting", "1");
    params.append("split_sentences", "1");
    if (ignoreTags?.length) params.append("ignore_tags", ignoreTags.join(","));

    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      let res;
      try {
        res = await axios.post(endpoint, params.toString(), {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          validateStatus: () => true, // on gère nous-mêmes les statuts
          timeout: 15000,
        });
      } catch (err) {
        // Erreur réseau/timeout/etc.
        if (attempt < maxRetries) {
          await delay(500 * attempt);
          continue;
        }
        const code = err.code || err.response?.status;
        throw new Error(
          `Erreur réseau DeepL (tentative ${attempt}/${maxRetries})` +
            (code ? ` [${code}]` : "") +
            `: ${err.message}`
        );
      }

      if (res.status === 200) {
        const translated = res.data?.translations?.[0]?.text ?? "";
        return translated;
      }

      // 429 (rate limit) ou 5xx → retry avec backoff
      if ((res.status === 429 || res.status >= 500) && attempt < maxRetries) {
        await delay(500 * attempt);
        continue;
      }

      // Autres erreurs HTTP
      const body =
        typeof res.data === "string" ? res.data : JSON.stringify(res.data);
      throw new Error(`DeepL HTTP ${res.status}: ${body}`);
    }

    // Ne devrait pas arriver (boucle sort avec return/throw)
    throw new Error("DeepL: échec après retentatives");
  } catch (e) {
    // Normalisation du message pour le contrôleur appelant
    throw new Error(`translateArticle failed: ${e.message}`);
  }
}

module.exports = translateArticle;
