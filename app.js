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
    const hash = window.location.hash || "#"; // #dashboard
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

function signupUser() {
    const formData = document.getElementById("signup-form");

    formData.addEventListener("submit", async (e) => {
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

            // To-Do => check whether this user already exists or not
            const checkUser = await fetch("http://localhost:3000/users");
            const checkUserData = await checkUser.json();

            checkUserData.forEach((item) => {
                if (item.email === userEmail.value) {
                    throw new Error("Email Already Exists");
                }
            });

            // send the data to the server
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
                console.log(currentUser)
            } else {
                throw new Error("Signup Failed");
            }
        } catch (error) {
            document.getElementById("signup-error").textContent = error.message;
        }
    });
}

signupUser()