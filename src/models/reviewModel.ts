import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, "A review must have content"],
    trim: true,
    maxlength: [1000, "A review must not exceed 1000 characters"],
    minlength: [10, "A review must have at least 10 characters"]
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  forTour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tour",
    required: [true, "A review must belong to a tour"]
  },
  writtenBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "A review must belong to a user"]
  }
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;
