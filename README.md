# 🎓 EduHub — India's Education Discovery Platform

EduHub is a full-stack web application that helps students discover courses, entrance exams, scholarships, and events at India's top institutions. Built with Python Flask, MySQL, vanilla JavaScript, and a PHP login alternative.

---

## 📁 Project Structure

```
eduhub/
├── app.py                        ← Flask backend (serves pages + JSON API)
├── requirements.txt              ← Python dependencies
├── README.md
├── .gitignore
├── sql/
│   └── database.sql              ← Full schema + real Indian education data
├── templates/
│   ├── partials/
│   │   ├── header.html           ← Sticky top navigation bar
│   │   └── sidebar.html          ← Dark navy sidebar
│   ├── login.html                ← Split-layout login page
│   ├── home.html                 ← Dashboard with stats + quick views
│   ├── courses.html              ← Courses listing with search/filter
│   ├── exams.html                ← Entrance exams with search/filter
│   ├── scholarships.html         ← Scholarships with search/filter
│   └── events.html               ← Events with search
├── static/
│   ├── css/
│   │   ├── login.css             ← Login page styles
│   │   └── style.css             ← Inner pages styles
│   └── js/
│       ├── login.js              ← Login form handler (fetch API)
│       ├── main.js               ← Shared utilities (badges, formatters)
│       ├── courses.js            ← Courses page logic
│       ├── exams.js              ← Exams page logic
│       ├── scholarships.js       ← Scholarships page logic
│       └── events.js             ← Events page logic
└── php/
    └── login.php                 ← Alternative PHP login (only PHP file)
```

---

## ✅ Requirements

| Requirement       | Version    |
|-------------------|------------|
| Python            | 3.9+       |
| MySQL             | 8.0+       |
| PHP (optional)    | 7.4+       |
| pip               | Latest     |

### Python packages (requirements.txt)
```
flask==3.0.3
mysql-connector-python==8.3.0
```

---

## 🚀 Setup Instructions

### Step 1 — Clone or download the project
```bash
git clone https://github.com/yourusername/eduhub.git
cd eduhub
```

### Step 2 — Install Python dependencies
```bash
pip install -r requirements.txt
```

### Step 3 — Set up MySQL database
Open your MySQL client (MySQL Workbench, phpMyAdmin, or terminal) and run:
```bash
mysql -u root -p < sql/database.sql
```
Or paste the contents of `sql/database.sql` directly into your MySQL client.

This creates the `eduhub` database with all 6 tables and real data.

### Step 4 — Configure database connection (if needed)
By default, `app.py` connects to:
- Host: `localhost`
- User: `root`
- Password: *(empty)*
- Database: `eduhub`

To override, set environment variables before running:
```bash
export DB_HOST=localhost
export DB_USER=root
export DB_PASS=yourpassword
export DB_NAME=eduhub
```

### Step 5 — Run the Flask server
```bash
python app.py
```

### Step 6 — Open in your browser
```
http://localhost:5000
```

You'll be redirected to the login page automatically.

---

## 📦 Tech Stack

| Layer       | Technology                              |
|-------------|------------------------------------------|
| Frontend    | HTML5, CSS3, Vanilla JavaScript          |
| Backend     | Python 3, Flask 3.0                      |
| Database    | MySQL 8.0                                |
| Auth (alt)  | PHP 7.4+ (`php/login.php` only)          |
| Fonts       | Playfair Display + DM Sans (Google Fonts)|

---

## 🌐 Pages & Routes

| Route           | Description                        |
|-----------------|------------------------------------|
| `/`             | Redirects to `/login`              |
| `/login`        | Login page                         |
| `/home`         | Dashboard with stats               |
| `/courses`      | Browse & filter courses            |
| `/exams`        | Browse & filter entrance exams     |
| `/scholarships` | Browse & filter scholarships       |
| `/events`       | Browse & search events             |
| `/api/logout`   | Clears session, redirects to login |

## 🔌 API Endpoints

| Endpoint                 | Description                          |
|--------------------------|--------------------------------------|
| `POST /api/login`        | Authenticate user (JSON)             |
| `GET /api/courses`       | List courses (`?q=&field=`)          |
| `GET /api/exams`         | List exams (`?q=&field=`)            |
| `GET /api/scholarships`  | List scholarships (`?q=&category=`)  |
| `GET /api/events`        | List events (`?q=`)                  |
| `GET /api/fields/courses`| Distinct fields for courses          |
| `GET /api/fields/exams`  | Distinct fields for exams            |
| `GET /api/categories`    | Distinct scholarship categories      |

---

## 🐙 Upload to GitHub

```bash
# 1. Initialise git (if not already done)
git init

# 2. Stage all files
git add .

# 3. Commit
git commit -m "Initial commit: EduHub education platform"

# 4. Create a new repo on github.com, then:
git remote add origin https://github.com/yourusername/eduhub.git
git branch -M main
git push -u origin main
```

---

## 💡 Notes

- The PHP file (`php/login.php`) is a self-contained alternative login handler. It is **not** used by the default Flask setup — it's there for environments that need PHP-based authentication.
- All passwords in the demo database are stored as plain text (`demo123`) for learning purposes. In production, always hash passwords with `bcrypt` or `argon2`.
- The `sessionStorage` key `eduhub_user` stores the logged-in username on the client side for display purposes.

---

*Built with ❤️ for Indian students by EduHub.*
