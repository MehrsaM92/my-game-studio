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
// LOAD GAME FOR EVERYONE
// ==============================

async function loadGame() {

    const { data, error } = await db
        .from("games")
        .select("id, name, description, updated_at")
        .order("updated_at", {
            ascending: false
        })
        .limit(1);

    if (error) {

        console.error(error);

        document.getElementById("game-title").textContent =
            "Unable to load game";

        document.getElementById("game-description").textContent =
            "There was a problem loading the game.";

        return;
    }

    const gameTitle =
        document.getElementById("game-title");

    const gameDescription =
        document.getElementById("game-description");

    const adminGameName =
        document.getElementById("admin-game-name");

    const adminGameDescription =
        document.getElementById("admin-game-description");


    if (!data || data.length === 0) {

        gameTitle.textContent =
            "No game yet";

        gameDescription.textContent =
            "The game will be added soon.";

        adminGameName.value = "";
        adminGameDescription.value = "";

        return;
    }


    const game = data[0];


    gameTitle.textContent =
        game.name;

    gameDescription.textContent =
        game.description;


    if (adminGameName) {
        adminGameName.value =
            game.name;
    }

    if (adminGameDescription) {
        adminGameDescription.value =
            game.description;
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
// LOAD COMMENTS
// ==============================

async function loadComments() {

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

        adminPassword.value =
            "";

        adminMessage.textContent =
            "";

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


        const {
            data,
            error
        } = await db.auth.signInWithPassword({

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


        if (data.session) {

            adminMessage.textContent =
                "";

            adminLoginBox.style.display =
                "none";

            adminPanel.style.display =
                "block";

            adminOpenButton.style.display =
                "none";


            await loadAdminComments();

            await loadGame();

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
        data: {
            session
        },
        error
    } = await db.auth.getSession();


    if (error) {

        console.error(error);

        return;
    }


    if (session) {

        adminOpenButton.style.display =
            "none";

        adminLoginBox.style.display =
            "none";

        adminPanel.style.display =
            "block";


        await loadAdminComments();

        await loadGame();

    }

}


// ==============================
// SAVE / UPDATE GAME
// ==============================

saveGameButton.addEventListener(
    "click",
    async function() {

        const name =
            document
                .getElementById("admin-game-name")
                .value
                .trim();


        const description =
            document
                .getElementById("admin-game-description")
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


        gameMessage.textContent =
            "Saving...";


        const {
            data: {
                session
            }
        } = await db.auth.getSession();


        if (!session) {

            gameMessage.textContent =
                "Admin login required.";

            return;
        }


        const {
            data: existingGames,
            error: findError
        } = await db
            .from("games")
            .select("id")
            .order("updated_at", {
                ascending: false
            })
            .limit(1);


        if (findError) {

            console.error(findError);

            gameMessage.textContent =
                "Unable to check existing game.";

            return;
        }


        let result;


        if (existingGames &&
            existingGames.length > 0) {

            const gameId =
                existingGames[0].id;


            result = await db
                .from("games")
                .update({
                    name: name,
                    description: description,
                    updated_at: new Date().toISOString()
                })
                .eq("id", gameId);

        } else {

            result = await db
                .from("games")
                .insert({
                    name: name,
                    description: description
                });

        }


        if (result.error) {

            console.error(result.error);

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
// DELETE GAME
// ==============================

async function deleteGame() {

    const confirmed =
        confirm(
            "Delete the current game?"
        );


    if (!confirmed) {
        return;
    }


    const {
        data: existingGames,
        error: findError
    } = await db
        .from("games")
        .select("id");


    if (findError) {

        console.error(findError);

        alert(
            "Unable to find the game."
        );

        return;
    }


    if (!existingGames ||
        existingGames.length === 0) {

        alert(
            "There is no game to delete."
        );

        return;
    }


    for (const game of existingGames) {

        const {
            error
        } = await db
            .from("games")
            .delete()
            .eq("id", game.id);


        if (error) {

            console.error(error);

            alert(
                "Unable to delete game."
            );

            return;
        }

    }


    await loadGame();

    alert(
        "Game deleted successfully."
    );

}


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


    adminCommentsList.innerHTML =
        "";


    if (!data || data.length === 0) {

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


        const editButton =
            document.createElement("button");

        editButton.textContent =
            "Edit";

        editButton.addEventListener(
            "click",
            function() {

                editComment(
                    comment.id,
                    comment.name,
                    comment.comment
                );

            }
        );


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

        box.appendChild(editButton);

        box.appendChild(deleteButton);

        adminCommentsList.appendChild(box);

    });

}


// ==============================
// EDIT COMMENT
// ==============================

async function editComment(
    id,
    oldName,
    oldComment
) {

    const newName =
        prompt(
            "Edit name:",
            oldName
        );


    if (newName === null) {
        return;
    }


    const newComment =
        prompt(
            "Edit comment:",
            oldComment
        );


    if (newComment === null) {
        return;
    }


    const name =
        newName.trim();

    const comment =
        newComment.trim();


    if (!name || !comment) {

        alert(
            "Name and comment cannot be empty."
        );

        return;
    }


    const {
        error
    } = await db
        .from("comments")
        .update({
            name: name,
            comment: comment
        })
        .eq("id", id);


    if (error) {

        console.error(error);

        alert(
            "Unable to edit comment."
        );

        return;
    }


    await loadComments();

    await loadAdminComments();

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
        error
    } = await db
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

        adminPassword.value =
            "";

        adminMessage.textContent =
            "";

    }
);


// ==============================
// START
// ==============================

loadComments();

loadGame();

checkAdminSession();        
