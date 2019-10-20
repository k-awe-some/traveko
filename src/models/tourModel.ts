import mongoose from "mongoose";

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true
    },
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
tourSchema.virtual("durationWeeks").get(function() {
  return this.duration / 7;
});

const Tour = mongoose.model("Tour", tourSchema);

export default Tour;
