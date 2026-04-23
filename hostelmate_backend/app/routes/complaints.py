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

    complaint = Complaint(
        user_id=current_user_id,   
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
@jwt_required()
def get_complaints():
    user_id = get_jwt_identity()

    complaints = Complaint.query.filter_by(user_id=user_id).all()

    data = []
    for c in complaints:
        data.append({
            "id": c.id,
            "category": c.category,
            "priority": c.priority,
            "status": c.status,
            "description": c.description,
            "created_at": c.created_at
        })

    return jsonify(data)

@complaint_bp.route("/api/complaints/<int:id>", methods=["DELETE"])
def delete_complaint(id):
    complaint = Complaint.query.get(id)

    if not complaint:
        return jsonify({"error": "Complaint not found"}), 404

    db.session.delete(complaint)
    db.session.commit()

    return jsonify({"message": "Complaint deleted"}), 200

@complaint_bp.route("/api/all-complaints", methods=["GET"])
@jwt_required()
def get_all_complaints():
    complaints = Complaint.query.all()

    data = []

    for c in complaints:
        user_name = None
        user_email = None

     
        if not c.is_anonymous and c.user:
            user_name = c.user.name
            user_email = c.user.email

        data.append({
            "id": c.id,
            "hostel_id": c.hostel_id,
            "category": c.category,
            "priority": c.priority,
            "description": c.description,
            "status": c.status,
            "is_anonymous": c.is_anonymous,
            "user_name": user_name,
            "user_email": user_email,
            "admin_response": c.admin_response,

         
            "resolved_by": c.resolver.name if c.resolver else None,
            "resolved_at": c.resolved_at.isoformat() if c.resolved_at else None,

            "created_at": c.created_at.isoformat() if c.created_at else None,
        })

    print(dir(c))

    return jsonify(data), 200