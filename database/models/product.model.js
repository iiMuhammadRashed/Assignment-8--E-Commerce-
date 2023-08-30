import { Schema, Types, model } from 'mongoose';

const productSchema = new Schema(
  {
    title: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      minlength: [5, 'too short product name'],
      lowercase: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
      required: [true, 'product price is required'],
    },
    priceAfterDiscount: {
      type: Number,
      default: 0,
      min: 0,
    },
    description: {
      type: String,
      maxlength: [300, 'too long description'],
      minlength: [10, 'too short description'],
      required: [true, 'product description is required'],
      trim: true,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    sold: {
      type: Number,
      default: 0,
      min: 0,
    },
    coverImage: {
      type: Object,
    },
    images: {
      type: [Object],
    },
    category: {
      type: Types.ObjectId,
      ref: 'category',
      required: [true, 'product category is required'],
    },
    subCategory: {
      type: Types.ObjectId,
      ref: 'subCategory',
      required: [true, 'product subCategory is required'],
    },
    brand: {
      type: Types.ObjectId,
      ref: 'brand',
      required: [true, 'product brand is required'],
    },
    ratingAvg: {
      type: Number,
      min: 1,
      max: 5,
    },
    ratingCount: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const productModel = model('product', productSchema);
