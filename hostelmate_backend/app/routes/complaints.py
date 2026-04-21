from flask import Blueprint, request, jsonify
from app.extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.complaints import Complaint
from app.models.hostel import Hostels
from app.models.user import User
from datetime import datetime

complaint_bp = Blueprint("complaint_bp", __name__)


@complaint_bp.route("/api/complaints", methods=["POST"])
@jwt_required()
def create_complaint():
    data = request.get_json()

    required_fields = ["hostel_id", "category", "priority", "description"]
    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"{field} is required"}), 400

    current_user_id = get_jwt_identity()
    is_anonymous = data.get("is_anonymous", False)
    user_id = None if is_anonymous else current_user_id

    complaint = Complaint(
        user_id=user_id,
        hostel_id=data["hostel_id"],
        category=data["category"],
        priority=data["priority"],
        description=data["description"],
        is_anonymous=is_anonymous,
        status="pending",
        created_at=datetime.utcnow()
    )

    db.session.add(complaint)
    db.session.commit()

    return jsonify({
        "message": "Complaint submitted successfully",
        "complaint_id": complaint.id
    }), 201

@complaint_bp.route("/api/complaints", methods=["GET"])
def get_complaints():
    complaints = Complaint.query.all()
    result = []

    for c in complaints:
        result.append({
            "id": c.id,
            "category": c.category,
            "priority": c.priority,
            "description": c.description,
            "status": c.status,
            "admin_response": c.admin_response,
            "user": "Anonymous" if c.is_anonymous else c.user_id,
            "created_at": c.created_at,
            "resolved_at": c.resolved_at
        })

    return jsonify(result), 200

@complaint_bp.route("/api/complaints/<int:id>", methods=["DELETE"])
def delete_complaint(id):
    complaint = Complaint.query.get(id)

    if not complaint:
        return jsonify({"error": "Complaint not found"}), 404

    db.session.delete(complaint)
    db.session.commit()

    return jsonify({"message": "Complaint deleted"}), 200