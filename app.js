let currentUser = null;

const sections = {
    login: document.getElementById("login-section"),
    signup: document.getElementById("signup-section"),
    dashboard: document.getElementById("dashboard-section"),
    tasks: document.getElementById("tasks-section"),
    notes: document.getElementById("notes-section"),
};

// header
function renderHeader() {
    const userInfo = document.getElementById("user-info");
    const logoutButton = document.getElementById("logout-btn");
    const desktopNavLinks = document.getElementById("desktop-nav");

    if (currentUser) {
        userInfo.textContent = currentUser.email;
        logoutButton.style.display = "inline";
        desktopNavLinks.querySelector("#nav-dashboard").style.display = "inline"
        desktopNavLinks.querySelector("#nav-tasks").style.display = "inline"
        desktopNavLinks.querySelector("#nav-notes").style.display = "inline"
    } else {
        userInfo.textContent = "";
        logoutButton.style.display = "none";
        desktopNavLinks.querySelector("#nav-dashboard").style.display = "none"
        desktopNavLinks.querySelector("#nav-tasks").style.display = "none"
        desktopNavLinks.querySelector("#nav-notes").style.display = "none"
    }
}


// routing
function route() {
    const hash = window.location.hash || "#";
    const page = hash.substring(1);
    renderHeader();

    if (currentUser) {
        showSections(page);
        switch (page) {
            case "dashboard":
                renderDashboard();
                break;
            case "tasks":
                renderTasks();
                break;
            case "notes":
                //show notes
                break;
            default:
                renderDashboard();
        }
    } else {
        if (page === "login") {
            showSections("login");
        } else {
            showSections("signup");
        }
    }
}


// user can be at a single place
// sectionName => signup || login || dashboard || notes || tasks
function showSections(sectionName) {
    const availableSections = Object.values(sections)
    availableSections.forEach((item) => {
        item.style.display = "none";
    });

    if (sections[sectionName]) {
        sections[sectionName].style.display = "block";
    }
}


function renderDashboard() {
    sections.dashboard.textContent = `Welcome, ${currentUser.name}! Please Select Tasks or Notes from the Navigation Menu.`;

    document.getElementById("logout-btn")
        .addEventListener("click", () => {
            localStorage.removeItem("user");
            currentUser = null;
            window.location.hash = "#login";
        });
}

function renderTasks() {
    const { createTask, readTasks, updateTask, deleteTask } = tasksCRUD(currentUser.id);

    const addTaskButton = document.getElementById("add-task-btn");

    // Add Task Modal
    addTaskButton.addEventListener("click", () => {
        const modal = document.getElementById("task-modal");
        modal.style.display = "flex";

        const form = document.getElementById("add-task-form");
        form.reset();
        document.getElementById("task-modal-title").textContent = "Add Task";

        form.addEventListener("submit", async (e) => {
            try {
                e.preventDefault();
                const title = document.getElementById("task-title").value;
                const description = document.getElementById("task-desc").value;
                const priority = document.getElementById("task-priority").value;
                const color = document.getElementById("task-color").value;

                await createTask({ title, description, priority, color });
                modal.style.display = "none";
            } catch (error) {
                console.log("Error Adding Task")
                console.log(error.message);
            }
        });

        modal.addEventListener("click", (e) => {
            if (e.target.id === "task-modal") {
                modal.style.display = "none";
            }
        });



    });

    // Fetch Tasks
    let tasks = [];
    async function fetchTasks() {
        tasks = await readTasks();
        console.log(tasks);
        renderList();
    }
    fetchTasks();

    // Render Tasks List
    function renderList() {
        const list = document.getElementById("tasks-list");

        if (tasks.length === 0) {
            list.innerHTML = "<p>No Tasks Available</p>";
            return;
        } else {
            list.innerHTML = tasks.map((task) => renderTaskItems(task)).join("");
        }

        // Handle Task Status Change using checkbox
        tasks.forEach((task) => {
            const checkbox = document.getElementById(`task-check-${task.id}`);
            checkbox.addEventListener("change", async (e) => {
                const status = e.target.checked;
                console.log(e.target.checked);
                await updateTask(task.id, { ...task, completed: status });
                renderTasks();
            });
        });

        // Handle Task Delete
        tasks.forEach((task) => {
            const delBtn = document.getElementById(`task-del-${task.id}`);
            delBtn.addEventListener("click", async (e) => {
                await deleteTask(task.id);
                renderTasks();
            });
        });

        // Handle Task Edit
        tasks.forEach((task) => {
            const editBtn = document.getElementById(`task-edit-${task.id}`);

            editBtn.addEventListener("click", async (e) => {
                const modal = document.getElementById("task-modal");
                modal.style.display = "flex";
                const form = document.getElementById("add-task-form");
                form.reset();
                document.getElementById("task-modal-title").textContent = "Edit Task";

                document.getElementById("task-title").value = task.title;
                document.getElementById("task-desc").value = task.description;
                document.getElementById("task-priority").value = task.priority;
                document.getElementById("task-color").value = task.color;

                form.addEventListener("submit", async (e) => {
                    try {
                        e.preventDefault();
                        console.log(task);
                        const title = document.getElementById("task-title").value;
                        const description = document.getElementById("task-desc").value;
                        const priority = document.getElementById("task-priority").value;
                        const color = document.getElementById("task-color").value;
                        await updateTask(task.id, { ...task, title, description, priority, color });
                        modal.style.display = "none";
                    } catch (error) {
                        console.log("Error Editing Task")
                        console.log(error.message);
                    }
                });


                modal.addEventListener("click", (e) => {
                    if (e.target.id === "task-modal") {
                        modal.style.display = "none";
                    }
                });
            });
        });
    }
}

