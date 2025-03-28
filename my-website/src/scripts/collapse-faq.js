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