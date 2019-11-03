import mongoose from "mongoose";
import { NextFunction } from "express";
import validator from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { UserDoc } from "./models.types";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name"]
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email address"]
  },
  photo: String,
  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user"
  },
  password: {
    type: String,
    required: [true, "A user must have a password"],
    minlength: [8, "Password must have at least 8 characters"],
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function(this: UserDoc, val: string): boolean {
        return val === this.password;
      },
      // @ts-ignore
      message: `Passwords don't match`
    }
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date
});

userSchema.pre("save", async function(this: UserDoc, next: NextFunction) {
  // only run this if password was actually modified
  if (!this.isModified("password")) return next();

  // hash password, cost = 12
  this.password = await bcrypt.hash(this.password, 12);

  // delete passwordConfirm field before data is persisted in DB
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function(this: UserDoc, next: NextFunction) {
  if (!this.isModified("password") || this.isNew) return next();
  // make sure password is always created after token has been sent (by - 1000 in timestamp)
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// instance method
// candidatePassword: original password, not hashed
// userPassword: hashed
userSchema.methods.correctPassword = async function(
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(
  this: UserDoc,
  JWTTimestamp: number
) {
  if (this.passwordChangedAt) {
    const passwordChangedTimestamp = parseInt(
      // @ts-ignore
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return passwordChangedTimestamp > JWTTimestamp;
  }

  // if password has not been changed
  return false;
};

userSchema.methods.createPasswordResetToken = function(this: UserDoc) {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model("User", userSchema);

export default User;
