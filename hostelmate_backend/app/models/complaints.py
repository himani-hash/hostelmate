from app.extensions import db
from datetime import datetime

class Complaint(db.Model):
    __tablename__ = "complaints"

    id = db.Column(db.Integer, primary_key = True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable = True)
    hostel_id = db.Column(db.Integer, db.ForeignKey("hostels.id") ,nullable = True)
    category = db.Column(db.String(50), nullable = False)
    priority = db.Column(db.String(20), nullable = False)
    description = db.Column(db.String(200), nullable=False)
    status = db.Column(db.String(20), default = "Pending")
    is_anonymous = db.Column(db.Boolean, default = False)
    admin_response = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default = datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate= datetime.utcnow)
    resolved_at = db.Column(db.DateTime)
