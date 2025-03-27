//detecte le language de la page grasse a l' url courante
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

export {getLanguage};