from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func
from app.extensions import db
from app.models.user import User
from app.models.mess_rating import MessRating
from datetime import datetime, date

mess_bp = Blueprint("mess_ratings", __name__)

@mess_bp.route("/api/ratings/<int:hostel_id>", methods=["GET"])
def get_ratings(hostel_id):

    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 10))

    meal_type = request.args.get("meal_type")
    date_filter = request.args.get("date")

    query = MessRating.query.filter_by(hostel_id=hostel_id)

    # meal_type filter
    if meal_type:
        query = query.filter(MessRating.meal_type == meal_type)

    # date filter
    if date_filter:
        query = query.filter(func.date(MessRating.created_at) == date_filter)

    pagination = query.order_by(
        MessRating.created_at.desc()
    ).paginate(page=page, per_page=limit, error_out=False)

    ratings = [r.to_dict() for r in pagination.items]

    return jsonify({
        "ratings": ratings,
        "pagination": {
            "page": page,
            "limit": limit,
            "total": pagination.total,
            "pages": pagination.pages
        }
    })

@mess_bp.route("/api/today/<int:hostel_id>", methods=["GET"])
def today_ratings(hostel_id):

    today = date.today()

    ratings = MessRating.query.filter(
        MessRating.hostel_id == hostel_id,
        func.date(MessRating.created_at) == today
    ).all()

    return jsonify({
        "ratings":[r.to_dict() for r in ratings]
    })


@mess_bp.route("/api/stats/<int:hostel_id>", methods=["GET"])
def rating_stats(hostel_id):

    avg_rating = db.session.query(
        func.avg(MessRating.rating)
    ).filter(
        MessRating.hostel_id == hostel_id
    ).scalar()

    total = MessRating.query.filter_by(hostel_id=hostel_id).count()

    return jsonify({
        "total_ratings": total,
        "average_rating": float(avg_rating or 0)
    })

@mess_bp.route("/api/submit", methods=["POST"])
def submit_rating():

    data = request.get_json()

    user_id = data.get("user_id")
    hostel_id = data.get("hostel_id")

    rating = MessRating(
        user_id=user_id,
        hostel_id=hostel_id,
        meal_type=data.get("meal_type"),
        rating=data.get("rating"),
        comment=data.get("comment"),
        photo_url=data.get("photo_url"),
        date=date.today(),
        created_at=datetime.utcnow()
    )

    db.session.add(rating)
    db.session.commit()

    return jsonify({
        "message": "Rating submitted successfully",
        "rating": rating.to_dict()
    }), 201