const fs = require("fs");
const path = require("path");

const articleAssetDirectory = "assets/articles";
const articleListUrls = ["/fr/articles-list.html", "/en/articles-list.html"];
const backendRoot = path.resolve(__dirname, "../..");
const frontendPublicRoot = path.resolve(backendRoot, "../public");
const backendPublicRoot = path.resolve(backendRoot, "public");

/**
 * Maps public URLs to the document root that is actually served in the current
 * environment. In production this must be the persistent frontend `dist`
 * directory, not the API project directory and never an HTTP URL.
 */
function resolveSitePublicRoot() {
  if (process.env.SITE_PUBLIC_ROOT) {
    return path.resolve(process.env.SITE_PUBLIC_ROOT);
  }

  // The repository layout is useful for local development. A standalone API
  // deployment only has backend/public, so keep that as a compatibility
  // fallback while requiring an explicit production publishing root below.
  if (fs.existsSync(frontendPublicRoot)) return frontendPublicRoot;
  return backendPublicRoot;
}

const sitePublicRoot = resolveSitePublicRoot();
const siteDistributionRoot = process.env.SITE_DISTRIBUTION_ROOT
  ? path.resolve(process.env.SITE_DISTRIBUTION_ROOT)
  : path.basename(sitePublicRoot) === "dist"
    ? sitePublicRoot
    : path.resolve(sitePublicRoot, "../dist");

function publicUrlToPath(publicUrl) {
  if (typeof publicUrl !== "string" || !publicUrl.startsWith("/")) {
    throw new Error("A public URL starting with '/' is required");
  }

  const relativePath = path.posix.normalize(publicUrl).replace(/^\/+/, "");
  if (!relativePath || relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    throw new Error("Invalid public URL");
  }

  const absolutePath = path.resolve(sitePublicRoot, relativePath);
  if (!absolutePath.startsWith(`${sitePublicRoot}${path.sep}`)) {
    throw new Error("Public URL escapes the configured document root");
  }

  return absolutePath;
}

/** Ensures article publication targets the live document root before writes. */
function assertArticlePublishingRoot() {
  const missingFiles = articleListUrls
    .map((url) => publicUrlToPath(url))
    .filter((filePath) => !fs.existsSync(filePath));

  if (missingFiles.length > 0) {
    throw new Error(
      `Article publishing is not configured for this deployment. Missing: ${missingFiles.join(", ")}. ` +
        "Set SITE_PUBLIC_ROOT to the absolute filesystem path of the published frontend dist directory, " +
        "which must contain /fr/articles-list.html and /en/articles-list.html."
    );
  }
}

module.exports = {
  sitePublicRoot,
  siteDistributionRoot,
  articleAssetDirectory,
  publicUrlToPath,
  assertArticlePublishingRoot,
};
