from flask import Flask
from flask_cors import CORS
from app.extensions import db, jwt, mail
from app.routes.auth import auth_bp
from app.routes.mess_rating import mess_bp
from app.routes.hostel import hostel_bp
from app.routes.mess_menu import menu_bp 
from app.routes.complaints import complaint_bp
from app.routes.user import user_bp
from app.routes.leave import leave_bp
from app.routes.lost_found import lost_found_bp
from flask_migrate import Migrate
from app.models.user import User
from app.models.hostel import Hostels
from app.models.mess_rating import MessRating
from app.models.mess_menu import Messmenu
from app.models.complaints import Complaint
from app.models.leave import Leave
from app.models.lost_found import LostFound
from app.models.claim import Claim
import cloudinary
import os
from dotenv import load_dotenv



load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUD_NAME"),
    api_key=os.getenv("API_KEY"),
    api_secret=os.getenv("API_SECRET")
)

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"]}}, supports_credentials=True)

    app.config["UPLOAD_FOLDER"] = "uploads"
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

    app.config["MAIL_SERVER"] = "smtp.gmail.com"
    app.config["MAIL_PORT"] = 587
    app.config["MAIL_USE_TLS"] = True
    app.config["MAIL_USERNAME"] = os.getenv("MAIL_USERNAME")
    app.config["MAIL_PASSWORD"] = os.getenv("MAIL_PASSWORD")
    app.config["MAIL_DEFAULT_SENDER"] = os.getenv("MAIL_USERNAME")

    db.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)

    migrate = Migrate(app, db)

    app.register_blueprint(auth_bp, url_prefix="")
    app.register_blueprint(mess_bp, url_prefix="")
    app.register_blueprint(hostel_bp, url_prefix="")
    app.register_blueprint(menu_bp, url_prefix="")
    app.register_blueprint(complaint_bp, url_prefix="")
    app.register_blueprint(user_bp, url_prefix="")
    app.register_blueprint(leave_bp, url_prefix="")
    app.register_blueprint(lost_found_bp, url_prefix="")    

    return app