import { Schema, Types, model } from 'mongoose';

const reviewSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
      minlength: [8, 'too short review'],
    },
    product: {
      type: Types.ObjectId,
      ref: 'product',
      required: true,
    },
    user: {
      type: Types.ObjectId,
      ref: 'user',
      required: true,
    },
    rating: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.pre(/^find/, function () {
  this.populate('user', 'username');
});

export const reviewModel = model('review', reviewSchema);
