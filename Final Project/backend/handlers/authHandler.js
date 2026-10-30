 
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getByEmail, createUser } = require("../pkg/user/userSchema");

// Login

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Please provide email and password",
      });
    }

    const user = await getByEmail(email);

    if (!user) {
      return res.status(404).json({
        error: "User not found!",
      });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return res.status(404).json({
        error: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES,
      }
    );

    return res.status(200).json({
      status: "success",
      token,
      role: user.role,
      username: user.username,
      startupPhoto: user.startupPhoto || "",
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

// Register

const passwordRegex = /^(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

exports.register = async (req, res) => {
  try {
    const {
      email,
      username,
      password,
      role,
      startupName,
      legalRepresentative,
      businessAddress,
      mentorEmail,
    } = req.body;

    if (!email || !username || !password || !role) {
      return res.status(400).json({
        error: "Please provide email, username, password and role",
      });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password must contain at least 8 characters, a number and a symbol",
      });
    }

    if (password.toLowerCase().includes(email.toLowerCase())) {
      return res.status(400).json({
        error: "Password cannot contain your email",
      });
    }

    if (password.toLowerCase().includes(username.toLowerCase())) {
      return res.status(400).json({
        error: "Password cannot contain your username",
      });
    }

    if (role !== "mentor" && role !== "company") {
      return res.status(400).json({
        error: "Invalid role",
      });
    }

    const existingUser = await getByEmail(email);

    if (existingUser) {
      return res.status(400).json({
        error: "User already exists",
      });
    }

    const user = await createUser({
  email,
  username,
  password,
  role,
  ...(role === "company" && {
    startupName,
    legalRepresentative,
    businessAddress,
    mentorEmail,
    startupPhoto: req.file
      ? `/uploads/${req.file.filename}`
      : "",
  }),
});

    return res.status(201).json({
      status: "success",
      user,
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};
