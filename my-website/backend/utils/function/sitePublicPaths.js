const path = require("path");

// The frontend public directory is the source copied by Vite to the published site.
// An explicit value is useful when the API and frontend are deployed separately.
const sitePublicRoot = path.resolve(
  process.env.SITE_PUBLIC_ROOT || path.resolve(__dirname, "../../../public")
);

const articleAssetDirectory = "assets/articles";
const siteDistributionRoot = path.resolve(sitePublicRoot, "../dist");

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
    throw new Error("Public URL escapes the configured public directory");
  }

  return absolutePath;
}

module.exports = {
  sitePublicRoot,
  siteDistributionRoot,
  articleAssetDirectory,
  publicUrlToPath,
};
