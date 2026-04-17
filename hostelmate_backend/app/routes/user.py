from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from app.extensions import  db
from app.models.user import User
from app.models.hostel import Hostels


user_bp = Blueprint("user", __name__)
@user_bp.route("/api/current-user", methods=["GET"])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()

    user = db.session.get(User, user_id)

    if not user:
        return jsonify({"msg": "User not found"}), 404
    

    print("USER ID:", user_id)

    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "phone": user.phone,
        "room_number": user.room_number,
        "course": user.course,
        "year": user.year,


    "hostel": {
        "id": user.hostel.id if user.hostel else None,
        "name": user.hostel.name if user.hostel else None,
        "code": user.hostel.code if user.hostel else None,
        "address": user.hostel.address if user.hostel else None,
        "created_at": user.hostel.created_at if user.hostel else None
    }
    }), 200

@user_bp.route("/api/current-user", methods=["PUT"])
@jwt_required()
def update_current_user():
    user_id = get_jwt_identity()
    data = request.get_json()

    user = User.query.get(user_id)

    if not user:
        return jsonify({"msg": "User not found"}), 404

    user.name = data.get("name", user.name)
    user.email = data.get("email", user.email)
    user.room_number = data.get("room_number", user.room_number)
    user.phone = data.get("phone", user.phone)
    user.course = data.get("course", user.course)
    user.year = data.get("year", user.year)
    user.hostel_id = data.get("hostel_id", user.hostel_id)
    db.session.commit()

    return jsonify({
        "msg": "User updated successfully",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "phone": user.phone,
            "room_number": user.room_number,
            "course": user.course,
            "year": user.year,

            "hostel": {
                "id": user.hostel.id if user.hostel else None,
                "name": user.hostel.name if user.hostel else None,
                "code": user.hostel.code if user.hostel else None,
                "address": user.hostel.address if user.hostel else None,
                "created_at": user.hostel.created_at.isoformat() if user.hostel else None
            }
        }
    }), 200

@user_bp.route("/api/change-password", methods=["PUT"])
@jwt_required()
def change_password():
    user_id = get_jwt_identity()
    data = request.get_json()

    current_password = data.get("current_password")
    new_password = data.get("new_password")
    confirm_password = data.get("confirm_password")

    user = db.session.get(User, user_id)

    if not user:
        return jsonify({"msg": "User not found"}), 404


    if not user.check_password(current_password):
        return jsonify({"msg": "Current password is incorrect"}), 400

    if new_password != confirm_password:
        return jsonify({"msg": "Passwords do not match"}), 400

    user.set_password(new_password)
    db.session.commit()

    return jsonify({"msg": "Password updated successfully"}), 200


@user_bp.route("/api/users", methods=["GET", "OPTIONS"])
def get_users():
    role = request.args.get("role")
    is_verified = request.args.get("is_verified")

    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)

    query = User.query

    if role:
        query = query.filter(User.role == role)

    if is_verified is not None:
        if is_verified.lower() == "true":
            query = query.filter(User.is_verified == True)
        elif is_verified.lower() == "false":
            query = query.filter(User.is_verified == False)

    paginated_users = query.paginate(page=page, per_page=per_page, error_out=False)

    users = paginated_users.items

    result = [
        {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role,
            "is_verified": u.is_verified
        }
        for u in users
    ]

    return jsonify({
        "users": result,
        "total": paginated_users.total,
        "pages": paginated_users.pages,
        "current_page": paginated_users.page
    })

@user_bp.route("/api/users/<int:user_id>", methods=["PUT"])
@jwt_required()
def update_user(user_id):
    data = request.get_json()

    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

  
    user.name = data.get("name", user.name)

 
    new_email = data.get("email")
    if new_email and new_email != user.email:
        existing_user = User.query.filter_by(email=new_email).first()
        if existing_user:
            return jsonify({"error": "Email already exists"}), 400
        user.email = new_email


    user.phone = data.get("phone", user.phone)

    user.course = data.get("course", user.course)
    user.year = data.get("year", user.year)

  
    hostel_id = data.get("hostel_id")
    if hostel_id:
        hostel = Hostels.query.get(hostel_id)
        if not hostel:
            return jsonify({"error": "Invalid hostel"}), 400
        user.hostel_id = hostel_id

   
    user.room_number = data.get("room", user.room_number)

    db.session.commit()

    return jsonify({"message": "User updated successfully"}), 200


@user_bp.route("/api/users/<int:user_id>/verify", methods=["PUT"])
@jwt_required()
def verify_user(user_id):
    data = request.get_json()

    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

   
    if current_user.role != "warden":
        return jsonify({"error": "Unauthorized"}), 403

    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

   
    is_verified = data.get("is_verified")

    if is_verified is None:
        return jsonify({"error": "is_verified is required"}), 400

    user.is_verified = is_verified
    db.session.commit()

    return jsonify({
        "message": f"User {'approved' if is_verified else 'rejected'} successfully",
        "user": {
            "id": user.id,
            "name": user.name,
            "is_verified": user.is_verified
        }
    }), 200

@user_bp.route("/api/hostels", methods=["GET"])
@jwt_required()
def get_hostels():
    hostels = Hostels.query.all()

    return jsonify([
        {
            "id": h.id,
            "name": h.name
        } for h in hostels
    ]), 200