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
// ADMIN
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
// LOAD GAMES
// ==============================

async function loadGame() {

    const { data, error } = await db
        .from("games")
        .select("*")
        .order("updated_at", {
            ascending: false
        });

    if (error) {

        console.error(error);

        const title =
            document.getElementById("game-title");

        const description =
            document.getElementById("game-description");

        if (title) {
            title.textContent = "Unable to load game";
        }

        if (description) {
            description.textContent =
                "There was a problem loading the games.";
        }

        return;
    }


    const title =
        document.getElementById("game-title");

    const description =
        document.getElementById("game-description");


    if (!data || data.length === 0) {

        if (title) {
            title.textContent = "No games yet";
        }

        if (description) {
            description.textContent =
                "The admin has not added a game yet.";
        }

        return;
    }


    const game = data[0];


    if (title) {
        title.textContent =
            game.name;
    }


    if (description) {
        description.textContent =
            game.description;
    }


    const adminName =
        document.getElementById("admin-game-name");

    const adminDescription =
        document.getElementById(
            "admin-game-description"
        );


    if (adminName) {
        adminName.value =
            game.name;
    }


    if (adminDescription) {
        adminDescription.value =
            game.description;
    }


    const adminPanel =
        document.getElementById("admin-panel");

    if (adminPanel) {

        adminPanel.dataset.gameId =
            game.id;

    }

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
// LOAD PUBLIC COMMENTS
// ==============================

async function loadComments() {

    const { data, error } =
        await db
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


    if (!data || data.length === 0) {

        commentsList.innerHTML =
            "<p>No comments yet.</p>";

        return;
    }


    data.forEach(
        function(comment) {

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

        }
    );

}


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

                email:
                    ADMIN_EMAIL,

                password:
                    password

            });


        if (error) {

            console.error(error);

            adminMessage.textContent =
                "Incorrect password.";

            return;
        }


        if (!data.session) {

            adminMessage.textContent =
                "Login failed.";

            return;
        }


        adminMessage.textContent = "";


        adminLoginBox.style.display =
            "none";


        adminPanel.style.display =
            "block";


        adminOpenButton.style.display =
            "none";


        await loadAdminComments();

        await loadGame();

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
// CHECK ADMIN SESSION
// ==============================

async function checkAdminSession() {

    const {
        data: {
            session
        },
        error
    } = await db.auth.getSession();


    if (error) {

        console.error(error);

        return;
    }


    if (!session) {

        return;
    }


    if (
        session.user.email
        !== ADMIN_EMAIL
    ) {

        await db.auth.signOut();

        return;
    }


    adminOpenButton.style.display =
        "none";

    adminPanel.style.display =
        "block";


    await loadAdminComments();

    await loadGame();

}


// ==============================
// SAVE / UPDATE GAME
// ==============================

saveGameButton.addEventListener(
    "click",
    async function() {

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


        const {
            data: {
                user
            }
        } = await db.auth.getUser();


        if (
            !user ||
            user.email !== ADMIN_EMAIL
        ) {

            gameMessage.textContent =
                "Admin login required.";

            return;
        }


        const gameId =
            adminPanel.dataset.gameId;


        let result;


        if (gameId) {

            // UPDATE EXISTING GAME

            result =
                await db
                    .from("games")
                    .update({
                        name: name,
                        description: description,
                        updated_at:
                            new Date().toISOString()
                    })
                    .eq(
                        "id",
                        gameId
                    );

        } else {

            // CREATE NEW GAME

            result =
                await db
                    .from("games")
                    .insert({
                        name: name,
                        description: description
                    });

        }


        if (result.error) {

            console.error(
                result.error
            );

            gameMessage.textContent =
                "Unable to save game.";

            return;
        }


        gameMessage.textContent =
            "Game saved successfully.";


        await loadGame();

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


    if (!data || data.length === 0) {

        adminCommentsList.innerHTML =
            "<p>No comments yet.</p>";

        return;
    }


    data.forEach(
        function(comment) {

            const box =
                document.createElement("div");

            box.className =
                "admin-comment";


            const name =
                document.createElement("input");

            name.type =
                "text";

            name.value =
                comment.name;


            const text =
                document.createElement("textarea");

            text.value =
                comment.comment;


            const updateButton =
                document.createElement("button");

            updateButton.textContent =
                "Update";


            const deleteButton =
                document.createElement("button");

            deleteButton.textContent =
                "Delete";

            deleteButton.className =
                "delete-comment";


            const message =
                document.createElement("p");


            // UPDATE COMMENT

            updateButton.addEventListener(
                "click",
                async function() {

                    await updateComment(
                        comment.id,
                        name.value.trim(),
                        text.value.trim(),
                        message
                    );

                }
            );


            // DELETE COMMENT

            deleteButton.addEventListener(
                "click",
                async function() {

                    await deleteComment(
                        comment.id
                    );

                }
            );


            box.appendChild(name);

            box.appendChild(text);

            box.appendChild(updateButton);

            box.appendChild(deleteButton);

            box.appendChild(message);


            adminCommentsList.appendChild(
                box
            );

        }
    );

}


// ==============================
// UPDATE COMMENT
// ==============================

async function updateComment(
    id,
    name,
    comment,
    message
) {

    if (!name || !comment) {

        message.textContent =
            "Name and comment cannot be empty.";

        return;
    }


    const {
        data: {
            user
        }
    } = await db.auth.getUser();


    if (
        !user ||
        user.email !== ADMIN_EMAIL
    ) {

        message.textContent =
            "Admin login required.";

        return;
    }


    const { error } =
        await db
            .from("comments")
            .update({
                name: name,
                comment: comment
            })
            .eq(
                "id",
                id
            );


    if (error) {

        console.error(error);

        message.textContent =
            "Unable to update comment.";

        return;
    }


    message.textContent =
        "Comment updated.";


    await loadComments();

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


    const {
        data: {
            user
        }
    } = await db.auth.getUser();


    if (
        !user ||
        user.email !== ADMIN_EMAIL
    ) {

        alert(
            "Admin login required."
        );

        return;
    }


    const { error } =
        await db
            .from("comments")
            .delete()
            .eq(
                "id",
                id
            );


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


        adminPassword.value =
            "";


        adminMessage.textContent =
            "";

    }
);


// ==============================
// START WEBSITE
// ==============================

loadGame();

loadComments();

checkAdminSession();
