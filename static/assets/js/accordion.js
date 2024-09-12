// Accordion
const accordions = document.querySelectorAll("#accordionCode");

accordions.forEach((accordion) => {
  const accordionItems = accordion.querySelectorAll("#accordion-item");
  const accordionButtons = accordion.querySelectorAll("#accordion-button");

  accordionButtons.forEach((button, button_index) => {
    button.addEventListener("click", () => {
      accordionItems.forEach((item, item_index) => {
        console.log(button_index, item_index);
        if (button_index === item_index) {
            const code = item.querySelector("#accordion-body");
            const arrow = item.querySelector("#arrow");

          if (code.classList.contains("hidden")) {
            code.classList.remove("hidden");
            arrow.classList.remove("fa-angle-down");
            arrow.classList.add("fa-angle-up");
          } else {
            code.classList.add("hidden");
            arrow.classList.remove("fa-angle-up");
            arrow.classList.add("fa-angle-down");
          }
        }
      });
    });
  });
});
