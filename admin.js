const ADMIN_PASSWORD = "-I'm Mehrsam-";


const loginSection =
    document.getElementById("login-section");

const adminSection =
    document.getElementById("admin-section");

const loginButton =
    document.getElementById("login-button");

const passwordInput =
    document.getElementById("admin-password");

const loginMessage =
    document.getElementById("login-message");


loginButton.addEventListener("click", function() {

    if (passwordInput.value === ADMIN_PASSWORD) {

        loginSection.style.display = "none";
        adminSection.style.display = "block";

    } else {

        loginMessage.textContent =
            "Incorrect password.";

    }

});


document
    .getElementById("save-game")
    .addEventListener("click", function() {

        const name =
            document.getElementById("game-name").value.trim();

        const description =
            document
                .getElementById("game-description")
                .value
                .trim();


        if (!name || !description) {

            document.getElementById("admin-message")
                .textContent =
                "Please enter both the game name and description.";

            return;
        }


        localStorage.setItem(
            "gameName",
            name
        );

        localStorage.setItem(
            "gameDescription",
            description
        );


        document.getElementById("admin-message")
            .textContent =
            "Game saved successfully.";
    });


document
    .getElementById("logout")
    .addEventListener("click", function() {

        window.location.href = "index.html";

    });
