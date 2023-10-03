import { Schema, Types, model } from 'mongoose';

const orderSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'user' },
    cartItems: [
      {
        product: { type: Types.ObjectId, ref: 'product' },
        quantity: { type: Number, min: 1 },
        price: Number,
      },
    ],
    totalOrderPrice: Number,
    shippingAddress: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'cash'],
      default: 'cash',
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const orderModel = model('order', orderSchema);
