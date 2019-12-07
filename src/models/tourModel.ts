import mongoose, { Document } from "mongoose";
import { NextFunction } from "express";
import slugify from "slugify";
import validator from "validator";
import { TourDoc } from "./models.types";
// import User from "./userModel";

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
      maxlength: [40, "A tour name must not exceed 40 characters"],
      minlength: [10, "A tour name must have at least 10 characters"]
      // validate: [
      //   validator.isAlpha,
      //   "Tour name must not contain special characters"
      // ]
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
      required: [true, "A tour must specify a difficulty level"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is either easy, medium or difficult"
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be higher than 1.0"],
      max: [5, "Rating must be lower than 5.0"]
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"]
    },
    discountPrice: {
      type: Number,
      validate: {
        validator: function(this: TourDoc, val: number): boolean {
          // only work on creating new, NOT on updates
          return val < this.price;
        },
        // @ts-ignore
        message: "Discount price ({VALUE}) must be lower than regular price"
      }
    },
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
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: "Point",
        enum: ["Point"]
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"]
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual Properties
// NOT part of DB: only showed in Model (business logic) and NOT Controller (application logic)
tourSchema.virtual("durationWeeks").get(function(this: TourDoc) {
  return this.duration / 7;
});

tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "forTour",
  localField: "_id"
});

// Mongoose Middlewares: Document
// pre save hook: runs before .save() and .create()
tourSchema.pre("save", function(this: TourDoc, next: NextFunction): void {
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

// // Embedding
// tourSchema.pre("save", async function(this: TourDoc, next: NextFunction) {
//   this.guides = await Promise.all(
//     this.guides.map(async (id: string) => await User.findById(id))
//   );
// });

// Child referencing
tourSchema.pre(/^find/, function(this: TourDoc, next: NextFunction) {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt"
  });
  next();
});

// Mongoose Middlewares: Query
tourSchema.pre(/^find/, function(this: TourDoc, next: NextFunction): void {
  // @ts-ignore
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function(
  this: TourDoc,
  docs: TourDoc,
  next: NextFunction
): void {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

// Mongoose Middlewares: Aggregation
tourSchema.pre("aggregate", function(this: TourDoc, next: NextFunction) {
  // @ts-ignore
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model("Tour", tourSchema);

export default Tour;
