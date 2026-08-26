const form = document.getElementById("comment-form");
const commentsList = document.getElementById("comments-list");

let comments = JSON.parse(
    localStorage.getItem("comments") || "[]"
);


function saveComments() {

    localStorage.setItem(
        "comments",
        JSON.stringify(comments)
    );

}


function showComments() {

    commentsList.innerHTML = "";

    comments.forEach(comment => {

        const box = document.createElement("div");

        const name = document.createElement("h3");
        name.textContent = comment.name;

        const text = document.createElement("p");
        text.textContent = comment.text;

        box.appendChild(name);
        box.appendChild(text);

        commentsList.appendChild(box);

    });

}


form.addEventListener("submit", function(event) {

    event.preventDefault();

    const name =
        document.getElementById("name").value.trim();

    const text =
        document.getElementById("comment").value.trim();

    if (!name || !text) {
        return;
    }

    comments.push({
        name: name,
        text: text
    });

    saveComments();

    showComments();

    form.reset();

});


showComments();
