import { domUtils } from "../utils/domUtils.js";
import { saveDataToLocalStorage } from "../utils/localStorageUtils.js";

export default function renderProjectCards(container, projectItems, fullDatasetToSave, onDataUpdateCallback) {
  if (!container) {
    console.error("Project cards container not found!");
    return;
  }

  let cardsWrapper = container.querySelector(".project-cards-wrapper");
  if (!cardsWrapper) {
    cardsWrapper = domUtils.createElement("div", {
      classes: "project-cards-wrapper",
    });
    container.appendChild(cardsWrapper);
  }
  cardsWrapper.innerHTML = "";
  projectItems.forEach((itemData) => {
    const card = domUtils.createElement("div", { classes: "project-card" });
    card.dataset.id = itemData.id;

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
        event.stopPropagation();
        const itemIdToRemove = itemData.id;
        const itemIndexToRemove = projectItems.findIndex(
          (item) => item.id === itemIdToRemove
        );
        if (itemIndexToRemove > -1) {
          projectItems.splice(itemIndexToRemove, 1);
          if (fullDatasetToSave) {
            saveDataToLocalStorage(fullDatasetToSave);
            if (typeof onDataUpdateCallback === "function"){
              onDataUpdateCallback();
            }
          } else {
            console.warn(
              "Full dataset (fullDatasetToSave) not provided to renderProjectCards; cannot save to localStorage."
            );
          }
          renderProjectCards(container, projectItems, fullDatasetToSave, onDataUpdateCallback);
        } else {
          console.warn("Item to remove not found in data array, removing from DOM only. ID:", itemIdToRemove);
          this.remove();
        }
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