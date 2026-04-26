from app.extensions import db
import bcrypt 
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
import secrets

token = secrets.token_urlsafe(32)


class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key = True)
    email = db.Column(db.String(100), unique = True, nullable = False)
    name = db.Column(db.String(100), nullable = False)
    password_hash = db.Column(db.String(255), nullable = False)

    def set_password(self, password):
        self.password_hash = bcrypt.hashpw(
            password.encode("utf-8"),
            bcrypt.gensalt()
        ).decode("utf-8")

    def check_password(self, password):
         return bcrypt.checkpw(password.encode("utf-8"),
                            self.password_hash.encode("utf-8")   )
    
    hostel_id = db.Column(db.Integer, db.ForeignKey("hostels.id")) 
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
   
    role = db.Column(db.String(20), default="student")
    phone = db.Column(db.String(15), unique = True)
    

    room_number = db.Column(db.String(20))
    course = db.Column(db.String(100))
    year = db.Column(db.String(20))
    is_verified = db.Column(db.Boolean, default=False)
    verification_token = db.Column(db.String(255))
    reset_token = db.Column(db.String(255), nullable=True)
    reset_token_expiry = db.Column(db.DateTime)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )
    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "hostel_id": self.hostel_id,
            "room_number": self.room_number,
            "course": self.course,
            "year": self.year,
            "is_verified": self.is_verified,
            "role": self.role,
            "created_at": str(self.created_at)
        }