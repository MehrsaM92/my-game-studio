const SUPABASE_URL =
    "https://gixhgrxerprsehkbedyq.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_zldmKFlZix45ZYpS69uDyg_aXYTZBUo";


const db = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ==============================
// ELEMENTS
// ==============================

const form =
    document.getElementById("comment-form");

const commentsList =
    document.getElementById("comments-list");

const adminOpenButton =
    document.getElementById("admin-open-button");

const adminLoginBox =
    document.getElementById("admin-login-box");

const adminCancelButton =
    document.getElementById("admin-cancel-button");

const adminPassword =
    document.getElementById("admin-password");

const adminLoginButton =
    document.getElementById("admin-login-button");

const adminMessage =
    document.getElementById("admin-message");

const adminPanel =
    document.getElementById("admin-panel");

const adminCommentsList =
    document.getElementById("admin-comments-list");

const adminLogout =
    document.getElementById("admin-logout");

const saveGameButton =
    document.getElementById("save-game");


// ==============================
// ADMIN EMAIL
// ==============================

const ADMIN_EMAIL =
    "ahmad_beigi_mehrsam@gmail.com";


// ==============================
// INITIAL STATE
// ==============================

if (adminLoginBox) {
    adminLoginBox.style.display = "none";
}

if (adminPanel) {
    adminPanel.style.display = "none";
}


// ==============================
// LOAD COMMENTS
// ==============================

async function loadComments() {

    const { data, error } = await db
        .from("comments")
        .select("*")
        .order("created_at", {
            ascending: false
        });


    if (error) {

        console.error(error);

        commentsList.innerHTML =
            "<p>Unable to load comments.</p>";

        return;
    }


    commentsList.innerHTML = "";


    data.forEach(function(comment) {

        const box =
            document.createElement("div");

        box.className =
            "comment";


        const name =
            document.createElement("h3");

        name.textContent =
            comment.name;


        const text =
            document.createElement("p");

        text.textContent =
            comment.comment;


        box.appendChild(name);
        box.appendChild(text);

        commentsList.appendChild(box);

    });

}


// ==============================
// SEND COMMENT
// ==============================

form.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const name =
            document
                .getElementById("name")
                .value
                .trim();


        const comment =
            document
                .getElementById("comment")
                .value
                .trim();


        if (!name || !comment) {

            alert(
                "Please enter your name and comment."
            );

            return;
        }


        const { error } =
            await db
                .from("comments")
                .insert({
                    name: name,
                    comment: comment
                });


        if (error) {

            console.error(error);

            alert(
                "Error sending comment."
            );

            return;
        }


        form.reset();

        await loadComments();

    }
);


// ==============================
// OPEN ADMIN LOGIN
// ==============================

adminOpenButton.addEventListener(
    "click",
    function() {

        adminLoginBox.style.display =
            "block";

        adminOpenButton.style.display =
            "none";

        adminPassword.focus();

    }
);


// ==============================
// CANCEL ADMIN LOGIN
// ==============================

adminCancelButton.addEventListener(
    "click",
    function() {

        adminLoginBox.style.display =
            "none";

        adminOpenButton.style.display =
            "inline-block";

        adminPassword.value = "";

        adminMessage.textContent = "";

    }
);


// ==============================
// ADMIN LOGIN
// ==============================

adminLoginButton.addEventListener(
    "click",
    async function() {

        const password =
            adminPassword
                .value
                .trim();


        if (!password) {

            adminMessage.textContent =
                "Please enter your password.";

            return;
        }


        adminMessage.textContent =
            "Logging in...";


        const { data, error } =
            await db.auth.signInWithPassword({

                email: ADMIN_EMAIL,

                password: password

            });


        if (error) {

            console.error(error);

            adminMessage.textContent =
                "Incorrect password.";

            return;
        }


        if (data.session) {

            adminMessage.textContent = "";

            adminLoginBox.style.display =
                "none";

            adminPanel.style.display =
                "block";

            await loadAdminComments();

            loadGame();

        }

    }
);


