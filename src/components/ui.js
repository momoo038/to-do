import { domUtils } from "../utils/domUtils.js";
import renderNavLinks from "../components/render-nav.js";
import renderProjectCards from "../components/render-projects.js";
import "/src/styles/ui-styles.css";
import checkmarkLogo from "../images/checkmark.png";
import initialNavigationDataFromFile from "../data/navigation.json";
import {
  loadDataFromLocalStorage,
  saveDataToLocalStorage,
} from "../utils/localStorageUtils.js";
import addIcon from "../images/add.svg";

let navItemsFromJson;
let navFunctionsContainer;

export default function renderUI() {
  navItemsFromJson = loadDataFromLocalStorage();
  if (!navItemsFromJson) {
    navItemsFromJson = JSON.parse(
      JSON.stringify(initialNavigationDataFromFile)
    );
    saveDataToLocalStorage(navItemsFromJson);
  }

  const content = document.querySelector("#content");
  if (content) {
    content.innerHTML = "";
  } else {
    console.error("#content not found");
    return;
  }
  const mainContainer = domUtils.createElement("div", { classes: "ui-main" });
  content.appendChild(mainContainer);

  const logoTitle = domUtils.createElement("div", {
    classes: "logo-title",
    children: [
      domUtils.createImage(checkmarkLogo, "TODO Logo", {
        width: "50px",
        height: "50px",
      }),
      domUtils.createElement("h1", {
        classes: "nav-h1",
        textContent: "todoner",
      }),
    ],
  });

  navFunctionsContainer = domUtils.createElement("div", {
    classes: "nav-functions",
  });

  function refreshNav() {
    if (navFunctionsContainer && navItemsFromJson) {
      renderNavLinks(navFunctionsContainer, navItemsFromJson);
    } else {
      console.error("Can't refresh nav");
    }
  }

  if (navItemsFromJson) {
    renderNavLinks(navFunctionsContainer, navItemsFromJson);
  } else {
    console.error(
      "Navigation items could not be loaded (imported as undefined/null)."
    );
    renderNavLinks(navFunctionsContainer, [
      { text: "Error", href: "#", id: "nav-error" },
    ]);
  }

  const sideNav = domUtils.createElement("div", {
    classes: "side-nav",
    children: [logoTitle, navFunctionsContainer],
  });
  mainContainer.appendChild(sideNav);

  const addTask = domUtils.createElement("div", {
    classes: "nav-add-btn",
    children: [
      domUtils.createImage(addIcon, "Add task icon", {
        classes: "nav-add-icon",
        height: "30px",
        width: "30px",
      }),
      domUtils.createElement("span", {
        classes: "nav-add-text",
        textContent: "Add Task",
      }),
    ],
  });
  sideNav.appendChild(addTask);

  const projectContainer = domUtils.createElement("div", {
    classes: "projects-main",
  });
  mainContainer.appendChild(projectContainer);

  const projectsTitle = domUtils.createElement("h1", {
    classes: "project-title",
    textContent: "Projects",
  });
  projectContainer.appendChild(projectsTitle);

  const projectDisplayContainer = domUtils.createElement("div", {
    classes: "page-content-area",
  });
  mainContainer.appendChild(projectDisplayContainer);

  if (navItemsFromJson) {
    const tasksItem = navItemsFromJson.find((item) => item.id === "nav-tasks");

    if (tasksItem && tasksItem.projects && tasksItem.projects.length > 0) {
      const subTasksTitle = domUtils.createElement("h2", {
        classes: "project-subtitle",
        textContent: `Projects under: ${tasksItem.text}`,
      });
      projectDisplayContainer.appendChild(subTasksTitle);

      renderProjectCards(
        projectDisplayContainer,
        tasksItem.projects,
        navItemsFromJson,
        refreshNav
      );
    } else {
      projectDisplayContainer.innerHTML = "";
      const noSubTasksTitle = domUtils.createElement("h2", {
        classes: "no-project-subtitle",
      });
      projectDisplayContainer.appendChild(noSubTasksTitle);

      const messageElement = domUtils.createElement("p", {
        textContent: "There are no projects at the moment. Add new!",
        classes: "no-tasks-message",
      });
      projectDisplayContainer.appendChild(messageElement);
      console.warn(
        "Could not find 'projects' array in navigation.json or it is empty."
      );
    }
  } else {
    projectDisplayContainer.innerHTML = "";
    const errorTitle = domUtils.createElement("h2", {
      classes: "project-subtitle",
      textContent: "Error",
    });
    projectDisplayContainer.appendChild(errorTitle);
    const errorMessage = domUtils.createElement("p", {
      textContent: "Navigation data not loaded.",
    });
    projectDisplayContainer.appendChild(errorMessage);
  }
}
