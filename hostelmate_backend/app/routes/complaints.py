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
            "admin_response": c.admin_response,   
            "resolved_by": c.resolved_by,         
            "resolved_at": c.resolved_at,        
            "created_at": c.created_at,
            "updated_at": c.updated_at
        })

    return jsonify(data), 200

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
  
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)
    status = request.args.get("status")
    priority = request.args.get("priority")

    query = Complaint.query

    if status:
        query = query.filter(Complaint.status == status)

    if priority:
        query = query.filter(Complaint.priority == priority)

    paginated = query.order_by(Complaint.created_at.desc()).paginate(
        page=page,
        per_page=per_page,
        error_out=False
    )

    complaints = paginated.items

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
            "created_at": c.created_at,
        })

    return jsonify({
        "complaints": data,
        "total": paginated.total,
        "pages": paginated.pages,
        "current_page": paginated.page,
        "per_page": paginated.per_page
    }), 200


@complaint_bp.route("/api/complaints/<int:complaint_id>", methods=["PUT"])
@jwt_required()
def update_complaint(complaint_id):
    data = request.get_json()

    complaint = Complaint.query.get(complaint_id)

    if not complaint:
        return jsonify({"error": "Complaint not found"}), 404

  
    current_user_id = get_jwt_identity()

   
    if "status" in data:
        complaint.status = data["status"]

      
        if data["status"] == "resolved":
            complaint.resolved_by = current_user_id
            complaint.resolved_at = datetime.utcnow()

    if "admin_response" in data:
        complaint.admin_response = data["admin_response"]

    if "priority" in data:
        complaint.priority = data["priority"]

    if "category" in data:
        complaint.category = data["category"]

  
    if "description" in data:
        complaint.description = data["description"]

    complaint.updated_at = datetime.utcnow()

    db.session.commit()

    return jsonify({
        "message": "Complaint updated successfully",
        "complaint_id": complaint.id
    }), 200