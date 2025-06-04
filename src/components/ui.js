import { domUtils } from "../utils/domUtils.js";
import renderNavLinks from "../components/render-nav.js";
import renderProjectCards from "../components/render-projects.js";
import "/src/styles/ui-styles.css";
import checkmarkLogo from "../images/checkmark.png";
import navItemsFromJson from "../data/navigation.json";

export default function renderUI() {
  const content = document.querySelector("#content");

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

  const navFunctionsContainer = domUtils.createElement("div", {
    classes: "nav-functions",
  });

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

    if (
      tasksItem &&
      tasksItem.subCategories &&
      tasksItem.subCategories.length > 0
    ) {
      renderProjectCards(projectDisplayContainer, tasksItem.subCategories);
    } else {
      projectsPageTitle.textContent = "No Task Sub-categories";
      const messageElement = domUtils.createElement("p", {
        textContent:
          "The 'Tasks' category was not found or has no sub-categories to display.",
      });
      projectDisplayContainer.appendChild(messageElement);
      console.warn(
        "Could not find 'Tasks' item or its sub-categories in navigation.json"
      );
    }
  } else {
    projectsPageTitle.textContent = "Error";
    const errorMessage = domUtils.createElement("p", {
      textContent: "Navigation data not loaded.",
    });
    projectDisplayContainer.appendChild(errorMessage);
  }
}
