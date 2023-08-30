import { Schema, Types, model } from "mongoose";

const reviewSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
      minlength: [10, "too short review"],
    },
    product: {
      type: Types.ObjectId,
      ref: "product",
    },
    user: {
      type: Types.ObjectId,
      ref: "user",
    },
    rating: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
    },
  },
  {
    timestamps: true,
  }
);

export const reviewModel = model("review", reviewSchema);
