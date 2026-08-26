const form = document.getElementById("comment-form");
const commentsList = document.getElementById("comments-list");

const API_URL = "http://127.0.0.1:5000";


async function loadComments() {

    try {

        const response = await fetch(
            `${API_URL}/comments`
        );

        const comments = await response.json();

        commentsList.innerHTML = "";

        comments.forEach(showComment);

    } catch (error) {

        console.error(
            "Could not connect to server:",
            error
        );

    }
}


function showComment(comment) {

    const box = document.createElement("div");

    const name = document.createElement("h3");
    name.textContent = comment.name;

    const text = document.createElement("p");
    text.textContent = comment.comment;

    box.appendChild(name);
    box.appendChild(text);

    commentsList.appendChild(box);
}


form.addEventListener("submit", async function(event) {

    event.preventDefault();

    const name =
        document.getElementById("name").value.trim();

    const comment =
        document.getElementById("comment").value.trim();


    if (!name || !comment) {
        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/comments`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name,
                    comment: comment
                })
            }
        );


        if (!response.ok) {
            throw new Error("Failed to save comment.");
        }


        form.reset();

        await loadComments();

    } catch (error) {

        console.error(error);

        alert(
            "Could not connect to the server."
        );
    }

});


loadComments();
