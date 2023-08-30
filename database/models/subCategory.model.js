import { Schema, Types, model } from 'mongoose';

const subCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, 'too short subCategory name'],
      lowercase: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: Types.ObjectId,
      required: true,
      ref: 'category',
    },
  },
  {
    timestamps: true,
  }
);

export const subCategoryModel = model('subCategory', subCategorySchema);
