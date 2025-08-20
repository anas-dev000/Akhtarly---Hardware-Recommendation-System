const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { rule } = require("../Utils/rules.js");
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: [true, "this email is used"],
    required: true,
    lowercase: true,
    validate: [validator.isEmail, "not valid email"],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false, // don't show this in the response
  },
  rule: {
    type: String,
    enum: {
      values: [rule.ADMIN, rule.USER, rule.OWNER],
    },
    required: true,
  },
  passwordResetToken: String,             // Added for password reset
  passwordResetTokenExpires: Date,        // Added for password reset
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (inputPass, dbPassword) {
  return await bcrypt.compare(inputPass, dbPassword);
};

userSchema.methods.createResetPassword = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;

  console.log(`Password after encryption: ${resetToken}, Password before encryption: ${this.passwordResetToken}`);

  return resetToken;
};

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
