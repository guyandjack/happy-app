function setArticlePageHeader(article) {
  //detection de la langue de la page
  const lang = document.documentElement.lang;

  document.title = lang === "fr" ? article.title : article.title_en;
  const seoDescription = document.querySelector("meta[name='description']");
  if (seoDescription) {
    seoDescription.content =
      lang === "fr" ? article.excerpt : article.excerpt_en;
  }

  const ogDescription = document.querySelector(
    "meta[property='og:description']"
  );
  if (ogDescription) {
    ogDescription.content =
      lang === "fr" ? article.excerpt : article.excerpt_en;
  }
  const ogTitle = document.querySelector("meta[property='og:title']");
  if (ogTitle) {
    ogTitle.content = lang === "fr" ? article.title : article.title_en;
  }
  const ogUrl = document.querySelector("meta[property='og:url']");
  if (ogUrl) {
    ogUrl.content = lang === "fr" ? article.url : article.url_en;
  }
  const twitterTitle = document.querySelector("meta[name='twitter:title']");
  if (twitterTitle) {
    twitterTitle.content = lang === "fr" ? article.title : article.title_en;
  }
  const twitterDescription = document.querySelector(
    "meta[name='twitter:description']"
  );
  if (twitterDescription) {
    twitterDescription.content =
      lang === "fr" ? article.excerpt : article.excerpt_en;
  }
}

export { setArticlePageHeader };
