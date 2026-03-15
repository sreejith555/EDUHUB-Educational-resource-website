<?php
// php/login.php — EduHub PHP Authentication (only PHP file in the project)
// This is an alternative login handler using PHP + MySQL.
// The primary login is handled by Flask (/api/login).
// To use this file: point your web server's /login route to this file
// and ensure session handling matches your setup.

session_start();

$hostname = "localhost";
$username = "root";
$password = "";
$db       = "eduhub";

$conn  = mysqli_connect($hostname, $username, $password, $db);
$error = "";

if (!$conn) {
    die("Database connection failed: " . mysqli_connect_error());
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $u = trim($_POST["username"] ?? "");
    $p = trim($_POST["password"] ?? "");

    if (empty($u) || empty($p)) {
        $error = "Please fill in both username and password.";
    } else {
        $stmt = mysqli_prepare(
            $conn,
            "SELECT * FROM users WHERE (user_name = ? OR email_id = ?) AND password = ?"
        );
        mysqli_stmt_bind_param($stmt, "sss", $u, $u, $p);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        $row    = mysqli_fetch_assoc($result);

        if ($row) {
            $_SESSION["user"] = $row["user_name"];
            header("Location: /home");
            exit();
        } else {
            $error = "Invalid credentials. Try: Alice Sharma / demo123";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>EduHub — Login (PHP)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/static/css/login.css" />
</head>
<body>
  <div class="login-wrapper">
    <!-- Left panel -->
    <div class="login-left">
      <div class="login-brand">
        <span class="login-logo">🎓</span>
        <h1 class="login-title">EduHub</h1>
        <p class="login-tagline">India's Premier Education Discovery Platform</p>
      </div>
      <div class="login-stats">
        <div class="stat-item">
          <span class="stat-num">8+</span>
          <span class="stat-label">Top Courses</span>
        </div>
        <div class="stat-item">
          <span class="stat-num">8</span>
          <span class="stat-label">Entrance Exams</span>
        </div>
        <div class="stat-item">
          <span class="stat-num">8</span>
          <span class="stat-label">Scholarships</span>
        </div>
        <div class="stat-item">
          <span class="stat-num">8</span>
          <span class="stat-label">Events</span>
        </div>
      </div>
      <p class="login-quote">"Education is the most powerful weapon which you can use to change the world." — Nelson Mandela</p>
    </div>

    <!-- Right panel -->
    <div class="login-right">
      <div class="login-card">
        <h2 class="form-title">Welcome Back</h2>
        <p class="form-subtitle">Sign in to continue your educational journey</p>

        <?php if ($error): ?>
          <div class="error-box"><?= htmlspecialchars($error) ?></div>
        <?php endif; ?>

        <form method="POST" action="login.php">
          <div class="form-group">
            <label for="username">Username or Email</label>
            <input type="text" id="username" name="username"
                   placeholder="e.g. Alice Sharma or alice@eduhub.in"
                   autocomplete="username"
                   value="<?= htmlspecialchars($_POST['username'] ?? '') ?>" />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password"
                   placeholder="Enter your password"
                   autocomplete="current-password" />
          </div>
          <button type="submit" class="btn-login">Sign In</button>
        </form>

        <div class="demo-creds">
          <p class="demo-label">Demo Credentials</p>
          <div class="cred-row"><span>Alice Sharma</span><span>demo123</span></div>
          <div class="cred-row"><span>Rahul Mehta</span><span>demo123</span></div>
          <div class="cred-row"><span>Priya Nair</span><span>demo123</span></div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
