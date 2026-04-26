
/**
 * permet de scroller au meme endroit suite a un changement de language du client
 *
 * @return {*} 
 */
function scrollToTarget() {
    if (!window.localStorage.getItem("changeLang")) return;
    const scrollValue = window.localStorage.getItem("changeLang");
    window.localStorage.removeItem("changeLang");
    window.scroll({
      top: scrollValue,
      left: 0,
      behavior: "smooth",
    });
}

export {scrollToTarget}