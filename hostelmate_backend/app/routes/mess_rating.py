from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func
from app.extensions import db
from app.models.user import User
from app.models.mess_rating import MessRating
from datetime import datetime, date

mess_bp = Blueprint("mess_ratings", __name__)

@mess_bp.route("/api/ratings", methods = ["GET"])
@jwt_required()
def get_ratings():

    user_id = get_jwt_identity()

    user = User.query.get(user_id)
    hostel_id = user.hostel_id

    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 10))

    meal_type = request.args.get("meal_type")
    date = request.args.get("date")

    query = MessRating.query.filter_by(hostel_id=hostel_id)

    if meal_type:
        query = query.filter(MessRating.meal_type == meal_type)

    if date:
        query = query.filter(func.date(MessRating.created_at) == date)

    total = query.count()

    ratings = query.order_by(
        MessRating.created_at.desc()
    ).paginate(page=page, per_page=limit, error_out=False)

    data = [r.to_dict() for r in ratings.items]


    breakfast_count = query.filter(
        MessRating.meal_type == "breakfast"
    ).count()

    lunch_count = query.filter(
        MessRating.meal_type == "lunch"
    ).count()

    dinner_count = query.filter(
        MessRating.meal_type == "dinner"
    ).count()

    return jsonify({
        "ratings": data,
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total
        },
        "counts": {
            "breakfast": breakfast_count,
            "lunch": lunch_count,
            "dinner": dinner_count
        }
    })


@mess_bp.route("/api/today", methods=["GET"])
@jwt_required()
def today_ratings():

    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    today = date.today()

    ratings = MessRating.query.filter(
        MessRating.hostel_id == user.hostel_id,
        func.date(MessRating.created_at) == today
    ).all()

    return jsonify({
        "ratings":[r.to_dict() for r in ratings]
    })


@mess_bp.route("/api/stats", methods=["GET"])
@jwt_required()
def rating_stats():

    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    hostel_id = user.hostel_id

    total = MessRating.query.filter_by(
        hostel_id=hostel_id
    ).count()

    breakfast = MessRating.query.filter_by(
        hostel_id=hostel_id,
        meal_type="breakfast"
    ).count()

    lunch = MessRating.query.filter_by(
        hostel_id=hostel_id,
        meal_type="lunch"
    ).count()

    dinner = MessRating.query.filter_by(
        hostel_id=hostel_id,
        meal_type="dinner"
    ).count()

    five_star = MessRating.query.filter(
        MessRating.hostel_id == hostel_id,
        MessRating.rating == 5
    ).count()

    avg_rating = db.session.query(
        func.avg(MessRating.rating)
    ).filter(
        MessRating.hostel_id == hostel_id
    ).scalar()

    return jsonify({
        "total_ratings": total,
        "breakfast_ratings": breakfast,
        "lunch_ratings": lunch,
        "dinner_ratings": dinner,
        "five_star_ratings": five_star,
        "average_rating": float(avg_rating or 0)
    })

@mess_bp.route("/api/submit", methods=["POST"])
@jwt_required()
def submit_rating():

    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    data = request.get_json()

    rating = MessRating(
        user_id=user_id,
        hostel_id=user.hostel_id,
        meal_type=data["meal_type"],
        rating=data["rating"],
        comment=data.get("comment"),
        created_at=datetime.utcnow()
    )

    db.session.add(rating)
    db.session.commit()

    return jsonify({
        "message":"Rating submitted successfully",
        "rating": rating.to_dict()
    }),201