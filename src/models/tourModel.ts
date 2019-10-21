import mongoose, { Document } from "mongoose";
import { NextFunction } from "express";
import slugify from "slugify";

interface TourDoc extends Document {
  slug: string;
  name: string;
  duration: number;
}

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A tour must specify a duration"]
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must specify a group size"]
    },
    difficulty: {
      type: String,
      required: [true, "A tour must specify a difficulty level"]
    },
    ratingsAverage: {
      type: Number,
      default: 4.5
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"]
    },
    discountPrice: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a summary"]
    },
    description: {
      type: String,
      trim: true,
      required: [true, "A tour must have a description"]
    },
    imageCover: {
      type: String, // name of image
      required: [true, "A tour must have a cover image"]
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date]
  },
  { toJSON: { virtuals: true } }
);

// Virtual Properties
// NOT part of DB: only showed in Model (business logic) and NOT Controller (application logic)
tourSchema.virtual("durationWeeks").get(function(this: TourDoc) {
  return this.duration / 7;
});

// Mongoose Middlewares: Document
// pre save hook: runs before .save() and .create()
tourSchema.pre("save", function(this: TourDoc, next: NextFunction) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
// tourSchema.pre("save", function(next) {
//   console.log("💾 Saving document...");
//   next();
// });
// // post save hook
// tourSchema.post("save", function(doc, next) {
//   console.log(doc);
//   next();
// });

const Tour = mongoose.model("Tour", tourSchema);

export default Tour;
