import { domUtils } from "../utils/domUtils.js";

export default function renderProjectCards(container, projectItems) {
  if (!container) {
    console.error("Project cards container not found!");
    return;
  }
  const cardsWrapper = domUtils.createElement("div", {
    classes: "project-cards-wrapper",
  });
  container.appendChild(cardsWrapper);

  projectItems.forEach((itemData) => {
    const card = domUtils.createElement("div", { classes: "project-card" });

    const title = domUtils.createElement("h3", {
      classes: "project-card-title",
      textContent: itemData.text,
    });
    card.appendChild(title);

    if (itemData.description) {
      const description = domUtils.createElement("p", {
        classes: "project-card-description",
        textContent: itemData.description,
      });
      card.appendChild(description);
    }

    const removeIcon = domUtils.createImage(
      "images/remove.svg",
      "Remove card",
      { classes: ["trash-can-icon", "remove-card-hidden"] }
    );
    removeIcon.style.width = "30px";
    removeIcon.style.height = "30px";
    card.appendChild(removeIcon);

    if (itemData.href && itemData.href !== "#") {
      card.classList.add("clickable");
    }

    card.addEventListener("click", function (event) {
      const removeIconInstance = this.querySelector(".trash-can-icon");
      if (
        removeIconInstance &&
        (event.target === removeIconInstance ||
          removeIconInstance.contains(event.target))
      ) {
        this.remove();
        return;
      }

      this.classList.toggle("card-is-selected");

      if (removeIconInstance) {
        if (this.classList.contains("card-is-selected")) {
          removeIconInstance.classList.remove("remove-card-hidden");
          removeIconInstance.classList.add("remove-card-visible");
        } else {
          removeIconInstance.classList.remove("remove-card-visible");
          removeIconInstance.classList.add("remove-card-hidden");
        }
      }

      if (itemData.href && itemData.href !== "#") {
        if (itemData.href.startsWith("#")) {
          window.location.hash = itemData.href;
        } else {
          window.open(itemData.href, "_blank");
        }
      }
    });

    cardsWrapper.appendChild(card);
  });
}
