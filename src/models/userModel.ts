import mongoose from "mongoose";
import { NextFunction } from "express";
import validator from "validator";
import bcrypt from "bcryptjs";
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
  password: {
    type: String,
    required: [true, "A user must have a password"],
    minlength: [8, "Password must have at least 8 characters"],
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your passwor"],
    validate: {
      validator: function(this: UserDoc, val: string): boolean {
        return val === this.password;
      },
      // @ts-ignore
      message: `Passwords don't match`
    }
  },
  passwordChangedAt: Date
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

// instance method
// candidatePassword: original password, not hashed
// userPassword: hashed
userSchema.methods.correctPassword = async function(
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// @ts-ignore
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const passwordChangedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return passwordChangedTimestamp > JWTTimestamp;
  }

  // if password has not been changed
  return false;
};

const User = mongoose.model("User", userSchema);

export default User;
