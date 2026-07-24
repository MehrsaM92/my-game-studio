from flask import Flask, render_template_string, send_file, request, jsonify
import os
import json

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

LEADERBOARD_FILE = os.path.join(
    BASE_DIR,
    "leaderboard.json"
)

HTML = """
<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">

<meta name="google-site-verification" content="ULKlsCJLxKZPZcj4H5NkXbxu0p8OkCf2ioaLwIFockY">

<meta name="viewport" content="width=device-width, initial-scale=1.0">

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

.download-buttons {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.platform-title {
    font-size: 14px;
    color: #94a3b8;
    margin-top: 5px;
}

.download-button {
    background: #f59e0b;
    width: 100%;
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
    margin-bottom: 30px;
}

.leaderboard-box {
    max-width: 700px;
    margin: auto;
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 12px;
    padding: 25px;
}

.leaderboard-row {
    display: grid;
    grid-template-columns: 70px 1fr 100px;
    align-items: center;
    gap: 10px;
    padding: 15px;
    margin-bottom: 10px;
    background: #0f172a;
    border-radius: 8px;
    text-align: left;
}

.leaderboard-rank {
    color: #38bdf8;
    font-weight: bold;
    text-align: center;
}

.leaderboard-name {
    color: white;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.leaderboard-score {
    color: #f59e0b;
    font-weight: bold;
    text-align: right;
}

.loading {
    color: #94a3b8;
}

.error {
    color: #ef4444;
}

.empty {
    color: #94a3b8;
}

.refresh-button {
    margin-top: 20px;
    padding: 10px 20px;
    background: #334155;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
}

.refresh-button:hover {
    background: #475569;
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

    .leaderboard-row {
        grid-template-columns: 50px 1fr 80px;
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
Download my games and play on PC!
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

<div class="download-buttons">

<div class="platform-title">
PC Version
</div>

<a
href="/download/flappy"
class="button download-button"
>
Download Flappy Bird PC
</a>

</div>

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

<div class="download-buttons">

<div class="platform-title">
PC Version
</div>

<a
href="/download/car"
class="button download-button"
>
Download Car Game PC
</a>

</div>

</div>


</div>

</section>


<section
class="leaderboard"
id="leaderboard"
>

<h2>
🌎 Flappy Bird Global Leaderboard
</h2>

<div class="leaderboard-box">

<div id="leaderboard-content">

<p class="loading">
Loading leaderboard...
</p>

</div>

<button
class="refresh-button"
onclick="loadLeaderboard()"
>
Refresh Leaderboard
</button>

</div>

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


<script>

async function loadLeaderboard() {

    const container =
        document.getElementById(
            "leaderboard-content"
        );

    container.innerHTML =
        '<p class="loading">Loading leaderboard...</p>';

    try {

        const response =
            await fetch(
                "/api/leaderboard",
                {
                    method: "GET",
                    cache: "no-store"
                }
            );

        if (!response.ok) {

            throw new Error(
                "Server returned HTTP " +
                response.status
            );

        }

        const data =
            await response.json();

        container.innerHTML = "";

        if (
            !Array.isArray(data)
            ||
            data.length === 0
        ) {

            container.innerHTML =
                '<p class="empty">No scores yet. Be the first player!</p>';

            return;

        }

        data
            .slice(0, 10)
            .forEach(
                (player, index) => {

                    const row =
                        document.createElement(
                            "div"
                        );

                    row.className =
                        "leaderboard-row";

                    const rank =
                        document.createElement(
                            "div"
                        );

                    rank.className =
                        "leaderboard-rank";

                    rank.textContent =
                        "#" +
                        (
                            index + 1
                        );

                    const name =
                        document.createElement(
                            "div"
                        );

                    name.className =
                        "leaderboard-name";

                    name.textContent =
                        player.name ||
                        "Player";

                    const score =
                        document.createElement(
                            "div"
                        );

                    score.className =
                        "leaderboard-score";

                    score.textContent =
                        (
                            Number(
                                player.score
                            ) || 0
                        ) +
                        " pts";

                    row.appendChild(
                        rank
                    );

                    row.appendChild(
                        name
                    );

                    row.appendChild(
                        score
                    );

                    container.appendChild(
                        row
                    );

                }
            );

    }

    catch (error) {

        console.error(
            "Leaderboard error:",
            error
        );

        container.innerHTML =
            '<p class="error">Unable to load global leaderboard right now.</p>';

    }

}

loadLeaderboard();

setInterval(
    loadLeaderboard,
    30000
);

</script>

</body>

</html>
"""


@app.route("/")
def home():

    return render_template_string(
        HTML
    )


