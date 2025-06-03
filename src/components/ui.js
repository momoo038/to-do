import { domUtils } from "../utils/domUtils.js";
import renderNavLinks from "../components/render-nav.js";
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
}
