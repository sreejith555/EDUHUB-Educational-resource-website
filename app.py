from flask import Flask, render_template, jsonify, request, session, redirect
import mysql.connector, os, json, decimal
from datetime import date, datetime

app = Flask(__name__)
app.secret_key = "eduhub_secret_2025"

DB = {
    "host":     os.getenv("DB_HOST", "localhost"),
    "user":     os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASS", "root"),
    "database": os.getenv("DB_NAME", "eduhub"),
    "charset":  "utf8mb4"
}

def get_conn():
    return mysql.connector.connect(**DB)

def serial(o):
    if isinstance(o, (date, datetime)):
        return o.isoformat()
    if isinstance(o, decimal.Decimal):
        return float(o)
    raise TypeError(f"Object of type {type(o)} is not JSON serializable")

def db_fetch(sql, p=()):
    c = get_conn()
    cur = c.cursor(dictionary=True)
    cur.execute(sql, p)
    r = cur.fetchall()
    cur.close()
    c.close()
    return r

def db_one(sql, p=()):
    r = db_fetch(sql, p)
    return r[0] if r else None

def safe(rows):
    return json.loads(json.dumps(rows, default=serial))


# Pages 

@app.route("/")
def index():
    return redirect("/login")

@app.route("/login")
def login_page():
    return render_template("login.html")

@app.route("/signup")
def signup_page():
    return render_template("signup.html")

@app.route("/home")
def home():
    stats = {k: db_one(f"SELECT COUNT(*) AS n FROM {t}")["n"]
             for k, t in [("courses",      "courses"),
                           ("exams",        "entrance_exams"),
                           ("scholarships", "scholarships"),
                           ("events",       "events")]}
    upcoming = safe(db_fetch(
        "SELECT name, host, exam_date, link FROM entrance_exams ORDER BY exam_date ASC LIMIT 3"))
    schols = safe(db_fetch(
        "SELECT name, host, deadline_date, amount, link FROM scholarships ORDER BY deadline_date ASC LIMIT 3"))
    return render_template("home.html", stats=stats, upcoming=upcoming, schols=schols)

@app.route("/courses")
def courses_page():
    return render_template("courses.html")

@app.route("/exams")
def exams_page():
    return render_template("exams.html")

@app.route("/scholarships")
def scholarships_page():
    return render_template("scholarships.html")

@app.route("/events")
def events_page():
    return render_template("events.html")


#API

@app.route("/api/courses")
def api_courses():
    q     = request.args.get("q",     "").strip()
    field = request.args.get("field", "").strip()
    w, p  = ["1=1"], []
    if q:
        w.append("(name LIKE %s OR host LIKE %s OR description LIKE %s)")
        p += [f"%{q}%"] * 3
    if field:
        w.append("field=%s")
        p.append(field)
    return jsonify(safe(db_fetch(
        f"SELECT * FROM courses WHERE {' AND '.join(w)} ORDER BY last_date ASC", p)))

@app.route("/api/exams")
def api_exams():
    q     = request.args.get("q",     "").strip()
    field = request.args.get("field", "").strip()
    w, p  = ["1=1"], []
    if q:
        w.append("(name LIKE %s OR host LIKE %s OR description LIKE %s)")
        p += [f"%{q}%"] * 3
    if field:
        w.append("field=%s")
        p.append(field)
    return jsonify(safe(db_fetch(
        f"SELECT * FROM entrance_exams WHERE {' AND '.join(w)} ORDER BY exam_date ASC", p)))

@app.route("/api/scholarships")
def api_scholarships():
    q   = request.args.get("q",        "").strip()
    cat = request.args.get("category", "").strip()
    w, p = ["1=1"], []
    if q:
        w.append("(name LIKE %s OR host LIKE %s OR description LIKE %s)")
        p += [f"%{q}%"] * 3
    if cat:
        w.append("category=%s")
        p.append(cat)
    return jsonify(safe(db_fetch(
        f"SELECT * FROM scholarships WHERE {' AND '.join(w)} ORDER BY deadline_date ASC", p)))

@app.route("/api/events")
def api_events():
    q    = request.args.get("q", "").strip()
    w, p = ["1=1"], []
    if q:
        w.append("(name LIKE %s OR host LIKE %s OR description LIKE %s OR venue LIKE %s)")
        p += [f"%{q}%"] * 4
    return jsonify(safe(db_fetch(
        f"SELECT * FROM events WHERE {' AND '.join(w)} ORDER BY date ASC", p)))

@app.route("/api/fields/<table>")
def api_fields(table):
    t = {"courses": "courses", "exams": "entrance_exams"}.get(table)
    if not t:
        return jsonify([])
    return jsonify([r["field"] for r in db_fetch(
        f"SELECT DISTINCT field FROM {t} ORDER BY field")])

@app.route("/api/categories")
def api_categories():
    return jsonify([r["category"] for r in db_fetch(
        "SELECT DISTINCT category FROM scholarships ORDER BY category")])

@app.route("/api/login", methods=["POST"])
def api_login():
    d = request.get_json() or {}
    u = db_one(
        "SELECT * FROM users WHERE (user_name=%s OR email_id=%s) AND password=%s",
        (d.get("username", ""), d.get("username", ""), d.get("password", "")))
    if u:
        session["user"] = u["user_name"]
        return jsonify({"ok": True, "name": u["user_name"]})
    return jsonify({"ok": False, "msg": "Invalid username or password"}), 401

@app.route("/api/signup", methods=["POST"])
def api_signup():
    d        = request.get_json() or {}
    fullname = d.get("fullname", "").strip()
    email    = d.get("email", "").strip()
    password = d.get("password", "").strip()

    if not fullname or not email or not password:
        return jsonify({"ok": False, "msg": "All fields are required."}), 400
    if len(password) < 6:
        return jsonify({"ok": False, "msg": "Password must be at least 6 characters."}), 400

    existing = db_one("SELECT id FROM users WHERE email_id=%s", (email,))
    if existing:
        return jsonify({"ok": False, "msg": "An account with this email already exists."}), 409

    existing_name = db_one("SELECT id FROM users WHERE user_name=%s", (fullname,))
    if existing_name:
        return jsonify({"ok": False, "msg": "This name is already taken."}), 409

    c = get_conn()
    cur = c.cursor()
    cur.execute("INSERT INTO users (user_name, email_id, password) VALUES (%s, %s, %s)", (fullname, email, password))
    c.commit()
    cur.close()
    c.close()
    return jsonify({"ok": True, "msg": "Account created successfully!"})

@app.route("/api/logout")
def api_logout():
    session.clear()
    return redirect("/login")


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
