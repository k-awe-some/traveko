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
    minlength: [8, "Password must have at least 8 characters"]
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
  }
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

const User = mongoose.model("User", userSchema);

export default User;
