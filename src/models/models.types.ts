import { Document } from "mongoose";

export interface TourDoc extends Document {
  slug: string;
  name: string;
  price: number;
  duration: number;
  start: number;
  guides: any;
}

export interface UserDoc extends Document {
  password?: string;
  passwordConfirm?: string;
  passwordResetToken?: string;
  passwordResetExpires?: number;
  /****** instance methods ******/
  correctPassword?: any;
  changedPasswordAfter?: any;
  passwordChangedAt?: any;
  createPasswordResetToken?: any;
  /***^^^ instance methods ^^^***/
}
export interface DecodedToken extends UserDoc {
  id: string;
  iat: number;
  exp: number;
}

export interface ReviewDoc extends Document {}
