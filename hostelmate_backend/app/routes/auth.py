from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from app.extensions import  db
from app.models.user import User


auth_bp = Blueprint("auth", __name__)


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

@auth_bp.route("/api/login", methods = ["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email = email).first()

    if not user or not user.check_password(password):
        return jsonify({
            "error":"Invalid credentials"
        }),401
    
    token = create_access_token(identity=user.id)

    return jsonify({
        "message":"login successful",
        "access_token": token,
        "user": user.to_dict()
    })