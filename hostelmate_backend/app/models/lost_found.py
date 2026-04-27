from flask import Blueprint, request, jsonify
from app.extensions import db
from datetime import datetime
from app.models.hostel import Hostels
from app.models.user import User
from flask_jwt_extended import jwt_required, get_jwt_identity


class LostFound(db.Model):
    __tablename__ = "lost_found"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    hostel_id = db.Column(db.Integer, db.ForeignKey("hostels.id"), nullable=False)
    type = db.Column(db.String(20), nullable=False) 
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=True)
    category = db.Column(db.String(50)) 
    photo_url = db.Column(db.String(255), nullable=True)
    location = db.Column(db.String(255), nullable=True)
    date_lost_found = db.Column(db.Date, nullable=True)
    status = db.Column(db.String(20), default="active") 
    claimed_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    user = db.relationship("User", foreign_keys=[user_id], backref="items_posted")
    claimant = db.relationship("User", foreign_keys=[claimed_by], backref="items_claimed")

    
    