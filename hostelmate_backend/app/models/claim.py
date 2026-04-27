from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.hostel import Hostels
from app.models.user import User
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity


class Claim(db.Model):
    __tablename__ = "claims"

    id = db.Column(db.Integer, primary_key=True)

    item_id = db.Column(db.Integer, db.ForeignKey("lost_found.id"), nullable=False)
    claimant_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    message = db.Column(db.Text, nullable=True)

    status = db.Column(db.String(20), default="pending")  # pending, approved, rejected

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    item = db.relationship("LostFound", backref="claims")
    claimant = db.relationship("User", backref="claims")