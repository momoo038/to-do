import { domUtils } from "../utils/domUtils.js";
import { saveDataToLocalStorage } from "../utils/localStorageUtils.js";
import { format, parseISO, isValid } from "date-fns";
import removeIconSVG from "../images/remove.svg";

export default function renderProjectCards(
  container,
  projectItems,
  fullDatasetToSave,
  onDataUpdateCallback
) {
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

    const removeIcon = domUtils.createImage(removeIconSVG, "Remove card", {
      classes: ["trash-can-icon", "remove-card-hidden"],
    });

    const checkProjectCompletion = () => {
      const allTasksCompleted =
        itemData.tasks &&
        itemData.tasks.length > 0 &&
        itemData.tasks.every((task) => task.isCompleted);
      card.classList.toggle("project-completed", allTasksCompleted);
      removeIcon.classList.toggle("remove-card-hidden", !allTasksCompleted);
      removeIcon.classList.toggle("remove-card-visible", allTasksCompleted);
    };

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

    if (itemData.tasks && itemData.tasks.length > 0) {
      const taskListContainer = domUtils.createElement("div", {
        classes: "project-card-task-list",
      });

      itemData.tasks.forEach((taskData) => {
        const taskEntryDiv = domUtils.createElement("div", {
          classes: "project-card-task-entry",
        });

        if (taskData.isCompleted) {
          taskEntryDiv.classList.add("task-completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = taskData.isCompleted;

        const taskText = domUtils.createElement("span", {
          classes: "task-text",
          textContent: taskData.text,
        });

        const editTaskIcon = domUtils.createElement("span", {
          classes: "task-action-icon",
          innerHTML: "&#9998;",
        });
        const removeTaskIcon = domUtils.createElement("span", {
          classes: "task-action-icon",
          innerHTML: "&#128465;",
        });

        const iconsContainer = domUtils.createElement("div", {
          classes: "task-icons-container",
          children: [editTaskIcon, removeTaskIcon],
        });

        const mainInfoDiv = domUtils.createElement("div", {
          classes: "task-main-info",
          children: [checkbox, taskText, iconsContainer],
        });

        editTaskIcon.addEventListener("click", (event) => {
          event.stopPropagation();
          console.log("Edit task:", taskData.text);
        });

        removeTaskIcon.addEventListener("click", (event) => {
          event.stopPropagation();
          const taskIndex = itemData.tasks.findIndex(
            (t) => t.id === taskData.id
          );
          if (taskIndex > -1) {
            itemData.tasks.splice(taskIndex, 1);
            saveDataToLocalStorage(fullDatasetToSave);
            onDataUpdateCallback();
          }
        });

        mainInfoDiv.addEventListener("click", (event) => {
          if (event.target.classList.contains("task-action-icon")) return;
          taskData.isCompleted = !taskData.isCompleted;
          saveDataToLocalStorage(fullDatasetToSave);
          taskEntryDiv.classList.toggle("task-completed");
          checkbox.checked = taskData.isCompleted;
          checkProjectCompletion();
          if (typeof onDataUpdateCallback === "function") {
            onDataUpdateCallback();
          }
        });
        taskEntryDiv.appendChild(mainInfoDiv);

        if (taskData.description) {
          const taskDescription = domUtils.createElement("p", {
            classes: "task-item-description",
            textContent: taskData.description,
          });
          taskEntryDiv.appendChild(taskDescription);
        }
        const taskDetailsDiv = domUtils.createElement("div", {
          classes: "task-details",
        });
        if (taskData.Priority) {
          const priorityEl = domUtils.createElement("span", {
            classes: ["task-priority", `priority-${taskData.Priority}`],
            textContent: `Priority: ${taskData.Priority}`,
          });
          taskDetailsDiv.appendChild(priorityEl);
        }
        if (taskData.dueDate) {
          const dateObj = parseISO(taskData.dueDate);
          if (isValid(dateObj)) {
            const dueDateEl = domUtils.createElement("span", {
              classes: "task-due-date",
              textContent: `Due: ${format(dateObj, "MMM d")}`,
            });
            taskDetailsDiv.appendChild(dueDateEl);
          }
        }
        if (taskDetailsDiv.hasChildNodes()) {
          taskEntryDiv.appendChild(taskDetailsDiv);
        }
        taskListContainer.appendChild(taskEntryDiv);
      });

      card.appendChild(taskListContainer);
    }
    checkProjectCompletion();

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
            if (typeof onDataUpdateCallback === "function") {
              onDataUpdateCallback();
            }
          } else {
            console.warn(
              "Full dataset (fullDatasetToSave) not provided; cannot save."
            );
          }
          renderProjectCards(
            container,
            projectItems,
            fullDatasetToSave,
            onDataUpdateCallback
          );
        } else {
          console.warn(
            "Item to remove not found in data array, removing from DOM only. ID:",
            itemIdToRemove
          );
          this.remove();
        }
        return;
      }

      this.classList.toggle("card-is-selected");
    });
    cardsWrapper.appendChild(card);
  });
}
