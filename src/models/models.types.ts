import { Document } from "mongoose";

export interface TourDoc extends Document {
  slug: string;
  name: string;
  price: number;
  duration: number;
  start: number;
}

export interface UserDoc extends Document {
  password?: string;
  passwordConfirm?: string;
  correctPassword?: any; // instance method
  changedPasswordAfter?: any; // instance method
  passwordChangedAt?: any;
}
export interface DecodedToken extends UserDoc {
  id: string;
  iat: number;
  exp: number;
}
