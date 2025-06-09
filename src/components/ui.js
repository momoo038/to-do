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
import taskModal from "./modal-box.js";
import projectModal from "./project-modal.js";

let navItemsFromJson;
let navFunctionsContainer;
let projectDisplayContainer;

export default function renderUI() {
  navItemsFromJson = loadDataFromLocalStorage();
  if (!navItemsFromJson) {
    navItemsFromJson = JSON.parse(
      JSON.stringify(initialNavigationDataFromFile)
    );
    saveDataToLocalStorage(navItemsFromJson);
  }

  const content = document.querySelector("#content");
  content.innerHTML = "";
  
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

  function refreshAll() {
    renderNavLinks(navFunctionsContainer, navItemsFromJson, refreshAll);
    
    const tasksLink = navFunctionsContainer.querySelector("#nav-tasks");
    if (tasksLink && !tasksLink.querySelector('.add-project-icon')) {
      const addProjectIcon = domUtils.createElement("span", {
        classes: "add-project-icon",
        innerHTML: "&#43;"
      });
      tasksLink.appendChild(addProjectIcon);
      
      addProjectIcon.addEventListener("click", (event) => {
        event.stopPropagation();
        handleProjectModal();
      });
    }

    const tasksItem = navItemsFromJson.find((item) => item.id === "nav-tasks");
    projectDisplayContainer.innerHTML = "";
    const projectsTitle = domUtils.createElement("h1", {
        classes: "project-title",
        textContent: "Projects",
    });
    projectDisplayContainer.appendChild(projectsTitle);
    
    if (tasksItem && tasksItem.projects && tasksItem.projects.length > 0) {
        renderProjectCards(
            projectDisplayContainer,
            tasksItem.projects,
            navItemsFromJson,
            refreshAll
        );
    }
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
  mainContainer.appendChild(addTask);
  
  projectDisplayContainer = domUtils.createElement("div", {
    classes: "projects-main",
  });
  mainContainer.appendChild(projectDisplayContainer);

  const sidenavToggleBtn = domUtils.createElement("div", {
    classes: "sidenav-toggle-btn",
    children: [
        domUtils.createElement("span"),
        domUtils.createElement("span"),
        domUtils.createElement("span"),
    ]
  });
  document.body.appendChild(sidenavToggleBtn);

  sidenavToggleBtn.addEventListener('click', () => {
    sideNav.classList.toggle('expanded-mobile');
    sidenavToggleBtn.classList.toggle('is-active');
  });

    projectDisplayContainer.addEventListener('click', () => {
    if (sideNav.classList.contains('expanded-mobile')) {
      sideNav.classList.remove('expanded-mobile');
      sidenavToggleBtn.classList.remove('is-active');
    }
  });

  refreshAll();

  addTask.addEventListener("click", () => {
    handleTaskModal();
  });

  function handleTaskModal() {
    const modalElement = taskModal(navItemsFromJson);
    document.body.appendChild(modalElement);
    modalElement.style.display = "flex";

    const closeBtn = modalElement.querySelector(".modal-close");
    const submitBtn = modalElement.querySelector("#submit-task-btn");

    closeBtn.addEventListener("click", () => modalElement.remove());

    submitBtn.addEventListener("click", () => {
      const selectedProjectId = modalElement.querySelector("#task-project").value;
      const taskName = modalElement.querySelector("#task-name").value;
      let taskDesc = modalElement.querySelector("#task-description").value;
      const taskPriority = modalElement.querySelector("#task-priority").value;
      const taskDueDate = modalElement.querySelector("#task-due-date").value;

      if (!selectedProjectId || !taskName || !taskDueDate) {
        alert("Please fill out all required fields.");
        return;
      }
      
      if (taskDesc.trim() === "") taskDesc = "No description provided";
      
      const newTask = {
        id: `task-${Date.now()}`,
        text: taskName, description: taskDesc, dueDate: taskDueDate,
        Priority: taskPriority, isCompleted: false
      };

      const tasksItem = navItemsFromJson.find(item => item.id === 'nav-tasks');
      const projectToUpdate = tasksItem.projects.find(p => p.id === selectedProjectId);

      if (projectToUpdate) {
        if (!projectToUpdate.tasks) projectToUpdate.tasks = [];
        projectToUpdate.tasks.push(newTask);
      }
      
      saveDataToLocalStorage(navItemsFromJson);
      refreshAll();
      modalElement.remove();
    });
  }
  
  function handleProjectModal() {
    const modalElement = projectModal();
    document.body.appendChild(modalElement);
    modalElement.style.display = "flex";

    const closeBtn = modalElement.querySelector(".modal-close");
    const submitBtn = modalElement.querySelector("#submit-project-btn");
    
    closeBtn.addEventListener("click", () => modalElement.remove());
    
    submitBtn.addEventListener("click", () => {
        const projectName = modalElement.querySelector("#project-name").value;
        if (!projectName.trim()) {
            alert("Please enter a project name.");
            return;
        }

        const newProject = {
            id: `project-${Date.now()}`,
            text: projectName,
            tasks: []
        };
        
        const tasksItem = navItemsFromJson.find(item => item.id === 'nav-tasks');
        if (tasksItem) {
            tasksItem.projects.push(newProject);
        }

        saveDataToLocalStorage(navItemsFromJson);
        refreshAll();
        modalElement.remove();
    });
  }
}
