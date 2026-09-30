//concerne l' animation des collapse
function initFaq() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const questionButton = item.querySelector(".faq-question");

    if (questionButton) {
      const answerId = questionButton.getAttribute("aria-controls");
      const answer = answerId ? document.getElementById(answerId) : null;

      if (!answer) {
        return;
      }

      questionButton.setAttribute("aria-expanded", "false");
      answer.setAttribute("aria-hidden", "true");
      answer.classList.remove("expanded");
      item.classList.remove("expanded");

      questionButton.addEventListener("click", () => {
        const isExpanded = questionButton.getAttribute("aria-expanded") === "true";
        const nextExpandedState = !isExpanded;

        questionButton.setAttribute("aria-expanded", String(nextExpandedState));
        answer.setAttribute("aria-hidden", String(!nextExpandedState));
        questionButton.classList.toggle("expanded", nextExpandedState);
        answer.classList.toggle("expanded", nextExpandedState);
        item.classList.toggle("expanded", nextExpandedState);
      });

      return;
    }

    // Backward compatibility for the existing FAQ markup on service pages.
    const question = item.querySelector("h3");
    const answer = item.querySelector("p");
    const answerList = item.querySelector("ul");

    // Initially hide all answers
    if (answer) {
      answer.classList.remove("expanded");
      question.classList.remove("expanded");
      item.classList.remove("expanded");
    }
    if (answerList) {
      answerList.classList.remove("expanded");
      question.classList.remove("expanded");
      item.classList.remove("expanded");
    }

    // Add click event listener to questions
    if (question) {
      question.addEventListener("click", () => {
        // Toggle the arrow icon
        question.classList.toggle("expanded");
        if (answer) {
          answer.classList.toggle("expanded");
        }
        if (answerList) {
          answerList.classList.toggle("expanded");
        }
        item.classList.toggle("expanded");
      });
    }
  });
}

//Concerne l' animation de l' icon setting
function initIconSetting() {
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
}

export { initFaq, initIconSetting };
