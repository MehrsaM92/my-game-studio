const form = document.getElementById("comment-form");
const commentsList = document.getElementById("comments-list");

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const comment = document.getElementById("comment").value.trim();

    if (name === "" || comment === "") {
        return;
    }

    const commentBox = document.createElement("div");
    commentBox.className = "comment";

    const nameElement = document.createElement("h3");
    nameElement.textContent = name;

    const commentElement = document.createElement("p");
    commentElement.textContent = comment;

    commentBox.appendChild(nameElement);
    commentBox.appendChild(commentElement);

    commentsList.appendChild(commentBox);

    form.reset();
});
