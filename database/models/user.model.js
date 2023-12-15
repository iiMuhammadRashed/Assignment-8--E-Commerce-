import { Schema, Types, model } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    passwordChangedAt: Date,
    age: {
      type: Number,
      min: 16,
      max: 100,
      required: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'not specific'],
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    verified: {
      type: Boolean,
      default: false,
    },
    blocked: {
      type: Boolean,
      default: false,
    },
    forgetPasswordCode: {
      type: String,
    },
    wishlist: [{ type: Types.ObjectId, ref: 'product' }],
    addresses: [
      {
        city: String,
        street: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', function () {
  if (this.password) {
    this.password = bcrypt.hashSync(this.password, +process.env.SALT_ROUNDS);
  }
});

userSchema.pre('findOneAndUpdate', function () {
  if (this._update.password)
    this._update.password = bcrypt.hashSync(
      this._update.password,
      +process.env.SALT_ROUNDS
    );
});

export const userModel = model('user', userSchema);
