import { domUtils } from "../utils/domUtils.js";

export default function taskModal(items) {
  const taskCategory = items.find((item) => item.id === "nav-tasks");
  const projects = taskCategory ? taskCategory.projects : [];

  const projectOptions = projects.map((project) => {
    return domUtils.createElement("option", {
      value: project.id,
      textContent: project.text,
    });
  });

  const modalBody = domUtils.createElement("div", {
    classes: "modal-body",
    children: [
      // Project selection
      domUtils.createElement("label", {
        for: "task-project",
        textContent: "Project:",
      }),
      domUtils.createElement("select", {
        id: "task-project",
        classes: "modal-input",
        children: projectOptions,
      }),

      // Task name
      domUtils.createElement("label", {
        for: "task-name",
        textContent: "Task name:",
      }),
      domUtils.createElement("input", {
        type: "text",
        id: "task-name",
        classes: "modal-input",
        placeholder: "e.g. Make the modal box",
        required: true,
        maxlength: 256,
      }),

      // Task description
      domUtils.createElement("label", {
        for: "task-description",
        textContent: "Description:",
      }),
      domUtils.createElement("textarea", {
        id: "task-description",
        classes: "modal-input",
        rows: "3",
        maxlength: 1000,
      }),

      // Priority
      domUtils.createElement("label", {
        for: "task-priority",
        textContent: "Priority:",
      }),
      domUtils.createElement("input", {
        type: "number",
        id: "task-priority",
        classes: "modal-input",
        min: "1",
        max: "5",
        value: "3",
        required: true,
      }),

      // --- Due Date ---
      domUtils.createElement("label", {
        for: "task-due-date",
        textContent: "Due Date:",
      }),
      domUtils.createElement("input", {
        type: "date",
        id: "task-due-date",
        classes: "modal-input",
        required: true,
      }),

      // --- Submit Button ---
      domUtils.createElement("button", {
        id: "submit-task-btn",
        classes: "modal-submit-btn",
        textContent: "Add Task",
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
      domUtils.createElement("h2", { textContent: "Add Task" }),
      modalBody,
    ],
  });

  const modalBox = domUtils.createElement("div", {
    classes: "modal",
    children: [modalContent],
  });

  return modalBox;
}