// b = "string"
// 



// [N1, N2, N3, N4] n1=>n2=>n3

function renderTaskItems(task) {
    return `
    <div class="task-item" data-color="${task.color}">
  <div class="task-header">
    <h3>${task.title}</h3>
    <div>
      <button
        id="task-edit-${task.id
        }"
        class="task-edit-btn"
      >
        ✏️
      </button>
      <input type="checkbox" id="task-check-${task.id}" ${task.completed ?
            "checked" : ""} />
    </div>
  </div>
  <div class="task-description">${task.description}</div>
  <div class="task-footer">
    <span>${new Date(task.createdAt).toLocaleDateString()}</span>
    <button id="task-del-${task.id}">🗑️</button>
  </div>
</div>
`
}


// initialize the application
function initialize() {
    // gets current user if any
    currentUser = JSON.parse(localStorage.getItem("user"));

    // handle signup form submit
    document.getElementById("signup-form")
        .addEventListener("submit", async (e) => {
            try {
                e.preventDefault();

                const userName = document.getElementById("signup-username");
                const userEmail = document.getElementById("signup-email");
                const userPassword = document.getElementById("signup-password");

                const userObj = {
                    name: userName.value,
                    email: userEmail.value,
                    password: userPassword.value,
                }

                // first check with local storage
                const getUser = JSON.parse(localStorage.getItem("user"));
                if (getUser) {
                    currentUser = getUser;
                    return;
                }

                // check whether this user already exists or not on DB
                const checkUser = await fetch("http://localhost:3000/users");
                const checkUserData = await checkUser.json();

                checkUserData.forEach((item) => {
                    if (item.email === userEmail.value) {
                        throw new Error("Email Already Exists");
                    }
                });

                // create new user
                const res = await fetch("http://localhost:3000/users", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(userObj),
                });
                const data = await res.json();

                if (res.ok) {
                    localStorage.setItem("user", JSON.stringify(data));
                    currentUser = data;
                    window.location.hash = "#dashboard";
                } else {
                    throw new Error("Signup Failed");
                }
            } catch (error) {
                document.getElementById("signup-error").textContent = error.message;
            }
        });

    // handle login form submit
    document.getElementById("login-form")
        .addEventListener("submit", async (e) => {
            try {
                e.preventDefault();

                const userEmail = document.getElementById("login-email").value;
                const userPassword = document.getElementById("login-password").value;

                // first check with local storage
                const getUser = JSON.parse(localStorage.getItem("user"));
                if (getUser) {
                    currentUser = getUser;
                    return;
                }

                // check whether this user exists or not on DB
                const checkUser = await fetch("http://localhost:3000/users");
                const checkUserData = await checkUser.json(); // [{}, {}, {}]

                // find the index of that object where email on db = email eneterd by user
                const findIndex = checkUserData.findIndex((item) => item.email === userEmail);
                console.log(findIndex);
                if (findIndex !== -1) {
                    if (checkUserData[findIndex].password === userPassword) {
                        currentUser = checkUserData[findIndex];
                        localStorage.setItem("user", JSON.stringify(checkUserData[findIndex]));
                        window.location.hash = "#dashboard";
                    } else {
                        throw new Error("Invalid Credentilals");
                    }
                } else {
                    throw new Error("User Not Exists. Please Sign Up");
                }

            } catch (error) {
                document.getElementById("login-error").textContent = error.message;
            }
        });

    // handle route
    route();

    // handle hash change
    window.addEventListener("hashchange", route);
}
initialize(); // starts the app


