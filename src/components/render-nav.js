import { domUtils } from "../utils/domUtils.js";
import { saveDataToLocalStorage } from "../utils/localStorageUtils.js";

export default function renderNavLinks(nav, items, onDataUpdateCallback) {
  if (!nav) return;
  nav.innerHTML = "";

  items.forEach((itemData) => {
    const linkChildren = [];
    if (itemData.icon) {
      const iconImageElement = domUtils.createImage(itemData.icon, "", {
        classes: "nav-icon",
      });
      if (iconImageElement) {
        linkChildren.push(iconImageElement);
      }
    }
    linkChildren.push(document.createTextNode(itemData.text || ""));
    const link = domUtils.createElement("a", {
      classes: "nav-link",
      id: itemData.id,
      children: linkChildren,
    });
    nav.appendChild(link);

    if (itemData.projects) {
      const subNavContainer = domUtils.createElement("div", {
        classes: "sub-nav-links",
      });

      if (itemData.projects.length > 0) {
        itemData.projects.forEach((projectData, projectIndex) => {
          const removeProjectIcon = domUtils.createElement("span", {
            classes: "nav-remove-project-icon",
            innerHTML: "&#128465;",
          });

          removeProjectIcon.addEventListener("click", (event) => {
            event.stopPropagation();
            itemData.projects.splice(projectIndex, 1);
            saveDataToLocalStorage(items);
            if (typeof onDataUpdateCallback === "function") {
              onDataUpdateCallback();
            }
          });

          const projectLink = domUtils.createElement("a", {
            classes: ["nav-link", "sub-nav-link", "nav-project-link"],
            id: projectData.id,
            children: [
              document.createTextNode(projectData.text),
              removeProjectIcon,
            ],
          });

          projectLink.addEventListener("click", (event) => {
            if (event.target.classList.contains("nav-remove-project-icon"))
              return;

            projectData.isCollapsed = !projectData.isCollapsed;
            saveDataToLocalStorage(items);
            if (typeof onDataUpdateCallback === "function") {
              onDataUpdateCallback();
            }
          });

          subNavContainer.appendChild(projectLink);

          if (projectData.tasks && projectData.tasks.length > 0) {
            const tasksListContainer = domUtils.createElement("div", {
              classes: "nav-tasks-list",
            });

            if (projectData.isCollapsed) {
              tasksListContainer.classList.add("collapsed");
            }

            projectData.tasks.forEach((taskData) => {
              const statusIcon = taskData.isCompleted ? "●" : "○";
              const taskElement = domUtils.createElement("span", {
                classes: "nav-task-item",
                textContent: `${statusIcon} ${taskData.text}`,
              });
              if (taskData.isCompleted) {
                taskElement.classList.add("completed");
              }
              tasksListContainer.appendChild(taskElement);
            });
            subNavContainer.appendChild(tasksListContainer);
          }
        });
      } else {
        const noTasksMessage = domUtils.createElement("span", {
          classes: "no-tasks-nav-message",
          textContent: "There are no projects right now.",
        });
        subNavContainer.appendChild(noTasksMessage);
      }
      nav.appendChild(subNavContainer);
    }
  });
}
