
import { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginUser = async () => {
    try {
      const response = await fetch("http://localhost:10000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const role = data.user?.role || data.role;

        if (role !== "mentor" && role !== "company") {
          alert("Login succeeded, but the server did not return a valid account role.");
          console.log("LOGIN RESPONSE:", data);
          return;
        }

        localStorage.setItem("token", data.token);

        if (role === "company") {
          localStorage.setItem("startupName", data.username);

          const photo = data.startupPhoto || "";

          localStorage.setItem(
            "startupPhoto",
            photo
              ? photo.startsWith("http")
                ? photo
                : `http://localhost:10000${photo}`
              : ""
          );
        } else {
          localStorage.removeItem("startupName");
          localStorage.removeItem("startupPhoto");
        }

        alert("Login successful!");

        if (role === "company") {
          navigate("/startup-dashboard");
        } else {
          navigate("/mentor-dashboard");
        }
      } else {
        alert(data.error || "Login failed");
      }
    } catch (error) {
      console.log("ERROR:", error);
      alert("Could not connect to the server");
    }
  };

  return (
    <main className="login-main">
      <div className="login-title">
        GROW <br />
        YOUR <br />
        START UP
      </div>

      <div className="login-subtitle">
        MONITORING AND EVALUATING NOW IS EASY!
      </div>

      <img className="login-rocket" src="/rocket.svg" alt="" />
      <img className="login-logo" src="/logo2.png" alt="Logo" />

      <div className="login-logo-text">
        mentortoken.com
      </div>

      <img className="login-logo-solo" src="/logosolo.png" alt="" />

      <div className="login-form-title">
        LOG IN TO MENTOR TOKEN
      </div>

      <div className="login-form-subtitle">
        Enter your email and pass to login.
      </div>

      <div className="login-input-label">
        Email
      </div>

      <input
        className="login-input"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <div className="login-password-label">
        Password
      </div>

      <input
        className="login-password-input"
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <a className="forgot-password" href="#">
        Forgot password?
      </a>

      <button
        className="login-button"
        onClick={loginUser}
      >
        Log in
      </button>

      <div className="register-text">
        Don’t have account? <a href="/register">Register</a>
      </div>

      <div className="login-white-section"></div>
    </main>
  );
}

export default Login;
