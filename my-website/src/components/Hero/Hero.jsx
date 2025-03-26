import React from "react"



//feuille de style
import '../../styles/CSS/hero.css';



function getLanguage() {
    let string = window.location.pathname;
    let language = /^(fr) || (index)/.test(string);
   
   if(language){
    return "fr";
   }
   else{
    return "en";
   }
    
}

function getPageName(lang) {
    let pageName=[];
    let string = window.location.pathname;
    let subString = string.split("/").pop().replace(".html", "");
    let masqueFr = /^(index|contact|qui|realisation|articles|site|seo|mobile)$/;
    let masqueEn = /^(home|contact|about|achievements|articles|site|seo|mobile)$/;

    if (lang === "fr") {
        pageName = subString.match(masqueFr)
        console.log("pageName: ", pageName[0])
        return pageName[0]
    }
    
    else if (lang === "en") {
        pageName = subString.match(masqueEn)
        console.log("pageName: ", pageName[0])
        return pageName[0]
    }
    
    else return undefined;
}


let heroContent = {
    fr: {
        index: {
            img_1: "",
            img_2: "",
            title: "Bienvenue sur mon site",
            subtitle: "je suis un développeur web",
     
        },
        contact: {
            img_1: "/src/assets/images/page-contact/img-anim-contact.webp",
            img_2: "/src/assets/images/page-contact/img-head-contact-2.webp",
            title: "Contact",
            subtitle: "Développeur web passioné.",
        },
    
        qui: {
            img_1: "",
            img_2: "",
            title: "A propos de moi",
            subtitle: "Développeur web passionné et engagé.",
        },
        realisation: {
            img_1: "",
            img_2: "",
            title: "Bienvenue sur mon site",
            subtitle: "je suis un développeur web",
        },
        articles: {
            img_1: "",
            img_2: "",
            title: "Bienvenue sur mon site",
            subtitle: "je suis un développeur web",
        },
        mobile: {
            img_1: "",
             img_2: "",
            title: "Bienvenue sur mon site",
            subtitle: "je suis un développeur web",
        },
        seo: {
            img_1: "",
            img_2: "",
            title: "Bienvenue sur mon site",
            subtitle: "je suis un développeur web",
        },
        site: {
            img_1: "",
            img_2: "",
            title: "Bienvenue sur mon site",
            subtitle: "je suis un développeur web",
        }
    },
    en: {
        home: {
            img_1: "",
            img_2: "",
            title: "Bienvenue sur mon site",
            subtitle: "je suis un développeur web",
     
        },
        contact: {
            img_1: "",
            img_2: "",
            title: "Bienvenue sur mon site",
            subtitle: "je suis un développeur web",
        },
    
        about: {
            img_1: "",
            img_2: "",
            title: "Bienvenue sur mon site",
            subtitle: "je suis un développeur web",
        },
        achievements: {
            img_1: "",
            img_2: "",
            title: "Bienvenue sur mon site",
            subtitle: "je suis un développeur web",
        },
        articles: {
            img_1: "",
            img_2: "",
            title: "Bienvenue sur mon site",
            subtitle: "je suis un développeur web",
        },
        mobile: {
            img_1: "",
             img_2: "",
            title: "Bienvenue sur mon site",
            subtitle: "je suis un développeur web",
        },
        seo: {
            img_1: "",
            img_2: "",
            title: "Bienvenue sur mon site",
            subtitle: "je suis un développeur web",
        },
        site: {
            img_1: "",
            img_2: "",
            title: "Bienvenue sur mon site",
            subtitle: "je suis un développeur web",
        }
    },


}


function Hero() {

    let language = getLanguage();
    let pageName = getPageName(language);
    console.log("lang et page: ", [language, pageName])

    if (!language || !pageName) {
        return null
    }
    
  return (
    <div className="flex-column-center-center hero">
      {<img src={heroContent[`${language}`][`${pageName}`].img_1} alt="Hero background" />}
      {<img src={heroContent[`${language}`][`${pageName}`].img_2} alt="Hero background" />}
      <div className="container">
        <h1>{heroContent[`${language}`][`${pageName}`].title}</h1>
        
              <p className="hero-subtitle" >{ heroContent[`${language}`][`${pageName}`].subtitle}</p>
        
      </div>
    </div>
  );
}

export { Hero };