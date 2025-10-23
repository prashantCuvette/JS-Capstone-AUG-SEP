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
        switch (page) {
            case "dashboard":
                //show dashboard
                break;
            case "tasks":
                //show tasks
                break;
            case "notes":
                //show notes
                break;
            default:
            //show dashboard
        }
    } else {
        if (hash === "login") {
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


route();