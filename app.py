from flask import Flask, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)

CORS(
    app,
    resources={
        r"/api/*": {
            "origins": "*"
        }
    }
)


# =========================
# Basic Configuration
# =========================

APP_NAME = "Game Download Hub"
APP_VERSION = "1.0.0"


# =========================
# Temporary Game Data
# =========================
# فعلاً خالی است.
# بعداً بازی‌ها را اینجا اضافه می‌کنیم.

GAMES = []


# =========================
# Call of Duty Data
# =========================
CALL_OF_DUTY = {
    "games": [
        {
            "name": "Call of Duty: Mobile"
        }
    ],

    "guns": [
        {
            "name": "QQ9",
            "type": "SMG",
            "description": "Carmen QQ9 setup for close-range combat."
        }
    ],

    "attachments": [
        {
            "weapon": "QQ9 - Carmen",
            "muzzle": "Monolithic Suppressor",
            "barrel": "RTC Recon Tac Long",
            "stock": "No Stock",
            "ammunition": "45 Round Extended Mag",
            "rear_grip": "Granulated Grip Tape"
        }
    ],

    "loadouts": []
}
# =========================
# Home
# =========================

@app.route("/")
def home():
    return jsonify({
        "success": True,
        "name": APP_NAME,
        "version": APP_VERSION,
        "message": "Game Download Hub API is running."
    })


# =========================
# API Status
# =========================

@app.route("/api/status", methods=["GET"])
def api_status():
    return jsonify({
        "success": True,
        "online": True,
        "service": APP_NAME
    })


# =========================
# Games
# =========================

@app.route("/api/games", methods=["GET"])
def get_games():
    return jsonify({
        "success": True,
        "games": GAMES
    })


# =========================
# Call of Duty
# =========================

@app.route("/api/call-of-duty", methods=["GET"])
def get_call_of_duty():
    return jsonify({
        "success": True,
        "data": CALL_OF_DUTY
    })


# =========================
# Call of Duty Guns
# =========================

@app.route("/api/call-of-duty/guns", methods=["GET"])
def get_guns():
    return jsonify({
        "success": True,
        "guns": CALL_OF_DUTY["guns"]
    })


# =========================
# Call of Duty Attachments
# =========================

@app.route("/api/call-of-duty/attachments", methods=["GET"])
def get_attachments():
    return jsonify({
        "success": True,
        "attachments": CALL_OF_DUTY["attachments"]
    })


# =========================
# Call of Duty Loadouts
# =========================

@app.route("/api/call-of-duty/loadouts", methods=["GET"])
def get_loadouts():
    return jsonify({
        "success": True,
        "loadouts": CALL_OF_DUTY["loadouts"]
    })


# =========================
# App Configuration
# =========================

@app.route("/api/config", methods=["GET"])
def get_config():
    return jsonify({
        "success": True,
        "app": {
            "name": APP_NAME,
            "version": APP_VERSION
        },
        "sections": {
            "games": True,
            "call_of_duty": True,
            "guns": True,
            "attachments": True,
            "loadouts": True,
            "leaderboard": False,
            "flappy_bird": False
        }
    })


# =========================
# Error Handler
# =========================

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "success": False,
        "message": "Page not found."
    }), 404


@app.errorhandler(500)
def server_error(error):
    return jsonify({
        "success": False,
        "message": "Internal server error."
    }), 500


# =========================
# Run Server
# =========================

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
