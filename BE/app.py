import datetime
import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token
from werkzeug.security import check_password_hash
from werkzeug.security import generate_password_hash
from flask_cors import CORS  # Add this import

# Initialize Flask app and extensions
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///users.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = "your_jwt_secret_key"
app.config["CORS_HEADERS"] = "Content-Type"  # Add CORS headers configuration

db = SQLAlchemy(app)
jwt = JWTManager(app)


# Define User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)


class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), nullable=False)
    content = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())


# Login endpoint
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data or not data.get("username") or not data.get("password"):
        return jsonify({"error": "Missing username or password"}), 400

    username = data["username"]
    password = data["password"]

    # Fetch user from the database
    user = User.query.filter_by(username=username).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid username or password"}), 401

    # Generate JWT token
    access_token = create_access_token(identity=user.id)
    return jsonify({"access_token": access_token}), 200


@app.route("/notes", methods=["GET"])
def get_notes():
    notes = Note.query.all()
    notes = [
        {
            "id": note.id,
            "title": note.title,
            "content": note.content,
            "created_at": note.created_at.strftime("%Y-%m-%d %H:%M"),
        }
        for note in notes
    ]
    if not notes:
        return jsonify({"error": "No notes found"}), 404
    else:
        return jsonify(notes), 200


@app.route("/add-note", methods=["POST"])
def add_note():
    time_of_creation = datetime.datetime.now()

    data = request.get_json(silent=True)
    if not data or not isinstance(data, dict):
        return jsonify({"error": "Invalid JSON payload"}), 400

    title = data.get("title")
    content = data.get("content")

    if not title or not content:
        return jsonify({"error": "Missing title or content"}), 400

    # Pass the `datetime` object directly
    note = Note(title=title, content=content, created_at=time_of_creation)
    try:
        db.session.add(note)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Database error", "error": str(e)}), 500

    return jsonify({"message": "Note added successfully"}), 201


@app.route("/update-note/<int:id>", methods=["PUT"])
def update_note(id):
    data = request.get_json()
    if not data or not data.get("title") or not data.get("content"):
        return jsonify({"error": "Missing title or content"}), 400

    title = data["title"]
    content = data["content"]

    note = Note.query.get(id)
    if not note:
        return jsonify({"error": "Note not found"}), 404

    note.title = title
    note.content = content
    db.session.commit()

    return jsonify({"message": "Note updated successfully"}), 200


@app.route("/delete-note/<int:id>", methods=["DELETE"])
def delete_note(id):
    note = Note.query.get(id)
    if not note:
        return jsonify({"error": "This Note doesn't exist."}), 404

    db.session.delete(note)
    db.session.commit()

    return jsonify({"message": "Note deleted successfully"}), 200


if __name__ == "__main__":
    db_path = "instance/users.db"

    with app.app_context():
        # Create database tables and insert initial data only if DB doesn't exist
        if not os.path.exists(db_path):
            db.create_all()

            # Create admin user
            admin = User(username="admin", password=generate_password_hash("admin"))
            db.session.add(admin)
            db.session.commit()  # Commit to ensure admin user gets an ID

            # Add sample notes linked to admin user
            note1 = Note(
                title="Welcome",
                content="Welcome to the notes app!",
                created_at=datetime.datetime.now(),
            )
            note2 = Note(
                title="First Note",
                content="This is your first note.",
                created_at=datetime.datetime.now(),
            )
            db.session.add(note1)
            db.session.add(note2)
            db.session.commit()
            print("Database created and initialized with sample data.")
        else:
            print("Database already exists. Skipping initialization.")

    # Start the Flask application
    app.run(debug=True)
