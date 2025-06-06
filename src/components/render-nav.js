import { domUtils } from "../utils/domUtils.js";

export default function renderNavLinks(nav, items) {
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
        itemData.projects.forEach((projectData) => {
          const projectLink = domUtils.createElement("a", {
            classes: ["nav-link", "sub-nav-link"],
            id: projectData.id,
            textContent: projectData.text,
          });
          subNavContainer.appendChild(projectLink);

          if (projectData.tasks && projectData.tasks.length > 0) {
            const tasksListContainer = domUtils.createElement("div", {
              classes: "nav-tasks-list",
            });
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
          textContent: "Peace and silence; nothing to display.",
        });
        subNavContainer.appendChild(noTasksMessage);
      }
      nav.appendChild(subNavContainer);
    }
  });
}