@app.route(
    "/api/leaderboard",
    methods=["GET"]
)
def get_leaderboard():

    if not os.path.exists(
        LEADERBOARD_FILE
    ):

        return jsonify([])

    try:

        with open(
            LEADERBOARD_FILE,
            "r",
            encoding="utf-8"
        ) as file:

            data = json.load(
                file
            )

        if not isinstance(
            data,
            list
        ):

            return jsonify([])

        clean_data = []

        for player in data:

            if not isinstance(
                player,
                dict
            ):

                continue

            name = str(
                player.get(
                    "name",
                    "Player"
                )
            ).strip()

            if not name:

                name = "Player"

            try:

                score = int(
                    player.get(
                        "score",
                        0
                    )
                )

            except Exception:

                score = 0

            if score < 0:

                score = 0

            clean_data.append(
                {
                    "name": name,
                    "score": score
                }
            )

        clean_data.sort(
            key=lambda x: x["score"],
            reverse=True
        )

        return jsonify(
            clean_data[:100]
        )

    except Exception as error:

        print(
            "Leaderboard read error:",
            error
        )

        return jsonify([])


@app.route(
    "/api/score",
    methods=["POST"]
)
def submit_score():

    data = request.get_json(
        silent=True
    )

    if not isinstance(
        data,
        dict
    ):

        return jsonify(
            {
                "success": False,
                "message": "Invalid data"
            }
        ), 400

    name = str(
        data.get(
            "name",
            ""
        )
    ).strip()

    try:

        score = int(
            data.get(
                "score",
                0
            )
        )

    except Exception:

        return jsonify(
            {
                "success": False,
                "message": "Invalid score"
            }
        ), 400

    if not name:

        return jsonify(
            {
                "success": False,
                "message": "Name is required"
            }
        ), 400

    if len(name) > 15:

        return jsonify(
            {
                "success": False,
                "message": "Name is too long"
            }
        ), 400

    if score < 0:

        return jsonify(
            {
                "success": False,
                "message": "Invalid score"
            }
        ), 400

    users = []

    if os.path.exists(
        LEADERBOARD_FILE
    ):

        try:

            with open(
                LEADERBOARD_FILE,
                "r",
                encoding="utf-8"
            ) as file:

                users = json.load(
                    file
                )

            if not isinstance(
                users,
                list
            ):

                users = []

        except Exception as error:

            print(
                "Leaderboard load error:",
                error
            )

            users = []

    found = False

    for user in users:

        if not isinstance(
            user,
            dict
        ):

            continue

        existing_name = str(
            user.get(
                "name",
                ""
            )
        ).strip()

        if (
            existing_name.lower()
            ==
            name.lower()
        ):

            try:

                old_score = int(
                    user.get(
                        "score",
                        0
                    )
                )

            except Exception:

                old_score = 0

            if score > old_score:

                user["score"] = score

            found = True

            break

    if not found:

        users.append(
            {
                "name": name,
                "score": score
            }
        )

    clean_users = []

    for user in users:

        if not isinstance(
            user,
            dict
        ):

            continue

        player_name = str(
            user.get(
                "name",
                "Player"
            )
        ).strip()

        try:

            player_score = int(
                user.get(
                    "score",
                    0
                )
            )

        except Exception:

            player_score = 0

        if player_score < 0:

            player_score = 0

        clean_users.append(
            {
                "name": player_name,
                "score": player_score
            }
        )

    clean_users.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    try:

        with open(
            LEADERBOARD_FILE,
            "w",
            encoding="utf-8"
        ) as file:

            json.dump(
                clean_users,
                file,
                indent=4,
                ensure_ascii=False
            )

    except Exception as error:

        print(
            "Leaderboard save error:",
            error
        )

        return jsonify(
            {
                "success": False,
                "message": "Unable to save score"
            }
        ), 500

    return jsonify(
        {
            "success": True
        }
    )


# ============================================================
# FLAPPY BIRD PC
# ============================================================

@app.route(
    "/download/flappy"
)
def download_flappy():

    file_path = os.path.join(
        BASE_DIR,
        "FlappyBird.exe"
    )

    if not os.path.isfile(
        file_path
    ):

        return (
            "FlappyBird.exe was not found next to website.py.",
            404
        )

    return send_file(
        file_path,
        as_attachment=True,
        download_name="FlappyBird.exe"
    )


# ============================================================
# CAR GAME PC
# ============================================================

@app.route(
    "/download/car"
)
def download_car():

    file_path = os.path.join(
        BASE_DIR,
        "CarGame.exe"
    )

    if not os.path.isfile(
        file_path
    ):

        return (
            "CarGame.exe was not found next to website.py.",
            404
        )

    return send_file(
        file_path,
        as_attachment=True,
        download_name="CarGame.exe"
    )


# ============================================================
# HEALTH CHECK
# ============================================================

@app.route(
    "/health"
)
def health():

    return jsonify(
        {
            "status": "ok",
            "leaderboard_file": os.path.exists(
                LEADERBOARD_FILE
            )
        }
    )


# ============================================================
# RUN SERVER
# ============================================================

if __name__ == "__main__":

    port = int(
        os.environ.get(
            "PORT",
            5000
        )
    )

    app.run(
        host="0.0.0.0",
        port=port
    )
