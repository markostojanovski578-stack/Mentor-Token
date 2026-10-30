
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  username: String,
  password: String,

  role: {
    type: String,
    enum: ["mentor", "company"],
  },

  // Startup information
  startupName: String,
  legalRepresentative: String,
  businessAddress: String,
  mentorEmail: String,
  startupPhoto: String,

  // Mentor information
  mentorPhoto: {
    type: String,
    default: "",
  },
  mentorSkills: {
    type: [String],
    default: [],
  },
  mentorDescription: {
    type: String,
    default: "",
  },
  mentorLinkedin: {
    type: String,
    default: "",
  },
  mentorRating: {
    type: Number,
    default: 0,
  },
  mentorPhone: {
  type: String,
  default: "",
  
  created_at: {
  type: Date,
  default: Date.now,
},
},
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
});

const User = mongoose.model("User", userSchema);

const getByEmail = async (email) => {
  return await User.findOne({ email });
};

const getUserById = async (id) => {
  return await User.findById(id);
};

const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

// Get all registered mentors
const getAllMentors = async () => {
  return await User.find({ role: "mentor" }).select(
    "username email mentorPhone mentorPhoto mentorSkills mentorDescription mentorLinkedin mentorRating"
  );
};

module.exports = {
  getByEmail,
  getUserById,
  createUser,
  getAllMentors,
};
