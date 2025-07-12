const dataImagesUrl = {
  winter: {
    mobile_a: "",
    mobile_b: "1000px",
    laptop: "1500px",
    desktop: "2000px",
  },
  spring: {
    mobile_a: "600px",
    mobile_b: "1000px",
    laptop: "1500px",
    desktop: "2000px",
  },
  summer: {
    mobile_a:
      "url(../../../src/assets/images/hero-index-mobile-winter-600px-modif.jpg",
    mobile_b:
      "url(../../../src/assets/images/hero-index-mobile-winter-1000px.webp)",
    laptop: "url(../../../src/assets/images/hero-index-sumer-1500px.webp)",
    desktop: "url(../../../src/assets/images/hero-index-sumer-2000px.webp)",
  },
  autumn: {
    mobile_a: "600px",
    mobile_b: "1000px",
    laptop: "1500px",
    desktop: "2000px",
  },
};

function getSeason() {
  const month = new Date().getMonth(); // 0 = Janvier, 11 = Décembre

  if (month >= 2 && month <= 4) {
    return "spring"; // Printemps (mars à mai)
  } else if (month >= 5 && month <= 7) {
    return "summer"; // Été (juin à août)
  } else if (month >= 8 && month <= 10) {
    return "autumn"; // Automne (septembre à novembre)
  } else {
    return "winter"; // Hiver (décembre à février)
  }
}

function getScreentype() {
  const screenWidth = window.innerWidth;
  let screenType = "";
  if (screenWidth < 768) {
    screenType = "mobile_a";
    return screenType;
  }
  if (screenWidth >= 768 && screenWidth < 992) {
    screenType = "mobile_b";
    return screenType;
  }
  if (screenWidth >= 992 && screenWidth < 1300) {
    screenType = "laptop";
    return screenType;
  }
  if (screenWidth >= 1300) {
    screenType = "desktop";
    return screenType;
  }
}

function updateHeroBackground() {
  const season = getSeason();
  const screenType = getScreentype();
  if (!screenType || !season) {
    console.error("error initialisation");
    return;
  }

  return dataImagesUrl[season][screenType];
}

function setImageType(imageType) {
  const heroElement = document.querySelector(".hero-index");
  if (!heroElement) {
    console.error("container hero-index non trouvé!");
    return;
  }
  heroElement.style.setProperty("--imgSeason", imageType);
}

export { updateHeroBackground, setImageType };
