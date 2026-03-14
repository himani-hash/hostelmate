from app.extensions import db
import bcrypt 
from datetime import datetime


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
    def to_dict(self):
        return{
            "id":self.id,
            "email":self.email,
            "name":self.name
        }