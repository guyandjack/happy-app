function setArticlePageHeader(article) {
  document.title = article.title;
  const seoDescription = document.querySelector("meta[name='description']");
  if (seoDescription) {
    seoDescription.content = article.excerpt;
  }

  const ogDescription = document.querySelector(
    "meta[property='og:description']"
  );
  if (ogDescription) {
    ogDescription.content = article.excerpt;
  }
  const ogTitle = document.querySelector("meta[property='og:title']");
  if (ogTitle) {
    ogTitle.content = article.title;
  }
  const ogUrl = document.querySelector("meta[property='og:url']");
  if (ogUrl) {
    ogUrl.content = article.url;
  }
  const twitterTitle = document.querySelector("meta[name='twitter:title']");
  if (twitterTitle) {
    twitterTitle.content = article.title;
  }
  const twitterDescription = document.querySelector(
    "meta[name='twitter:description']"
  );
  if (twitterDescription) {
    twitterDescription.content = article.excerpt;
  }
}

export { setArticlePageHeader };
