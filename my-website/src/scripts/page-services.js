//concerne l' animation des collapse
document.addEventListener("DOMContentLoaded", () => {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector("h3");
    const answer = item.querySelector("p");
    const answerList = item.querySelector("ul");

    // Initially hide all answers
    if (answer) {
      answer.style.display = "none";
    }
    if (answerList) {
      answerList.style.display = "none";
    }

    // Add click event listener to questions
    if (question) {
      question.addEventListener("click", () => {
        // Toggle the answer visibility
        const isExpanded = answer.style.display === "block";
        let isExpandedList;
        if (answerList) {
          isExpandedList = answerList.style.display === "block";
        }

        // Toggle the answer
        if (answer) {
          answer.style.display = isExpanded ? "none" : "block";
        }
        if (answerList) {
          answerList.style.display = isExpandedList ? "none" : "block";
        }

        // Toggle the arrow icon
        question.classList.toggle("expanded");
      });
    }
  });
});

//Concerne l' animation de l' icon setting

document.addEventListener("DOMContentLoaded", () => {
  const icon = document.querySelector(".icon-seo");
  if (icon) {
    icon.addEventListener("animationend", () => {
      icon.classList.remove("rotate-right");
      icon.classList.remove("rotate-left");
    });
    let lastScrollY = window.scrollY;

    document.addEventListener("scroll", () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY >= lastScrollY) {
        icon.classList.remove("rotate-right");
        icon.classList.add("rotate-left");
      } else {
        icon.classList.remove("rotate-left");
        icon.classList.add("rotate-right");
      }
      lastScrollY = currentScrollY;
    });
  }
});
