const SUPABASE_URL = "https://gixhgrxerprsehkbedyq.supabase.co/rest/v1/";
const SUPABASE_KEY = "sb_publishable_zldmKFlZix45ZYpS69uDyg_aXYTZBUo";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const form = document.getElementById("comment-form");
const commentsList = document.getElementById("comments-list");


// ==============================
// Load comments
// ==============================

async function loadComments() {

    commentsList.innerHTML = "<p>Loading comments...</p>";

    const { data, error } = await supabaseClient
        .from("comments")
        .select("id, name, comment, created_at")
        .order("created_at", { ascending: false });

    if (error) {

        console.error("Error loading comments:", error);

        commentsList.innerHTML =
            "<p>Could not load comments.</p>";

        return;
    }

    commentsList.innerHTML = "";

    if (!data || data.length === 0) {

        commentsList.innerHTML =
            "<p>No comments yet. Be the first!</p>";

        return;
    }

    data.forEach(showComment);
}


// ==============================
// Show one comment
// ==============================

function showComment(comment) {

    const box = document.createElement("div");

    box.className = "comment";

    const name = document.createElement("h3");

    name.textContent = comment.name;

    const text = document.createElement("p");

    text.textContent = comment.comment;

    const date = document.createElement("small");

    if (comment.created_at) {

        date.textContent =
            new Date(comment.created_at).toLocaleString();

    }

    box.appendChild(name);
    box.appendChild(text);
    box.appendChild(date);

    commentsList.appendChild(box);
}


// ==============================
// Send comment
// ==============================

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    const nameInput =
        document.getElementById("name");

    const commentInput =
        document.getElementById("comment");

    const name =
        nameInput.value.trim();

    const comment =
        commentInput.value.trim();


    if (!name || !comment) {

        alert("Please enter your name and comment.");

        return;
    }


    const button =
        form.querySelector("button");

    button.disabled = true;

    button.textContent = "Sending...";


    const { error } = await supabaseClient
        .from("comments")
        .insert([
            {
                name: name,
                comment: comment
            }
        ]);


    if (error) {

        console.error("Error sending comment:", error);

        alert(
            "Could not send your comment. Please try again."
        );

        button.disabled = false;

        button.textContent = "Send Comment";

        return;
    }


    form.reset();

    button.disabled = false;

    button.textContent = "Send Comment";


    await loadComments();

});


// ==============================
// Start
// ==============================

loadComments();
