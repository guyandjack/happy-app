function displayPreviewArticle(previewArticle) {
  const divPreviewArticle = document.querySelector(".preview-article-content");
  if (!divPreviewArticle) {
    return;
  }

  //author
  const spanAuthorName = divPreviewArticle.querySelector(
    ".article-author-name"
  );
  if (spanAuthorName) {
    spanAuthorName.textContent = previewArticle.author;
  }

  //category
  const spanCategory = divPreviewArticle.querySelector(".article-category");
  if (spanCategory) {
    spanCategory.textContent = previewArticle.category;
  }

  //tags
  const spanTags = divPreviewArticle.querySelector(".article-tags");
  if (spanTags) {
    spanTags.textContent = previewArticle.tags;
  }

  //title
  const spanTitle = divPreviewArticle.querySelector(".article-title");
  if (spanTitle) {
    spanTitle.textContent = previewArticle.title;
  }

  //excerpt
  const spanExcerpt = divPreviewArticle.querySelector(".article-excerpt");
  if (spanExcerpt) {
    spanExcerpt.textContent = previewArticle.excerpt;
  }

  //main image
  const imgMainImage = divPreviewArticle.querySelector(".article-img-title");
  if (imgMainImage) {
    imgMainImage.src = previewArticle.mainImage;
  }

  //additional images
  const divAdditionalImages = divPreviewArticle.querySelectorAll(
    ".article-img-subtitle"
  );
  if (divAdditionalImages) {
    previewArticle.additionalImages.forEach((image, index) => {
      const img = divAdditionalImages[index];
      if (img) {
        img.src = image;
      }
    });
  }

  //content
  const divContent = divPreviewArticle.querySelector(
    ".preview-article-content"
  );
  if (divContent) {
    divContent.innerHTML = previewArticle.content;
  }
}

export { displayPreviewArticle };
