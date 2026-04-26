from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from app.extensions import  db, mail
from app.models.user import User
from app.models import user
from datetime import datetime, timedelta
import secrets
from flask_mail import Message




auth_bp = Blueprint("auth", __name__)



blacklist = set()

def send_reset_email(to_email, reset_link):
    msg = Message(
        subject="Reset Your Password",
        recipients=[to_email]
    )

    msg.body = f"""
Click here to reset your password:
{reset_link}

Link valid for 15 minutes.
"""

    mail.send(msg)

@auth_bp.route("/api/logout", methods=["POST"])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]  
    blacklist.add(jti)
    return {"msg": "Logged out successfully"}, 200


@auth_bp.route("/api/loggedin-user", methods=["GET"])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "name": user.name,
        "email": user.email
    }), 200


@auth_bp.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    print("Incoming data:", data)

    email = data.get("email")
    password = data.get("password")
    name = data.get("name")

    if not email or not password or not name:
        return jsonify({"error":"All fields are required"}),400

    existing = User.query.filter_by(email=email).first()

    if existing:
        return jsonify({"error":"Email already exists"}),400

    user = User(email=email, name=name)

    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    print("User saved:", user.email)

    return jsonify({
        "message":"User registered successfully",
        "user": user.to_dict()
    })

@auth_bp.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({
            "error": "Invalid credentials"
        }), 401

    if not user.is_verified:
        return jsonify({
            "error": "Account not verified. Please verify your account first."
        }), 403

    token = create_access_token(identity=str(user.id))

    return jsonify({
        "message": "Login successful",
        "access_token": token,
        "user": user.to_dict()
    })

@auth_bp.route("/api/reset-password", methods=["POST"])
def reset_password():
    data = request.get_json()

    token = data.get("token")
    new_password = data.get("password")

    if not token or not new_password:
        return jsonify({"msg": "Token and password required"}), 400

    user = User.query.filter_by(reset_token=token).first()

    if not user:
        return jsonify({"msg": "Invalid token"}), 400

    if not user.reset_token_expiry or user.reset_token_expiry < datetime.utcnow():
        return jsonify({"msg": "Token expired"}), 400

    user.set_password(new_password)

    user.reset_token = None
    user.reset_token_expiry = None

    db.session.commit()

    return jsonify({"msg": "Password reset successful"}), 200

@auth_bp.route("/api/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json()
    email = data.get("email")

    if not email:
        return jsonify({"msg": "Email is required"}), 400

    user = User.query.filter_by(email=email).first()

    if user:
        token = secrets.token_urlsafe(32)

        user.reset_token = token
        user.reset_token_expiry = datetime.utcnow() + timedelta(minutes=15)

        db.session.commit()

        reset_link = f"http://localhost:3000/reset-password?token={token}"

        send_reset_email(user.email, reset_link)

    return jsonify({
        "msg":  "A reset link has been sent"
    }), 200