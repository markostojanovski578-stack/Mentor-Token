
import { useState } from "react";
import "./Register.css";

function Register() {
  const [accountType, setAccountType] = useState("mentor");
  const [startupStep, setStartupStep] = useState(1);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [startupName, setStartupName] = useState("");
  const [legalRepresentative, setLegalRepresentative] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [mentorEmail, setMentorEmail] = useState("");
  const [startupPhoto, setStartupPhoto] = useState(null);
  const [startupPhotoPreview, setStartupPhotoPreview] = useState("");
  const [focusedField, setFocusedField] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const has8Characters = password.length >= 8;
  const hasNumberOrSymbol = /[\d\W]/.test(password);
  const emailName = email.split("@")[0];
  const doesNotContainEmail =
    emailName !== "" && !password.toLowerCase().includes(emailName.toLowerCase());
  const showAccountDetails = accountType === "mentor" || startupStep === 1;

  const handleStartupPhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      alert("Please select a JPG, PNG or WebP image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Please select an image smaller than 5 MB.");
      return;
    }

    setStartupPhoto(file);
    setStartupPhotoPreview(URL.createObjectURL(file));
  };

  const registerMentor = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const response = await fetch("http://localhost:10000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          username: email.split("@")[0],
          password,
          role: "mentor",
        }),
      });

      const text = await response.text();

      if (response.ok) {
        alert("Account created successfully!");
      } else {
        alert("Backend said: " + text);
      }
    } catch (error) {
      console.log("ERROR:", error);
      alert("Could not connect to the server");
    } finally {
      setSubmitting(false);
    }
  };

  const continueRegistration = () => {
    if (accountType === "mentor") {
      registerMentor();
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!has8Characters || !hasNumberOrSymbol || !doesNotContainEmail) {
      alert("Please make sure your password meets all the requirements.");
      return;
    }

    setFocusedField("");
    setStartupStep(2);
  };

  const registerStartup = async () => {
    if (!startupName.trim() || !legalRepresentative.trim() || !businessAddress.trim()) {
      alert("Please fill in all required startup information.");
      return;
    }

    if (mentorEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mentorEmail.trim())) {
      alert("Please enter a valid mentor email address.");
      return;
    }

    if (!acceptedTerms) {
      alert("Please accept the terms and privacy policy.");
      return;
    }

    if (submitting) return;
    setSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("email", email.trim());
      formData.append("username", startupName.trim());
      formData.append("password", password);
      formData.append("role", "company");
      formData.append("startupName", startupName.trim());
      formData.append("legalRepresentative", legalRepresentative.trim());
      formData.append("businessAddress", businessAddress.trim());
      formData.append("mentorEmail", mentorEmail.trim());

      if (startupPhoto) {
        formData.append("startupPhoto", startupPhoto);
      }

      const response = await fetch("http://localhost:10000/api/auth/register", {
        method: "POST",
        body: formData,
      });

      const text = await response.text();

      if (response.ok) {
        alert("Startup account created successfully!");
      } else {
        alert("Backend said: " + text);
      }
    } catch (error) {
      console.log("ERROR:", error);
      alert("Could not connect to the server");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="register-main">
      <div className="register-title">
        GROW <br />YOUR <br />START UP
      </div>

      <div className="register-subtitle">
        MONITORING AND EVALUATING NOW IS EASY!
      </div>

      <div className="rocket-div">
        <img className="register-rocket" src="/rocket.svg" alt="" />
      </div>

      <img className="register-logo" src="/logo2.png" alt="Logo" />
      <div className="register-logo-text">mentortoken.com</div>
      <div className="register-white-section"></div>
      <img className="register-logo-solo" src="/logosolo.png" alt="" />

      <div
        className={`register-form-title ${
          accountType === "company" && startupStep === 2
            ? "startup-setup-title"
            : ""
        }`}
      >
        {accountType === "company" && startupStep === 2
          ? "SETUP STARTUP ACCOUNT"
          : "CHOOSE ACCOUNT TYPE"}
      </div>

      <button
        type="button"
        className={accountType === "company" ? "startup-button active" : "startup-button"}
        onClick={() => {
          setAccountType("company");
          setStartupStep(1);
          setFocusedField("");
        }}
      >
        Startup
      </button>

      <button
        type="button"
        className={accountType === "mentor" ? "mentor-button active" : "mentor-button"}
        onClick={() => {
          setAccountType("mentor");
          setStartupStep(1);
          setFocusedField("");
        }}
      >
        Mentor
      </button>

      {showAccountDetails && (
        <>
          <input
            className="register-email-input"
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField("")}
          />

          {focusedField === "email" && (
            <div className="register-email-label">Email</div>
          )}

          <input
            className="register-password-input"
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setFocusedField("password")}
            onBlur={() => setFocusedField("")}
          />

          {focusedField === "password" && (
            <div className="register-password-label">Password</div>
          )}

          <img className="password-check" src="/check.png" alt="" />

          <div className={has8Characters ? "password-strength valid" : "password-strength"}>
            Password Strength : Weak
          </div>

          <img className="password-check-name" src="/check.png" alt="" />

          <div className={doesNotContainEmail ? "password-name-text valid" : "password-name-text"}>
            Cannot contain your name or email address
          </div>

          <img className="password-check-length" src="/check.png" alt="" />

          <div className={has8Characters ? "password-length-text valid" : "password-length-text"}>
            At least 8 characters
          </div>

          <img className="password-check-symbol" src="/check.png" alt="" />

          <div className={hasNumberOrSymbol ? "password-symbol-text valid" : "password-symbol-text"}>
            Contains a number or symbol
          </div>

          <button
            type="button"
            className="register-continue-button"
            onClick={continueRegistration}
            disabled={submitting}
          >
            Continue
          </button>

          <div className="already-account">
            Already have account? <a href="/login">Login</a>
          </div>
        </>
      )}

      {accountType === "company" && startupStep === 2 && (
        <>
          <div className="startup-photo-upload">
            <input
              id="startup-photo-input"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleStartupPhotoChange}
              hidden
            />

            <label
              htmlFor="startup-photo-input"
              className="startup-photo-circle"
              title="Upload company photo"
            >
              {startupPhotoPreview ? (
                <img
                  src={startupPhotoPreview}
                  alt="Company preview"
                  className="startup-photo-preview"
                />
              ) : (
                <svg
                  width="34"
                  height="34"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="7" width="18" height="14" rx="2" />
                  <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <path d="M3 13a18 18 0 0 0 18 0" />
                </svg>
              )}

              <span className="startup-photo-camera">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 4H10L8 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2-2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-4z" />
                  <circle cx="12" cy="13" r="3" />
                </svg>
              </span>
            </label>
          </div>

          <input
            className="startup-name-input"
            type="text"
            placeholder="Startup name"
            value={startupName}
            onChange={(e) => setStartupName(e.target.value)}
            onFocus={() => setFocusedField("startupName")}
            onBlur={() => setFocusedField("")}
          />

          {focusedField === "startupName" && (
            <div className="startup-name-label">Startup name</div>
          )}

          <input
            className="legal-representative-input"
            type="text"
            placeholder="Legal Representative"
            value={legalRepresentative}
            onChange={(e) => setLegalRepresentative(e.target.value)}
            onFocus={() => setFocusedField("legalRepresentative")}
            onBlur={() => setFocusedField("")}
          />

          {focusedField === "legalRepresentative" && (
            <div className="legal-representative-label">Legal Representative</div>
          )}

          <input
            className="business-address-input"
            type="text"
            placeholder="Registered business address"
            value={businessAddress}
            onChange={(e) => setBusinessAddress(e.target.value)}
            onFocus={() => setFocusedField("businessAddress")}
            onBlur={() => setFocusedField("")}
          />

          {focusedField === "businessAddress" && (
            <div className="business-address-label">Registered business address</div>
          )}

          <input
            className="invite-mentors-input"
            type="email"
            placeholder="Invite Mentors via email"
            value={mentorEmail}
            onChange={(e) => setMentorEmail(e.target.value)}
            onFocus={() => setFocusedField("mentorEmail")}
            onBlur={() => setFocusedField("")}
          />

          {focusedField === "mentorEmail" && (
            <div className="invite-mentors-label">Invite Mentors via email</div>
          )}

          <button
            type="button"
            className="register-startup-button"
            onClick={registerStartup}
            disabled={submitting}
          >
            Register
          </button>

          <input
            className="startup-terms-checkbox"
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
          />

          <p className="startup-terms">
            By signing up to create an account I accept Company’s{" "}
            <a href="#">Terms of use</a> &{" "}
            <a href="#">Privacy Policy</a>.
          </p>
        </>
      )}
    </main>
  );
}

export default Register;
