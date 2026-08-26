const SUPABASE_URL = "https://gixhgrxerprsehkbedyq.supabase.co";
const SUPABASE_KEY = "sb_publishable_zldmKFlZix45ZYpS69uDyg_aXYTZBUo";

const db = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const loginSection = document.getElementById("login-section");
const adminSection = document.getElementById("admin-section");

const loginButton = document.getElementById("login-button");
const passwordInput = document.getElementById("admin-password");
const loginMessage = document.getElementById("login-message");

adminSection.style.display = "none";

loginButton.addEventListener("click", async function () {

    const password = passwordInput.value.trim();

    if (!password) {
        loginMessage.textContent = "Please enter your password.";
        return;
    }

    loginMessage.textContent = "Logging in...";

    /*
       IMPORTANT:
       The email must be the same email
       you used when creating the Admin user
       in Supabase Authentication.
    */

    const email = "ahmad_beigi_mehrsam@gmail.com";

    const { data, error } = await db.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        console.error(error);
        loginMessage.textContent = "Incorrect email or password.";
        return;
    }

    loginSection.style.display = "none";
    adminSection.style.display = "block";

    loginMessage.textContent = "";
});


document.getElementById("logout").addEventListener(
    "click",
    async function () {

        await db.auth.signOut();

        window.location.href = "index.html";
    }
);
