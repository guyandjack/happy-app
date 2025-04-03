

//concerne l' animation des collapse
document.addEventListener('DOMContentLoaded', () => {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('h3');
    const answer = item.querySelector('p');
    
    // Initially hide all answers
    answer.style.display = 'none';
    
    // Add click event listener to questions
    question.addEventListener('click', () => {
      // Toggle the answer visibility
      const isExpanded = answer.style.display === 'block';
      
      // Toggle the answer
      answer.style.display = isExpanded ? 'none' : 'block';
      
      // Toggle the arrow icon
      question.classList.toggle('expanded');
    });
  });
}); 



//Concerne l' animation de l' icon setting

document.addEventListener('DOMContentLoaded', () => {
  const icon = document.querySelector('.icon-seo');
  icon.addEventListener("animationend", () => {
    icon.classList.remove('rotate-right');
    icon.classList.remove('rotate-left');
  });
  let lastScrollY = window.scrollY;

document.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  if (currentScrollY >= lastScrollY) {
    icon.classList.remove('rotate-right');
    icon.classList.add('rotate-left');
    
    
  } else {
    icon.classList.remove('rotate-left');
    icon.classList.add('rotate-right');
  }
  lastScrollY = currentScrollY;
});
  
});

