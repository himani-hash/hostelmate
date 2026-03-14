from datetime import datetime
from app.extensions import db

class MessRating(db.Model):
    __tablename__ = "mess_ratings"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    hostel_id = db.Column(db.Integer, db.ForeignKey("hostels.id"), nullable=False)

    meal_type = db.Column(db.String(50))
    rating = db.Column(db.Integer)
    comment = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    photo_url = db.Column(db.String(500))
    date = db.Column(db.Date)

    user = db.relationship("User", backref="mess_ratings")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "hostel_id": self.hostel_id,
            "meal_type": self.meal_type,
            "rating": self.rating,
            "comment": self.comment,
            "photo_url": self.photo_url,
            "date": str(self.date),
            "created_at": str(self.created_at)
        }