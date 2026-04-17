//import des images

/***import pour MPL *** */
import logo_MPL from "@/assets/logo/logo-mpl.svg";
const screenshots_MPL = Object.values(
    import.meta.glob("@/assets/screenShot/MPL/*.webp", {
        eager: true,
        import: "default",
    }),
);

/***import pour wizPix *** */

import logo_WP from "@/assets/logo/logo-wiz-pix.svg";
const screenshots_WP = Object.values(
  import.meta.glob("@/assets/screenShot/*.jpg", {
    eager: true,
    import: "default",
  }),
);

const creationContent = [
  {
    title: "MPL",
    logo: logo_MPL,
    url: "https://monprojetlocatif.org",
    mockup: "iphone",
    screenWidth: 100,
    parentSize: "mobile",
    description:
      "Optimisez vos investissements grâce à notre simulateur de rentabilité locative.Estimez rapidement les coûts liés à la mise en location de votre bien immobilier, en fonction de la fiscalité française (location nue ou LMNP).🚀 Bientôt disponible : des simulateurs dédiés à la Suisse et à d’autres pays européens pour accompagner tous vos projets immobiliers.",
    screenShot: screenshots_MPL,
    status: true
  },
  {
    title: "Wiz Pix",
    logo: logo_WP,
    url: "https://wizpix.ch",
    mockup: "laptop",
    screenWidth: 150,
    parentSize: "desktop",
    description:
      "Boostez la qualité de vos visuels grâce à notre SaaS intelligent.Basé sur un modèle d’IA préentraîné, il permet de détourer automatiquement vos photos, supprimer ou modifier les arrière-plans en quelques secondes.🎯 Optimisez également vos images pour le web : redimensionnement, formatage et compression, tout est conçu pour des performances maximales et un rendu professionnel.",
    screenShot: screenshots_WP,
    status: false
  },
];

export {creationContent}