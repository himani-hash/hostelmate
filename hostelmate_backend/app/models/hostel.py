from app.extensions import db
from datetime import datetime


class Hostels(db.Model):
    __tablename__ = "hostels"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    code = db.Column(db.String(100), unique=True, nullable=False)
    address = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    users = db.relationship("User", backref="hostel", lazy=True)
    mess_ratings = db.relationship("MessRating", backref="hostel", lazy=True)