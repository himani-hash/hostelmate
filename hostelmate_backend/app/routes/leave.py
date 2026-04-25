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
    page = request.args.get("page", 1, type=int)
    status = request.args.get("status")

    query = Leave.query

  
    if status:
        query = query.filter(Leave.status == status)

  
    paginated = query.paginate(page=page, per_page=10, error_out=False)

    leaves = paginated.items

    data = []
    for l in leaves:
        data.append({
            "id": l.id,
            "student_name": l.user.name if l.user else None,
            "student_email": l.user.email if l.user else None,
            "hostel_name": Hostels.query.get(l.hostel_id).name if l.hostel_id else None,

            "leave_type": l.leave_type,
            "start_date": l.start_date,
            "end_date": l.end_date,
            "reason": l.reason,
            "destination": l.destination,

            "parent_contact": l.parent_contact,
            "contact_number": l.contact_number,

            "status": l.status,
            "warden_comment": l.warden_comment,

            "approved_by": l.approver.name if l.approver else None,
            "approved_at": l.approved_at,

            "created_at": l.created_at,
        })

    return jsonify({
        "data": data,
        "page": page,
        "total_pages": paginated.pages
    }), 200

@leave_bp.route("/api/leaves/<int:leave_id>", methods=["PUT"])
@jwt_required()
def update_leave_status(leave_id):
    data = request.get_json()
    user_id = get_jwt_identity()  

    leave = Leave.query.get(leave_id)

    if not leave:
        return jsonify({"error": "Leave not found"}), 404

    status = data.get("status")  
    comment = data.get("warden_comment")

    if status not in ["approved", "rejected"]:
        return jsonify({"error": "Invalid status"}), 400


    if status == "rejected" and not comment:
        return jsonify({"error": "Rejection reason required"}), 400

  
    leave.status = status
    leave.warden_comment = comment if status == "rejected" else None
    leave.approved_by = user_id
    leave.approved_at = datetime.utcnow()

    db.session.commit()

    return jsonify({
        "message": f"Leave {status} successfully",
        "leave_id": leave.id,
        "status": leave.status
    }), 200