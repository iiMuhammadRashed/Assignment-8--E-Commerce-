import { Schema, Types, model } from 'mongoose';

const brandSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      minlength: [2, 'too short brand name'],
      lowercase: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    logo: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const brandModel = model('brand', brandSchema);
