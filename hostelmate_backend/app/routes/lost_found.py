from flask import request, jsonify,Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from app.models.lost_found import LostFound
from app.models.hostel import Hostels
from app.models.claim import Claim
from app.extensions import db
import cloudinary.uploader

lost_found_bp = Blueprint("lost_found", __name__)

@lost_found_bp.route("/api/items", methods=["POST"])
@jwt_required()
def create_item():
    if request.content_type.startswith("application/json"):
        data = request.get_json()
    else:
        data = request.form

    file = request.files.get("image")

    if data.get("type") not in ["lost", "found"]:
        return jsonify({"error": "Invalid type"}), 400

    image_url = None
    if file:
        upload_result = cloudinary.uploader.upload(file)
        image_url = upload_result.get("secure_url")

    item = LostFound(
        user_id=get_jwt_identity(),
        hostel_id=data.get("hostel_id"),
        type=data.get("type"),
        title=data.get("title"),
        description=data.get("description"),
        category=data.get("category"),
        location=data.get("location"),
        date_lost_found=data.get("date_lost_found"),
        photo_url=image_url
    )

    db.session.add(item)
    db.session.commit()

    return jsonify({
        "message": "Item posted successfully",
        "image_url": image_url
    })