// ==============================
// ENTER KEY LOGIN
// ==============================

adminPassword.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            adminLoginButton.click();

        }

    }
);


// ==============================
// CHECK EXISTING SESSION
// ==============================

async function checkAdminSession() {

    const {
        data: { session },
        error
    } = await db.auth.getSession();


    if (error) {

        console.error(error);

        return;
    }


    if (session) {

        adminOpenButton.style.display =
            "none";

        adminPanel.style.display =
            "block";

        await loadAdminComments();

        loadGame();

    }

}


// ==============================
// LOAD GAME
// ==============================

function loadGame() {

    const savedName =
        localStorage.getItem(
            "gameName"
        );

    const savedDescription =
        localStorage.getItem(
            "gameDescription"
        );


    if (savedName) {

        document.getElementById(
            "game-title"
        ).textContent =
            savedName;


        document.getElementById(
            "admin-game-name"
        ).value =
            savedName;

    }


    if (savedDescription) {

        document.getElementById(
            "game-description"
        ).textContent =
            savedDescription;


        document.getElementById(
            "admin-game-description"
        ).value =
            savedDescription;

    }

}


// ==============================
// SAVE GAME
// ==============================

saveGameButton.addEventListener(
    "click",
    function() {

        const name =
            document
                .getElementById(
                    "admin-game-name"
                )
                .value
                .trim();


        const description =
            document
                .getElementById(
                    "admin-game-description"
                )
                .value
                .trim();


        const gameMessage =
            document.getElementById(
                "game-message"
            );


        if (!name || !description) {

            gameMessage.textContent =
                "Please enter the game name and description.";

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


        document.getElementById(
            "game-title"
        ).textContent =
            name;


        document.getElementById(
            "game-description"
        ).textContent =
            description;


        gameMessage.textContent =
            "Game saved successfully.";

    }
);


// ==============================
// LOAD COMMENTS FOR ADMIN
// ==============================

async function loadAdminComments() {

    const {
        data,
        error
    } = await db
        .from("comments")
        .select("*")
        .order("created_at", {
            ascending: false
        });


    if (error) {

        console.error(error);

        adminCommentsList.innerHTML =
            "<p>Unable to load comments.</p>";

        return;
    }


    adminCommentsList.innerHTML = "";


    if (data.length === 0) {

        adminCommentsList.innerHTML =
            "<p>No comments yet.</p>";

        return;
    }


    data.forEach(function(comment) {

        const box =
            document.createElement("div");

        box.className =
            "admin-comment";


        const name =
            document.createElement("strong");

        name.textContent =
            comment.name;


        const text =
            document.createElement("p");

        text.textContent =
            comment.comment;


        const deleteButton =
            document.createElement("button");

        deleteButton.textContent =
            "Delete";

        deleteButton.className =
            "delete-comment";


        deleteButton.addEventListener(
            "click",
            function() {

                deleteComment(
                    comment.id
                );

            }
        );


        box.appendChild(name);

        box.appendChild(text);

        box.appendChild(deleteButton);

        adminCommentsList.appendChild(box);

    });

}


// ==============================
// DELETE COMMENT
// ==============================

async function deleteComment(id) {

    const confirmed =
        confirm(
            "Delete this comment?"
        );


    if (!confirmed) {

        return;
    }


    const { error } =
        await db
            .from("comments")
            .delete()
            .eq("id", id);


    if (error) {

        console.error(error);

        alert(
            "Unable to delete comment."
        );

        return;
    }


    await loadComments();

    await loadAdminComments();

}


// ==============================
// LOGOUT
// ==============================

adminLogout.addEventListener(
    "click",
    async function() {

        await db.auth.signOut({
            scope: "local"
        });


        adminPanel.style.display =
            "none";


        adminLoginBox.style.display =
            "none";


        adminOpenButton.style.display =
            "inline-block";


        adminPassword.value = "";

        adminMessage.textContent = "";

    }
);


// ==============================
// START
// ==============================

loadComments();

checkAdminSession();
