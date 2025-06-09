import { domUtils } from "../utils/domUtils.js";

export default function projectModal() {
  const modalBody = domUtils.createElement("div", {
    classes: "modal-body",
    children: [
      domUtils.createElement("label", {
        for: "project-name",
        textContent: "New Project Name:",
      }),
      domUtils.createElement("input", {
        type: "text",
        id: "project-name",
        classes: "modal-input",
        placeholder: "e.g., Learn React or Game Dev",
        required: true,
        maxlength: 100,
      }),

      domUtils.createElement("button", {
        id: "submit-project-btn",
        classes: "modal-submit-btn",
        textContent: "Create Project",
      }),
    ],
  });

  const modalContent = domUtils.createElement("div", {
    classes: "modal-content",
    children: [
      domUtils.createElement("span", {
        classes: "modal-close",
        innerHTML: "&times;",
      }),
      domUtils.createElement("h2", { textContent: "Add a New Project" }),
      modalBody,
    ],
  });

  const modalBox = domUtils.createElement("div", {
    classes: "modal",
    children: [modalContent],
  });

  return modalBox;
}
