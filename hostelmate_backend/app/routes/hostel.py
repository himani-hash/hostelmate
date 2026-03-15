from flask import Blueprint, jsonify, request
from app.models.hostel import Hostels
from app.models.user import User
from app.extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity

hostel_bp = Blueprint("hostels", __name__)

@hostel_bp.route("/api/hostels", methods = ["POST"])
def create_hostel():
    data = request.get_json()

    hostel = Hostels(
        name = data["name"],
        code = data["code"],
        address = data["address"]
    )

    db.session.add(hostel)
    db.session.commit()

    return jsonify({
        "message":"hostel added successfully"
    })


@hostel_bp.route("/api/hostels", methods = ["GET"])
def get_hostels():

    hostels = Hostels.query.all()

    data = []

    for h in hostels:
        data.append({
            "id":h.id,
            "name":h.name,
            "code":h.code
        })

    return jsonify(data)

@hostel_bp.route("/api/assign-hostel/<int:user_id>", methods=["POST"])
def assign_hostel(user_id):

    data = request.get_json()
    hostel_id = data.get("hostel_id")

    user = User.query.get(user_id)

    if not user:
        return jsonify({"msg": "User not found"}), 404

    hostel = Hostels.query.get(hostel_id)

    if not hostel:
        return jsonify({"msg": "Hostel does not exist"}), 404

    user.hostel_id = hostel_id
    db.session.commit()

    return jsonify({
        "msg": "Hostel assigned successfully",
        "user_id": user_id,
        "hostel_id": hostel_id
    })