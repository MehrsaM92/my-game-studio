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

const gamesList =
    document.getElementById("games-list");

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

const adminGamesList =
    document.getElementById("admin-games-list");

const adminCommentsList =
    document.getElementById("admin-comments-list");

const adminLogout =
    document.getElementById("admin-logout");

const addGameButton =
    document.getElementById("add-game");

const gameMessage =
    document.getElementById("game-message");


// ==============================
// ADMIN EMAIL
// ==============================

const ADMIN_EMAIL =
    "ahmad_beigi_mehrsam@gmail.com";


// ==============================
// INITIAL STATE
// ==============================

adminLoginBox.style.display = "none";
adminPanel.style.display = "none";


// ==============================
// LOAD GAMES FOR EVERYONE
// ==============================

async function loadGames() {

    const { data, error } =
        await db
            .from("games")
            .select("*")
            .order("updated_at", {
                ascending: false
            });

    if (error) {

        console.error(error);

        gamesList.innerHTML =
            "<p>Unable to load games.</p>";

        return;
    }

    gamesList.innerHTML = "";

    if (!data || data.length === 0) {

        gamesList.innerHTML =
            "<p>No games available yet.</p>";

        return;
    }

    data.forEach(function(game) {

        const box =
            document.createElement("div");

        box.className = "game";


        const title =
            document.createElement("h2");

        title.textContent =
            game.name;


        const description =
            document.createElement("p");

        description.className =
            "game-description";

        description.textContent =
            game.description;


        box.appendChild(title);
        box.appendChild(description);

        gamesList.appendChild(box);

    });

}


// ==============================
// LOAD COMMENTS FOR EVERYONE
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
// CANCEL LOGIN
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

            await loadAdminGames();

            await loadAdminComments();

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
// CHECK SESSION
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

        await loadAdminGames();

        await loadAdminComments();

    }

}


// ==============================
// ADD GAME
// ==============================

addGameButton.addEventListener(
    "click",
    async function() {

        const name =
            document
                .getElementById("new-game-name")
                .value
                .trim();


        const description =
            document
                .getElementById("new-game-description")
                .value
                .trim();


        if (!name || !description) {

            gameMessage.textContent =
                "Please enter the game name and description.";

            gameMessage.className =
                "error";

            return;
        }


        const { error } =
            await db
                .from("games")
                .insert({
                    name: name,
                    description: description
                });


        if (error) {

            console.error(error);

            gameMessage.textContent =
                "Unable to add game.";

            gameMessage.className =
                "error";

            return;
        }


        document
            .getElementById("new-game-name")
            .value = "";

        document
            .getElementById("new-game-description")
            .value = "";


        gameMessage.textContent =
            "Game added successfully.";

        gameMessage.className =
            "success";


        await loadGames();

        await loadAdminGames();

    }
);


// ==============================
// LOAD ADMIN GAMES
// ==============================

