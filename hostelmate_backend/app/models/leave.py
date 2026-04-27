from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.hostel import Hostels
from app.models.user import User
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity

class Leave(db.Model):
    __tablename__ = "leaves"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    hostel_id = db.Column(db.Integer, db.ForeignKey("hostels.id"), nullable=False)
    leave_type = db.Column(db.String(50), nullable=False) 
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    reason = db.Column(db.Text, nullable=False)
    destination = db.Column(db.String(200), nullable=False)
    parent_contact = db.Column(db.String(15), nullable=False)
    contact_number = db.Column(db.String(15), nullable=False)
    status = db.Column(db.String(20), default="pending")  
    approved_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    warden_comment = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)
    approved_at = db.Column(db.DateTime, nullable=True)
    user = db.relationship("User", foreign_keys=[user_id], backref="leaves")
    approver = db.relationship("User", foreign_keys=[approved_by])