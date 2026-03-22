from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.complaints import Complaint
from app.models.hostel import Hostels
from app.models.user import User
from datetime import datetime

complaint_bp = Blueprint("complaint_bp", __name__)

@complaint_bp.route("/api/complaints", methods=["POST"])
def create_complaint():
    data = request.get_json()

   
    if not data.get("category") or not data.get("priority") or not data.get("description"):
        return jsonify({"error": "Missing required fields"}), 400

    
    is_anonymous = data.get("is_anonymous", False)

    
    current_user_id = 1   

    if is_anonymous:
        user_id = None   
    else:
        user_id = current_user_id

    complaint = Complaint(
        user_id=user_id,
        hostel_id=data.get("hostel_id"),
        category=data["category"],
        priority=data["priority"],
        description=data["description"],
        is_anonymous=is_anonymous,
        status="Pending",
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