import datetime
import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import (
  JWTManager,
  create_access_token,
  jwt_required,
  get_jwt_identity,
)
from werkzeug.security import check_password_hash, generate_password_hash
from flask_cors import CORS

# Initialize Flask app and extensions
app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///users.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = "your_jwt_secret_key"
app.config["CORS_HEADERS"] = "Content-Type"

db = SQLAlchemy(app)
jwt = JWTManager(app)


# Define User model
class User(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  username = db.Column(db.String(80), unique=True, nullable=False)
  password = db.Column(db.String(200), nullable=False)


# Define Note model
class Note(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  title = db.Column(db.String(80), nullable=False)
  content = db.Column(db.Text, nullable=False)
  created_at = db.Column(db.DateTime, nullable=False)
  username = db.Column(db.String(80), db.ForeignKey('user.username'), nullable=False)
  user = db.relationship('User', backref=db.backref('notes', lazy=True))


# Register endpoint
@app.route("/register", methods=["POST"])
def register():
  data = request.get_json()
  if not data or not data.get("username") or not data.get("password"):
    return jsonify({"error": "Missing username or password"}), 400

  username = data["username"]
  password = data["password"]

  # Check if the username already exists
  if User.query.filter_by(username=username).first():
    return jsonify({"error": "Username already exists"}), 400

  # Create a new user
  new_user = User(username=username, password=generate_password_hash(password))
  db.session.add(new_user)
  db.session.commit()

  return jsonify({"message": "User created successfully"}), 201


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
  access_token = create_access_token(identity=user.username)
  return jsonify({"access_token": access_token, "message": "Login successful"}), 200


# Get notes endpoint
@app.route("/notes", methods=["GET"])
@jwt_required()
def get_notes():
  current_user = get_jwt_identity()
  notes = Note.query.filter_by(username=current_user).all()

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
  return jsonify(notes), 200


# Add note endpoint
@app.route("/add-note", methods=["POST"])
@jwt_required()
def add_note():
  current_user = get_jwt_identity()
  time_of_creation = datetime.datetime.now()

  data = request.get_json(silent=True)
  if not data or not isinstance(data, dict):
    return jsonify({"error": "Invalid JSON payload"}), 400

  title = data.get("title")
  content = data.get("content")

  if not title or not content:
    return jsonify({"error": "Missing title or content"}), 400

  note = Note(
    title=title,
    content=content,
    created_at=time_of_creation,
    username=current_user
  )

  try:
    db.session.add(note)
    db.session.commit()
    return jsonify({"message": "Note added successfully"}), 201
  except Exception as e:
    db.session.rollback()
    return jsonify({"error": str(e)}), 500


# Update note endpoint
@app.route("/update-note/<int:id>", methods=["PUT"])
@jwt_required()
def update_note(id):
  current_user = get_jwt_identity()
  data = request.get_json()
  if not data or not data.get("title") or not data.get("content"):
    return jsonify({"error": "Missing title or content"}), 400

  title = data["title"]
  content = data["content"]

  note = Note.query.filter_by(id=id, username=current_user).first()
  if not note:
    return jsonify({"error": "Note not found"}), 404

  note.title = title
  note.content = content
  db.session.commit()

  return jsonify({"message": "Note updated successfully"}), 200


# Delete note endpoint
@app.route("/delete-note/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_note(id):
  current_user = get_jwt_identity()
  note = Note.query.filter_by(id=id, username=current_user).first()
  if not note:
    return jsonify({"error": "This Note doesn't exist."}), 404

  db.session.delete(note)
  db.session.commit()

  return jsonify({"message": "Note deleted successfully"}), 200


if __name__ == "__main__":
  db_path = "instance/users.db"

  with app.app_context():
    if not os.path.exists(db_path):
      db.create_all()

      admin = User(username="admin", password=generate_password_hash("admin"))
      user1 = User(username="user1", password=generate_password_hash("password1"))
      user2 = User(username="user2", password=generate_password_hash("password2"))
      db.session.add(admin)
      db.session.add(user1)
      db.session.add(user2)
      db.session.commit()

      note1 = Note(
        title="Admin Note",
        content="This is a note for the admin user.",
        created_at=datetime.datetime.now(),
        username=admin.username,
      )
      note2 = Note(
        title="User1 Note",
        content="This is a note for user1.",
        created_at=datetime.datetime.now(),
        username=user1.username,
      )
      note3 = Note(
        title="User2 Note",
        content="This is a note for user2.",
        created_at=datetime.datetime.now(),
        username=user2.username,
      )
      db.session.add(note1)
      db.session.add(note2)
      db.session.add(note3)
      db.session.commit()
      print("Database created and initialized with sample data.")
    else:
      print("Database already exists. Skipping initialization.")

  app.run(debug=True)
