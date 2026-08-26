const SUPABASE_URL = "https://gixhgrxerprsehkbedyq.supabase.co";
const SUPABASE_KEY = "sb_publishable_zldmKFlZix45ZYpS69uDyg_aXYTZBUo";

const db = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const form = document.getElementById("comment-form");
const commentsList = document.getElementById("comments-list");

async function loadComments() {

    const { data, error } = await db
        .from("comments")
        .select("*")
        .order("created_at", {
            ascending: false
        });

    if (error) {
        console.error(error);
        return;
    }

    commentsList.innerHTML = "";

    data.forEach(comment => {

        const box = document.createElement("div");

        box.className = "comment";

        const name = document.createElement("h3");
        name.textContent = comment.name;

        const text = document.createElement("p");
        text.textContent = comment.comment;

        box.appendChild(name);
        box.appendChild(text);

        commentsList.appendChild(box);
    });
}

form.addEventListener("submit", async function(event) {

    event.preventDefault();

    const name =
        document.getElementById("name").value.trim();

    const comment =
        document.getElementById("comment").value.trim();

    if (!name || !comment) {
        alert("Please enter your name and comment.");
        return;
    }

    const { error } = await db
        .from("comments")
        .insert({
            name: name,
            comment: comment
        });

    if (error) {
        console.error(error);
        alert("Error sending comment.");
        return;
    }

    form.reset();

    await loadComments();
});

loadComments();