async function loadAdminGames() {

    const { data, error } =
        await db
            .from("games")
            .select("*")
            .order("updated_at", {
                ascending: false
            });


    if (error) {

        console.error(error);

        adminGamesList.innerHTML =
            "<p>Unable to load games.</p>";

        return;
    }


    adminGamesList.innerHTML = "";


    if (!data || data.length === 0) {

        adminGamesList.innerHTML =
            "<p>No games yet.</p>";

        return;
    }


    data.forEach(function(game) {

        const box =
            document.createElement("div");

        box.className =
            "admin-game";


        const title =
            document.createElement("strong");

        title.textContent =
            game.name;


        const description =
            document.createElement("p");

        description.textContent =
            game.description;


        const actions =
            document.createElement("div");

        actions.className =
            "admin-actions";


        const editButton =
            document.createElement("button");

        editButton.textContent =
            "Edit";

        editButton.className =
            "edit-button";


        const deleteButton =
            document.createElement("button");

        deleteButton.textContent =
            "Delete";

        deleteButton.className =
            "delete-button";


        const editBox =
            document.createElement("div");

        editBox.className =
            "admin-edit-box";


        const editName =
            document.createElement("input");

        editName.type =
            "text";

        editName.value =
            game.name;


        const editDescription =
            document.createElement("textarea");

        editDescription.value =
            game.description;


        const updateButton =
            document.createElement("button");

        updateButton.textContent =
            "Save Changes";


        const cancelButton =
            document.createElement("button");

        cancelButton.textContent =
            "Cancel";

        cancelButton.style.background =
            "#555";


        editBox.appendChild(editName);
        editBox.appendChild(editDescription);
        editBox.appendChild(updateButton);
        editBox.appendChild(cancelButton);


        editButton.addEventListener(
            "click",
            function() {

                editBox.style.display =
                    "block";

            }
        );


        cancelButton.addEventListener(
            "click",
            function() {

                editBox.style.display =
                    "none";

            }
        );


        updateButton.addEventListener(
            "click",
            async function() {

                const newName =
                    editName.value.trim();

                const newDescription =
                    editDescription.value.trim();


                if (!newName || !newDescription) {

                    alert(
                        "Please enter both fields."
                    );

                    return;
                }


                const { error } =
                    await db
                        .from("games")
                        .update({
                            name: newName,
                            description: newDescription,
                            updated_at: new Date().toISOString()
                        })
                        .eq("id", game.id);


                if (error) {

                    console.error(error);

                    alert(
                        "Unable to update game."
                    );

                    return;
                }


                await loadGames();

                await loadAdminGames();

            }
        );


        deleteButton.addEventListener(
            "click",
            async function() {

                const confirmed =
                    confirm(
                        "Delete this game?"
                    );


                if (!confirmed) {

                    return;

                }


                const { error } =
                    await db
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


                await loadGames();

                await loadAdminGames();

            }
        );


        actions.appendChild(editButton);
        actions.appendChild(deleteButton);


        box.appendChild(title);
        box.appendChild(description);
        box.appendChild(actions);
        box.appendChild(editBox);


        adminGamesList.appendChild(box);

    });

}


// ==============================
// LOAD ADMIN COMMENTS
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


        const actions =
            document.createElement("div");

        actions.className =
            "admin-actions";


        const editButton =
            document.createElement("button");

        editButton.textContent =
            "Edit";


        const deleteButton =
            document.createElement("button");

        deleteButton.textContent =
            "Delete";

        deleteButton.className =
            "delete-comment";


        const editBox =
            document.createElement("div");

        editBox.className =
            "admin-edit-box";


        const editName =
            document.createElement("input");

        editName.value =
            comment.name;


        const editText =
            document.createElement("textarea");

        editText.value =
            comment.comment;


        const updateButton =
            document.createElement("button");

        updateButton.textContent =
            "Save Changes";


        const cancelButton =
            document.createElement("button");

        cancelButton.textContent =
            "Cancel";

        cancelButton.style.background =
            "#555";


        editBox.appendChild(editName);
        editBox.appendChild(editText);
        editBox.appendChild(updateButton);
        editBox.appendChild(cancelButton);


        editButton.addEventListener(
            "click",
            function() {

                editBox.style.display =
                    "block";

            }
        );


        cancelButton.addEventListener(
            "click",
            function() {

                editBox.style.display =
                    "none";

            }
        );


        updateButton.addEventListener(
            "click",
            async function() {

                const newName =
                    editName.value.trim();

                const newComment =
                    editText.value.trim();


                if (!newName || !newComment) {

                    alert(
                        "Please enter both fields."
                    );

                    return;
                }


                const { error } =
                    await db
                        .from("comments")
                        .update({
                            name: newName,
                            comment: newComment
                        })
                        .eq("id", comment.id);


                if (error) {

                    console.error(error);

                    alert(
                        "Unable to update comment."
                    );

                    return;
                }


                await loadComments();

                await loadAdminComments();

            }
        );


        deleteButton.addEventListener(
            "click",
            async function() {

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
                        .eq("id", comment.id);


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
        );


        actions.appendChild(editButton);
        actions.appendChild(deleteButton);


        box.appendChild(name);
        box.appendChild(text);
        box.appendChild(actions);
        box.appendChild(editBox);


        adminCommentsList.appendChild(box);

    });

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

loadGames();

loadComments();

checkAdminSession();
