const commentForm = document.getElementById("comment-form");
const commentList = document.getElementById("comment-list");

let comments = JSON.parse(
    localStorage.getItem("comments") || "[]"
);


function displayComments() {

    commentList.innerHTML = "";

    comments.forEach(function(comment) {

        const box = document.createElement("div");

        box.className = "comment";

        const name = document.createElement("strong");
        name.textContent = comment.name;

        const text = document.createElement("p");
        text.textContent = comment.text;

        box.appendChild(name);
        box.appendChild(text);

        commentList.appendChild(box);
    });
}


commentForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const name =
        document.getElementById("comment-name").value.trim();

    const text =
        document.getElementById("comment-text").value.trim();

    if (!name || !text) {
        return;
    }

    comments.push({
        name: name,
        text: text
    });

    localStorage.setItem(
        "comments",
        JSON.stringify(comments)
    );

    commentForm.reset();

    displayComments();
});


displayComments();
