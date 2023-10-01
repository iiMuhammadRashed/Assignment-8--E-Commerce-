import { Schema, Types, model } from 'mongoose';

const cartSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'user' },
    cartItems: [
      {
        product: { type: Types.ObjectId, ref: 'product' },
        quantity: { type: Number, min: 1, default: 1 },
        price: Number,
      },
    ],
    totalPrice: Number,
    discountType: {
      type: String,
      enum: ['fixed', 'percent'],
    },
    discount: Number,
    totalPriceAfterDiscount: Number,
  },
  {
    timestamps: true,
  }
);

export const cartModel = model('cart', cartSchema);
