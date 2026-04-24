from flask import request, jsonify,Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from app.models.leave import Leave
from app.models.hostel import Hostels
from app.extensions import db

leave_bp = Blueprint("leave", __name__)

@leave_bp.route("/api/leaves", methods=["POST"])
@jwt_required()
def create_leave():
    data = request.get_json()

    required_fields = [
        "hostel_id",
        "leave_type",
        "start_date",
        "end_date",
        "reason",
        "parent_contact",
        "contact_number", 
        "destination"
    ]

    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"{field} is required"}), 400

    user_id = get_jwt_identity()

    leave = Leave(
        user_id=user_id,
        hostel_id=data["hostel_id"],
        leave_type=data["leave_type"],
        start_date=data["start_date"],
        end_date=data["end_date"],
        reason=data["reason"],
        parent_contact=data["parent_contact"],
        contact_number=data["contact_number"],  
        destination=data["destination"],
        status="pending"
    )

    db.session.add(leave)
    db.session.commit()

    return jsonify({
        "message": "Leave applied successfully"
    }), 201

@leave_bp.route("/api/all-leaves", methods=["GET"])
@jwt_required()
def get_all_leaves():
    leaves = Leave.query.all()

    data = []

    for l in leaves:
        user_name = l.user.name if l.user else None
        user_email = l.user.email if l.user else None

        hostel_name = None
        if l.hostel_id:
            hostel = Hostels.query.get(l.hostel_id)
            hostel_name = hostel.name if hostel else None

        approver_name = None
        if l.approver:
            approver_name = l.approver.name

        data.append({
            "id": l.id,
            "student_name": user_name,
            "student_email": user_email,
            "hostel_name": hostel_name,

            "leave_type": l.leave_type,
            "start_date": l.start_date,
            "end_date": l.end_date,
            "reason": l.reason,
            "destination": l.destination,

            "parent_contact": l.parent_contact,
            "contact_number": l.contact_number,

            "status": l.status,
            "warden_comment": l.warden_comment,

            "approved_by": approver_name,
            "approved_at": l.approved_at,

            "created_at": l.created_at,
        })

    return jsonify(data), 200