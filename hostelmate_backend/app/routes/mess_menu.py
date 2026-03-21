from flask import Blueprint, request, jsonify
from sqlalchemy import func
from app.extensions import db
from app.models.user import User
from app.models.hostel import Hostels
from app.models.mess_menu import Messmenu
from datetime import datetime, date, timedelta

menu_bp = Blueprint("mess_menu", __name__)

@menu_bp.route("/api/menu/<int:hostel_id>/<string:week_date>", methods=["GET"])
def get_week_menu(hostel_id, week_date):
    try:
        week_date = datetime.strptime(week_date, "%Y-%m-%d").date()

        menus = Messmenu.query.filter_by(
            hostel_id=hostel_id,
            week_start_date=week_date
        ).all()

        result = {}

        for menu in menus:
            if menu.day not in result:
                result[menu.day] = {}

            if menu.meal_type not in result[menu.day]:
                result[menu.day][menu.meal_type] = []

            result[menu.day][menu.meal_type].append(menu.item)

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@menu_bp.route("/api/add-menu", methods=["POST"])
def add_menu():
    data = request.get_json()

    try:
        menu = Messmenu(
            hostel_id=data["hostel_id"],
            day=data["day"],
            meal_type=data["meal_type"],
            item=data["item"],
            created_by=data["created_by"],  # warden id
            week_start_date=datetime.strptime(data["week_start_date"], "%Y-%m-%d")
        )

        db.session.add(menu)
        db.session.commit()

        return jsonify({"message": "Menu added successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@menu_bp.route("/api/menu/<int:id>", methods=["DELETE"])
def delete_menu(id):
    try:
        menu = Messmenu.query.get(id)

        if not menu:
            return jsonify({"message": "Menu not found"}), 404

        db.session.delete(menu)
        db.session.commit()

        return jsonify({"message": "Menu deleted successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@menu_bp.route("/api/menu/<int:id>", methods=["PUT"])
def update_menu(id):
    data = request.get_json()

    try:
        menu = Messmenu.query.get(id)

        if not menu:
            return jsonify({"message": "Menu not found"}), 404

        # Update only changed fields
        if "day" in data:
            menu.day = data["day"]

        if "meal_type" in data:
            menu.meal_type = data["meal_type"]

        if "item" in data:
            menu.item = data["item"]

        if "week_start_date" in data:
            menu.week_start_date = datetime.strptime(
                data["week_start_date"], "%Y-%m-%d"
            )

        db.session.commit()

        return jsonify({"message": "Menu updated successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500