from flask import Flask, render_template_string, send_file, request, jsonify
import os
import json
import hashlib
import secrets

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

LEADERBOARD_FILE = os.path.join(
    BASE_DIR,
    "leaderboard.json"
)

# CHANGE THIS PASSWORD
ADMIN_PASSWORD = "YOUR_ADMIN_PASSWORD_HERE"

ADMIN_PASSWORD_HASH = hashlib.sha256(
    ADMIN_PASSWORD.encode("utf-8")
).hexdigest()

ADMIN_SESSIONS = set()

HTML = """
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="google-site-verification" content="ULKlsCJLxKZPZcj4H5NkXbxu0p8OkCf2ioaLwIFockY">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>My Game Studio</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:Arial,sans-serif;background:#111827;color:white}
header{background:#0f172a;padding:20px 50px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #334155;position:sticky;top:0;z-index:1000}
.logo{font-size:26px;font-weight:bold;color:#38bdf8}
nav a{color:white;text-decoration:none;margin-left:25px;font-size:16px}
nav a:hover{color:#38bdf8}
.hero{min-height:500px;display:flex;justify-content:center;align-items:center;text-align:center;padding:50px 20px;background:linear-gradient(135deg,#0f172a,#1e293b,#0c4a6e)}
.hero-content{max-width:800px}
.hero h1{font-size:60px;margin-bottom:20px}
.hero p{font-size:20px;color:#cbd5e1;line-height:1.6;margin-bottom:30px}
.button{display:inline-block;padding:14px 30px;background:#0ea5e9;color:white;text-decoration:none;border-radius:8px;font-weight:bold;border:none;cursor:pointer;transition:.3s}
.button:hover{background:#0284c7;transform:translateY(-2px)}
.games{padding:70px 30px;text-align:center}
.games h2{font-size:40px;margin-bottom:40px}
.game-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:30px;max-width:1000px;margin:auto}
.game-card{background:#1e293b;border-radius:12px;padding:30px;border:1px solid #334155;transition:.3s}
.game-card:hover{transform:translateY(-5px);border-color:#38bdf8}
.game-card h3{font-size:28px;margin-bottom:15px}
.game-card p{color:#cbd5e1;line-height:1.6;margin-bottom:25px}
.game-icon{font-size:60px;margin-bottom:20px}
.download-buttons{display:flex;flex-direction:column;gap:12px}
.platform-title{font-size:14px;color:#94a3b8;margin-top:5px}
.download-button{background:#f59e0b;width:100%}
.download-button:hover{background:#d97706}
.leaderboard{padding:70px 30px;text-align:center;background:#0f172a}
.leaderboard h2{font-size:36px;margin-bottom:30px}
.leaderboard-box{max-width:700px;margin:auto;background:#1e293b;border:1px solid #334155;border-radius:12px;padding:25px}
.leaderboard-row{display:grid;grid-template-columns:70px 1fr 100px;align-items:center;gap:10px;padding:15px;margin-bottom:10px;background:#0f172a;border-radius:8px;text-align:left}
.leaderboard-rank{color:#38bdf8;font-weight:bold;text-align:center}
.leaderboard-name{color:white;font-weight:bold}
.leaderboard-score{color:#f59e0b;font-weight:bold;text-align:right}
.loading{color:#94a3b8}
.error{color:#ef4444}
.about{padding:70px 30px;background:#111827;text-align:center}
.about h2{font-size:36px;margin-bottom:20px}
.about p{max-width:700px;margin:auto;color:#cbd5e1;line-height:1.8}
footer{padding:25px;text-align:center;color:#94a3b8;background:#020617}
@media(max-width:700px){
header{padding:20px;flex-direction:column;gap:15px}
nav{display:flex;flex-wrap:wrap;justify-content:center;gap:10px}
nav a{margin:0 8px}
.hero h1{font-size:40px}
.hero p{font-size:17px}
.games{padding:50px 20px}
.game-grid{grid-template-columns:1fr}
.leaderboard-row{grid-template-columns:50px 1fr 80px}
}
</style>
</head>

<body>

<header>
<div class="logo">My Game Studio</div>
<nav>
<a href="#home">Home</a>
<a href="#games">Games</a>
<a href="#leaderboard">Leaderboard</a>
<a href="#about">About</a>
</nav>
</header>

<section class="hero" id="home">
<div class="hero-content">
<h1>Welcome to My Game Studio</h1>
<p>Download my games and play on PC!</p>
<a href="#games" class="button">Explore Games</a>
</div>
</section>

<section class="games" id="games">
<h2>My Games</h2>

<div class="game-grid">

<div class="game-card">
<div class="game-icon">🐦</div>
<h3>Flappy Bird</h3>
<p>Fly through the pipes, avoid obstacles, and try to achieve the highest score.</p>
<div class="download-buttons">
<div class="platform-title">PC Version</div>
<a href="/download/flappy" class="button download-button">
Download Flappy Bird PC
</a>
</div>
</div>

<div class="game-card">
<div class="game-icon">🚗</div>
<h3>Car Game</h3>
<p>Drive your car, avoid obstacles, and survive as long as possible.</p>
<div class="download-buttons">
<div class="platform-title">PC Version</div>
<a href="/download/car" class="button download-button">
Download Car Game PC
</a>
</div>
</div>

</div>
</section>

<section class="leaderboard" id="leaderboard">
<h2>🌎 Flappy Bird Global Leaderboard</h2>

<div class="leaderboard-box">
<div id="leaderboard-content">
<p class="loading">Loading leaderboard...</p>
</div>
</div>
</section>

<section class="about" id="about">
<h2>About Me</h2>
<p>
I'm an independent game developer creating games and experimenting with new ideas.
This website is where I publish my games and future projects.
I'm Mehrsam Ahmadbeigi.
</p>
</section>

<footer>
<p>© 2026 My Game Studio. All rights reserved.</p>
</footer>

<script>
async function loadLeaderboard(){

    const container =
        document.getElementById("leaderboard-content");

    container.innerHTML =
        '<p class="loading">Loading leaderboard...</p>';

    try{

        const response =
            await fetch("/api/leaderboard", {
                cache:"no-cache"
            });

        if(!response.ok){
            throw new Error("Server error");
        }

        const data =
            await response.json();

        container.innerHTML = "";

        if(!Array.isArray(data) || data.length === 0){

            container.innerHTML =
                '<p class="loading">No scores yet.</p>';

            return;
        }

        data
        .sort(
            (a,b) =>
                Number(b.score || 0) -
                Number(a.score || 0)
        )
        .slice(0,10)
        .forEach((player,index)=>{

            const row =
                document.createElement("div");

            row.className =
                "leaderboard-row";

            const rank =
                document.createElement("div");

            rank.className =
                "leaderboard-rank";

            rank.textContent =
                "#" + (index + 1);

            const name =
                document.createElement("div");

            name.className =
                "leaderboard-name";

            name.textContent =
                player.name || "Player";

            const score =
                document.createElement("div");

            score.className =
                "leaderboard-score";

            score.textContent =
                (player.score || 0) + " pts";

            row.appendChild(rank);
            row.appendChild(name);
            row.appendChild(score);

            container.appendChild(row);

        });

    }
    catch(error){

        console.error(error);

        container.innerHTML =
            '<p class="error">Unable to load leaderboard.</p>';

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


def load_users():

    if not os.path.exists(LEADERBOARD_FILE):
        return []

    try:

        with open(
            LEADERBOARD_FILE,
            "r",
            encoding="utf-8"
        ) as file:

            data = json.load(file)

        if isinstance(data, list):
            return data

    except Exception:
        pass

    return []


def save_users(users):

    with open(
        LEADERBOARD_FILE,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            users,
            file,
            indent=4,
            ensure_ascii=False
        )


def admin_required():

    token = request.headers.get(
        "X-Admin-Token",
        ""
    )

    return (
        token
        and token in ADMIN_SESSIONS
    )


@app.route("/")
def home():

    return render_template_string(
        HTML
    )


@app.route("/api/leaderboard")
def get_leaderboard():

    users = load_users()

    clean_data = []

    for player in users:

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
            continue

        try:

            score = int(
                player.get(
                    "score",
                    0
                )
            )

        except Exception:

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


@app.route(
    "/api/score",
    methods=["POST"]
)
def submit_score():

    data = request.get_json(
        silent=True
    )

    if not data:
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

    if name.lower() == "admin":
        return jsonify(
            {
                "success": False,
                "message": "Invalid player name"
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

    users = load_users()

    found = False

    for user in users:

        if str(
            user.get(
                "name",
                ""
            )
        ).strip().lower() == name.lower():

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

    users.sort(
        key=lambda x: int(
            x.get(
                "score",
                0
            )
        ),
        reverse=True
    )

    save_users(users)

    return jsonify(
        {
            "success": True
        }
    )


@app.route(
    "/api/admin/login",
    methods=["POST"]
)
def admin_login():

    data = request.get_json(
        silent=True
    )

    if not data:

        return jsonify(
            {
                "success": False,
                "message": "Invalid data"
            }
        ), 400

    username = str(
        data.get(
            "username",
            ""
        )
    ).strip()

    password = str(
        data.get(
            "password",
            ""
        )
    )

    if username.lower() != "admin":

        return jsonify(
            {
                "success": False,
                "message": "Invalid admin login"
            }
        ), 401

    password_hash = hashlib.sha256(
        password.encode(
            "utf-8"
        )
    ).hexdigest()

    if not secrets.compare_digest(
        password_hash,
        ADMIN_PASSWORD_HASH
    ):

        return jsonify(
            {
                "success": False,
                "message": "Wrong password"
            }
        ), 401

    token = secrets.token_urlsafe(
        32
    )

    ADMIN_SESSIONS.add(
        token
    )

    return jsonify(
        {
            "success": True,
            "token": token
        }
    )


@app.route(
    "/api/admin/players",
    methods=["GET"]
)
def admin_players():

    if not admin_required():

        return jsonify(
            {
                "success": False,
                "message": "Unauthorized"
            }
        ), 401

    users = load_users()

    result = []

    for index, user in enumerate(users):

        if str(
            user.get(
                "name",
                ""
            )
        ).lower() == "admin":

            continue

        result.append(
            {
                "id": index,
                "name": user.get(
                    "name",
                    "Player"
                ),
                "score": int(
                    user.get(
                        "score",
                        0
                    )
                )
            }
        )

    return jsonify(
        result
    )


@app.route(
    "/api/admin/player/<int:player_id>",
    methods=["PUT"]
)
def update_player(
    player_id
):

    if not admin_required():

        return jsonify(
            {
                "success": False,
                "message": "Unauthorized"
            }
        ), 401

    data = request.get_json(
        silent=True
    )

    if not data:

        return jsonify(
            {
                "success": False,
                "message": "Invalid data"
            }
        ), 400

    try:

        new_score = int(
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

    if new_score < 0:

        return jsonify(
            {
                "success": False,
                "message": "Invalid score"
            }
        ), 400

    users = load_users()

    if (
        player_id < 0
        or player_id >= len(users)
    ):

        return jsonify(
            {
                "success": False,
                "message": "Player not found"
            }
        ), 404

    if str(
        users[player_id].get(
            "name",
            ""
        )
    ).lower() == "admin":

        return jsonify(
            {
                "success": False,
                "message": "Cannot edit admin"
            }
        ), 403

    users[player_id]["score"] = new_score

    save_users(users)

    return jsonify(
        {
            "success": True
        }
    )


@app.route(
    "/api/admin/player/<int:player_id>",
    methods=["DELETE"]
)
def delete_player(
    player_id
):

    if not admin_required():

        return jsonify(
            {
                "success": False,
                "message": "Unauthorized"
            }
        ), 401

    users = load_users()

    if (
        player_id < 0
        or player_id >= len(users)
    ):

        return jsonify(
            {
                "success": False,
                "message": "Player not found"
            }
        ), 404

    if str(
        users[player_id].get(
            "name",
            ""
        )
    ).lower() == "admin":

        return jsonify(
            {
                "success": False,
                "message": "Cannot delete admin"
            }
        ), 403

    users.pop(
        player_id
    )

    save_users(users)

    return jsonify(
        {
            "success": True
        }
    )


@app.route(
    "/api/admin/leaderboard/clear",
    methods=["DELETE"]
)
def clear_leaderboard():

    if not admin_required():

        return jsonify(
            {
                "success": False,
                "message": "Unauthorized"
            }
        ), 401

    users = load_users()

    users = [
        user
        for user in users
        if str(
            user.get(
                "name",
                ""
            )
        ).lower() == "admin"
    ]

    save_users(users)

    return jsonify(
        {
            "success": True
        }
    )


@app.route("/download/flappy")
def download_flappy():

    file_path = os.path.join(
        BASE_DIR,
        "FlappyBird.exe"
    )

    if not os.path.isfile(
        file_path
    ):

        return (
            "FlappyBird.exe was not found.",
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

    if not os.path.isfile(
        file_path
    ):

        return (
            "CarGame.exe was not found.",
            404
        )

    return send_file(
        file_path,
        as_attachment=True,
        download_name="CarGame.exe"
    )


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
