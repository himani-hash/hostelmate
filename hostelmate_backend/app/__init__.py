from flask import Flask
from flask_cors import CORS
from app.extensions import db, jwt
from app.routes.auth import auth_bp
from app.routes.mess_rating import mess_bp
from app.routes.hostel import hostel_bp 
from flask_migrate import Migrate
from app.models.user import User
from app.models.hostel import Hostels
from app.models.mess_rating import MessRating
import os
from dotenv import load_dotenv


load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

    db.init_app(app)
    jwt.init_app(app)

    migrate = Migrate(app, db)

    app.register_blueprint(auth_bp, url_prefix="")
    app.register_blueprint(mess_bp, url_prefix="")
    app.register_blueprint(hostel_bp, url_prefix="")

    return app