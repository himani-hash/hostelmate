from app.extensions import db
import bcrypt 

class User(db.Model):
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
    
    def to_dict(self):
        return{
            "id":self.id,
            "email":self.email,
            "name":self.name
        }