from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sqlite3
import secrets

app = Flask(__name__)

CORS(
    app,
    resources={
        r"/api/*": {
            "origins": "*"
        }
    }
)

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

DATABASE = os.path.join(
    BASE_DIR,
    "leaderboard.db"
)

ADMIN_SECRET = os.environ.get(
    "ADMIN_SECRET",
    ""
)


def get_connection():
    connection = sqlite3.connect(
        DATABASE
    )

    connection.row_factory = sqlite3.Row

    return connection


def init_database():
    connection = get_connection()

    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS leaderboard (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            score INTEGER NOT NULL DEFAULT 0
        )
        """
    )

    connection.commit()

    connection.close()


def check_admin():
    provided_secret = request.headers.get(
        "X-Admin-Secret",
        ""
    )

    if not ADMIN_SECRET:
        return False

    return secrets.compare_digest(
        provided_secret,
        ADMIN_SECRET
    )


@app.route("/")
def home():
    return jsonify(
        {
            "success": True,
            "message": "My Game Studio Leaderboard API is running."
        }
    )


@app.route(
    "/api/leaderboard",
    methods=["GET"]
)
def get_leaderboard():
    try:
        connection = get_connection()

        rows = connection.execute(
            """
            SELECT id, name, score
            FROM leaderboard
            ORDER BY score DESC, id ASC
            LIMIT 100
            """
        ).fetchall()

        connection.close()

        result = []

        for row in rows:
            result.append(
                {
                    "id": row["id"],
                    "name": row["name"],
                    "score": row["score"]
                }
            )

        return jsonify(result)

    except Exception as error:
        print(
            "Leaderboard error:",
            error
        )

        return jsonify(
            {
                "success": False,
                "message": "Unable to load leaderboard."
            }
        ), 500


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
                "message": "Invalid data."
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
                "message": "Invalid score."
            }
        ), 400

    if not name:
        return jsonify(
            {
                "success": False,
                "message": "Name is required."
            }
        ), 400

    if len(name) > 15:
        return jsonify(
            {
                "success": False,
                "message": "Name is too long."
            }
        ), 400

    if score < 0:
        return jsonify(
            {
                "success": False,
                "message": "Invalid score."
            }
        ), 400

    try:
        connection = get_connection()

        existing = connection.execute(
            """
            SELECT id, score
            FROM leaderboard
            WHERE LOWER(name) = LOWER(?)
            """,
            (
                name,
            )
        ).fetchone()

        if existing:
            old_score = int(
                existing["score"]
            )

            if score > old_score:
                connection.execute(
                    """
                    UPDATE leaderboard
                    SET score = ?
                    WHERE id = ?
                    """,
                    (
                        score,
                        existing["id"]
                    )
                )

        else:
            connection.execute(
                """
                INSERT INTO leaderboard
                (
                    name,
                    score
                )
                VALUES
                (
                    ?,
                    ?
                )
                """,
                (
                    name,
                    score
                )
            )

        connection.commit()

        connection.close()

        return jsonify(
            {
                "success": True
            }
        )

    except Exception as error:
        print(
            "Score error:",
            error
        )

        return jsonify(
            {
                "success": False,
                "message": "Unable to save score."
            }
        ), 500


@app.route(
    "/api/admin/leaderboard",
    methods=["GET"]
)
def admin_get_leaderboard():
    if not check_admin():
        return jsonify(
            {
                "success": False,
                "message": "Unauthorized."
            }
        ), 401

    try:
        connection = get_connection()

        rows = connection.execute(
            """
            SELECT id, name, score
            FROM leaderboard
            ORDER BY score DESC, id ASC
            """
        ).fetchall()

        connection.close()

        result = []

        for row in rows:
            result.append(
                {
                    "id": row["id"],
                    "name": row["name"],
                    "score": row["score"]
                }
            )

        return jsonify(
            {
                "success": True,
                "players": result
            }
        )

    except Exception as error:
        print(
            "Admin leaderboard error:",
            error
        )

        return jsonify(
            {
                "success": False,
                "message": "Unable to load admin leaderboard."
            }
        ), 500


@app.route(
    "/api/admin/player/<int:player_id>",
    methods=["PUT"]
)
def admin_update_player(player_id):
    if not check_admin():
        return jsonify(
            {
                "success": False,
                "message": "Unauthorized."
            }
        ), 401

    data = request.get_json(
        silent=True
    )

    if not data:
        return jsonify(
            {
                "success": False,
                "message": "Invalid data."
            }
        ), 400

    try:
        score = int(
            data.get(
                "score"
            )
        )

    except Exception:
        return jsonify(
            {
                "success": False,
                "message": "Invalid score."
            }
        ), 400

    if score < 0:
        return jsonify(
            {
                "success": False,
                "message": "Invalid score."
            }
        ), 400

    try:
        connection = get_connection()

        existing = connection.execute(
            """
            SELECT id
            FROM leaderboard
            WHERE id = ?
            """,
            (
                player_id,
            )
        ).fetchone()

        if not existing:
            connection.close()

            return jsonify(
                {
                    "success": False,
                    "message": "Player not found."
                }
            ), 404

        connection.execute(
            """
            UPDATE leaderboard
            SET score = ?
            WHERE id = ?
            """,
            (
                score,
                player_id
            )
        )

        connection.commit()

        connection.close()

        return jsonify(
            {
                "success": True,
                "message": "Score updated."
            }
        )

    except Exception as error:
        print(
            "Admin update error:",
            error
        )

        return jsonify(
            {
                "success": False,
                "message": "Unable to update score."
            }
        ), 500


@app.route(
    "/api/admin/player/<int:player_id>",
    methods=["DELETE"]
)
def admin_delete_player(player_id):
    if not check_admin():
        return jsonify(
            {
                "success": False,
                "message": "Unauthorized."
            }
        ), 401

    try:
        connection = get_connection()

        existing = connection.execute(
            """
            SELECT id
            FROM leaderboard
            WHERE id = ?
            """,
            (
                player_id,
            )
        ).fetchone()

        if not existing:
            connection.close()

            return jsonify(
                {
                    "success": False,
                    "message": "Player not found."
                }
            ), 404

        connection.execute(
            """
            DELETE FROM leaderboard
            WHERE id = ?
            """,
            (
                player_id,
            )
        )

        connection.commit()

        connection.close()

        return jsonify(
            {
                "success": True,
                "message": "Player deleted."
            }
        )

    except Exception as error:
        print(
            "Admin delete error:",
            error
        )

        return jsonify(
            {
                "success": False,
                "message": "Unable to delete player."
            }
        ), 500


@app.route(
    "/api/admin/leaderboard/clear",
    methods=["DELETE"]
)
def admin_clear_leaderboard():
    if not check_admin():
        return jsonify(
            {
                "success": False,
                "message": "Unauthorized."
            }
        ), 401

    try:
        connection = get_connection()

        connection.execute(
            """
            DELETE FROM leaderboard
            """
        )

        connection.commit()

        connection.close()

        return jsonify(
            {
                "success": True,
                "message": "Leaderboard cleared."
            }
        )

    except Exception as error:
        print(
            "Admin clear error:",
            error
        )

        return jsonify(
            {
                "success": False,
                "message": "Unable to clear leaderboard."
            }
        ), 500


init_database()


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
