const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Vui lòng nhập Tên"],
    maxlength: [30, "Tên không thể quá 30 ký tự"],
    minlength: [2, "Tên ít nhất 2 chữ cái"],
  },
  email: {
    type: String,
    required: [true, "Vui lòng nhập Email"],
    unique: true,
    validate: [validator.isEmail, "Vui lòng nhập Email hợp lệ"],
  },
  password: {
    type: String,
    required: [true, "Vui lòng nhập password"],
    minlength: [8, "Password phải hơn 8 ký tự"],
    select: false,
  },
  avatar: {
    public_id: { type: String, required: true },
    url: { type: String, required: true },
  },
  role: {
    type: String,
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Json Web Token
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Compare Password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and add resetPasswordToken to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