// TASKS CRUD OPERATIONS
function tasksCRUD(currentUserId) {
    const STORAGE_KEY = `tasks-${currentUserId}`;
    const BASE_URL = "http://localhost:3000/tasks";

    function loadTasksFromLocal() {
        const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        return tasks; // [{}, {}, {}]  else []
    }

    function saveTasksToLocal(tasks) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }

    // CREATE TASK
    //{ title: "task1", description: "desc"}
    async function createTask(task) {
        try {
            const tasks = {
                ...task,
                completed: false,
                userId: currentUserId,
                createdAt: new Date().toISOString(),
            };

            const res = await fetch(BASE_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(tasks),
            });
            const data = await res.json();

            const localTasks = loadTasksFromLocal();
            localTasks.push(data);
            saveTasksToLocal(localTasks);
        } catch (error) {
            console.error("Error creating task:", error.message);
            return null;
        }
    }

    // READ TASKS
    async function readTasks() {
        try {
            // actual URL = http://localhost:3000/users?userId=123

            const res = await fetch(`${BASE_URL}?userId=${currentUserId}`); // query parameter
            const data = await res.json();
            return data;
        } catch (error) {
            console.error("Error reading tasks:", error.message);
            return loadTasksFromLocal();
        }
    }

    // UPDATE A TASK
    // updated data + unique ID of the task
    async function updateTask(taskId, updatedData) {
        try {
            const res = await fetch(`${BASE_URL}?userId=${currentUserId}`); // all the tasks of that user
            const data = await res.json();

            const taskToUpdate = data.find((task) => task.id === taskId);
            if (!taskToUpdate) {
                throw new Error("Task not found");
            }

            // http://localhost:3000/users/2
            const updateTask = await fetch(`${BASE_URL}/${taskId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedData)
            });
            const updateTaskData = await updateTask.json(); // {updated task obj}

            const localTasks = loadTasksFromLocal(); // arr[id] = {updated task obj}
            const taskIndex = localTasks.findIndex((task) => task.id === taskId);
            localTasks[taskIndex] = updateTaskData;
            saveTasksToLocal(localTasks);
        } catch (error) {
            console.error("Error updating task:", error.message);
        }
    }

    // DELETE A TASK
    // unique ID of the task
    async function deleteTask(taskId) {
        try {
            const res = await fetch(`${BASE_URL}/${taskId}`, {
                method: "DELETE",
            });
            const data = await res.json();

            const localTasks = loadTasksFromLocal();
            const taskIndex = localTasks.findIndex((task) => task.id === taskId);

            localTasks.splice(taskIndex, 1);
            saveTasksToLocal(localTasks);
            return true;

        } catch (error) {
            console.log("Error Deleting Task: ", error.message);
            return null;
        }
    }

    return {
        createTask,
        readTasks,
        updateTask,
        deleteTask
    };
}
