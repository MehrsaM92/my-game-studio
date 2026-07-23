from flask import Flask, render_template_string, send_file
import os

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


HTML = """
<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">

<meta name="viewport"
content="width=device-width, initial-scale=1.0">

<title>My Game Studio</title>

<style>

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    scroll-behavior: smooth;
}

body {
    font-family: Arial, sans-serif;
    background: #111827;
    color: white;
}

header {
    background: #0f172a;
    padding: 20px 50px;

    display: flex;
    justify-content: space-between;
    align-items: center;

    border-bottom: 1px solid #334155;

    position: sticky;
    top: 0;

    z-index: 1000;
}

.logo {
    font-size: 26px;
    font-weight: bold;
    color: #38bdf8;
}

nav a {
    color: white;
    text-decoration: none;
    margin-left: 25px;
    font-size: 16px;
}

nav a:hover {
    color: #38bdf8;
}

.hero {
    min-height: 500px;

    display: flex;
    justify-content: center;
    align-items: center;

    text-align: center;

    padding: 50px 20px;

    background:
    linear-gradient(
        135deg,
        #0f172a,
        #1e293b,
        #0c4a6e
    );
}

.hero-content {
    max-width: 800px;
}

.hero h1 {
    font-size: 60px;
    margin-bottom: 20px;
}

.hero p {
    font-size: 20px;
    color: #cbd5e1;
    line-height: 1.6;
    margin-bottom: 30px;
}

.button {
    display: inline-block;

    padding: 14px 30px;

    background: #0ea5e9;

    color: white;

    text-decoration: none;

    border-radius: 8px;

    font-weight: bold;

    border: none;

    cursor: pointer;

    transition: 0.3s;
}

.button:hover {
    background: #0284c7;
    transform: translateY(-2px);
}

.games {
    padding: 70px 30px;
    text-align: center;
}

.games h2 {
    font-size: 40px;
    margin-bottom: 40px;
}

.game-grid {
    display: grid;

    grid-template-columns:
    repeat(
        auto-fit,
        minmax(280px, 1fr)
    );

    gap: 30px;

    max-width: 1000px;

    margin: auto;
}

.game-card {
    background: #1e293b;

    border-radius: 12px;

    padding: 30px;

    border: 1px solid #334155;

    transition: 0.3s;
}

.game-card:hover {
    transform: translateY(-5px);
    border-color: #38bdf8;
}

.game-card h3 {
    font-size: 28px;
    margin-bottom: 15px;
}

.game-card p {
    color: #cbd5e1;
    line-height: 1.6;
    margin-bottom: 25px;
}

.game-icon {
    font-size: 60px;
    margin-bottom: 20px;
}

.download-button {
    background: #f59e0b;
    margin-top: 10px;
}

.download-button:hover {
    background: #d97706;
}

.leaderboard {
    padding: 70px 30px;

    text-align: center;

    background: #0f172a;
}

.leaderboard h2 {
    font-size: 36px;
    margin-bottom: 20px;
}

.leaderboard p {
    color: #94a3b8;
}

.about {
    padding: 70px 30px;

    background: #111827;

    text-align: center;
}

.about h2 {
    font-size: 36px;
    margin-bottom: 20px;
}

.about p {
    max-width: 700px;

    margin: auto;

    color: #cbd5e1;

    line-height: 1.8;
}

footer {
    padding: 25px;

    text-align: center;

    color: #94a3b8;

    background: #020617;
}

@media (max-width: 700px) {

    header {
        padding: 20px;

        flex-direction: column;

        gap: 15px;
    }

    nav {
        display: flex;

        flex-wrap: wrap;

        justify-content: center;

        gap: 10px;
    }

    nav a {
        margin: 0 8px;
    }

    .hero h1 {
        font-size: 40px;
    }

    .hero p {
        font-size: 17px;
    }

    .games {
        padding: 50px 20px;
    }

    .game-grid {
        grid-template-columns: 1fr;
    }

}

</style>

</head>


<body>


<header>

<div class="logo">
My Game Studio
</div>

<nav>

<a href="#home">
Home
</a>

<a href="#games">
Games
</a>

<a href="#leaderboard">
Leaderboard
</a>

<a href="#about">
About
</a>

</nav>

</header>


<section
class="hero"
id="home"
>

<div class="hero-content">

<h1>
Welcome to My Game Studio
</h1>

<p>
Download my games and play!
</p>

<a
href="#games"
class="button"
>
Explore Games
</a>

</div>

</section>


<section
class="games"
id="games"
>

<h2>
My Games
</h2>


<div class="game-grid">


<div class="game-card">

<div class="game-icon">
🐦
</div>

<h3>
Flappy Bird
</h3>

<p>
Fly through the pipes,
avoid obstacles,
and try to achieve
the highest score.
</p>


<a
href="/download/flappy"
class="button download-button"
>
Download Flappy Bird
</a>

</div>



<div class="game-card">

<div class="game-icon">
🚗
</div>

<h3>
Car Game
</h3>

<p>
Drive your car,
avoid obstacles,
and survive as long
as possible.
</p>


<a
href="/download/car"
class="button download-button"
>
Download Car Game
</a>

</div>


</div>

</section>


<section
class="leaderboard"
id="leaderboard"
>

<h2>
Flappy Leaderboard
</h2>

<p>
Leaderboard will be available here.
</p>

</section>


<section
class="about"
id="about"
>

<h2>
About Me
</h2>

<p>

I'm an independent game developer
creating games and experimenting
with new ideas.

This website is where I publish
my games and future projects.

I'm Mehrsam Ahmadbeigi.

</p>

</section>


<footer>

<p>
© 2026 My Game Studio.
All rights reserved.
</p>

</footer>


</body>

</html>
"""


@app.route("/")
def home():

    return render_template_string(
        HTML
    )


@app.route("/download/flappy")
def download_flappy():

    file_path = os.path.join(
        BASE_DIR,
        "FlappyBird.exe"
    )

    if not os.path.isfile(file_path):

        return (
            "FlappyBird.exe was not found "
            "next to website.py.",
            404
        )

    return send_file(
        file_path,
        as_attachment=True,
        download_name="FlappyBird.exe"
    )


@app.route("/download/car")
def download_car():

    file_path = os.path.join(
        BASE_DIR,
        "CarGame.exe"
    )

    if not os.path.isfile(file_path):

        return (
            "CarGame.exe was not found "
            "next to website.py.",
            404
        )

    return send_file(
        file_path,
        as_attachment=True,
        download_name="CarGame.exe"
    )


if __name__ == "__main__":
    app.run()