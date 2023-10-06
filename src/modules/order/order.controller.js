import { cartModel } from '../../../database/models/cart.model.js';
import { orderModel } from '../../../database/models/order.model.js';
import { productModel } from '../../../database/models/product.model.js';
import { asyncErrorHandler } from '../../middleware/handleAsyncError.js';
import { AppError } from '../../utils/AppError.js';
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const getLoggedUserOrders = asyncErrorHandler(async (req, res, next) => {
  const orders = await orderModel
    .find({ user: req.user._id })
    .populate('cartItems.product');
  orders.length === 0 && next(new AppError(`No orders found`, 404));
  orders.length !== 0 && res.status(200).json({ message: 'success', orders });
});

const getAllOrders = asyncErrorHandler(async (req, res, next) => {
  const orders = await orderModel.find().populate('cartItems.product');
  orders.length === 0 && next(new AppError(`No orders found`, 404));
  orders.length !== 0 && res.status(200).json({ message: 'success', orders });
});

const createCashOrder = asyncErrorHandler(async (req, res, next) => {
  const cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) return next(new AppError(`No cart found`, 404));
  const totalOrderPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalPrice;
  const order = new orderModel({
    user: req.user._id,
    cartItems: cart.cartItems,
    totalOrderPrice,
    shippingAddress: req.body.shippingAddress,
    paymentMethod: 'cash',
  });
  await order.save();
  if (order) {
    let options = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { stock: -item.quantity, sold: +item.quantity } },
      },
    }));
    await productModel.bulkWrite(options);
    await cartModel.findByIdAndDelete(cart._id);
    return res.status(201).json({ message: 'success', order });
  } else {
    return next(new AppError(`error in creating order`, 404));
  }
});

const createCheckoutSession = asyncErrorHandler(async (req, res, next) => {
  const cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) return next(new AppError(`No cart found`, 404));
  const totalOrderPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalPrice;
  let session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'egp',
          unit_amount: totalOrderPrice * 100,
          product_data: {
            name: req.user.username,
          },
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    customer_email: req.user.email,
    client_reference_id: cart._id,
    metadata: req.body.shippingAddress,
    success_url: 'https://www.google.com/',
    cancel_url: 'https://www.google.com/',
  });
  return res.status(201).json({ message: 'success', session });
});

const createOnlineOrder = asyncErrorHandler(async (req, res, next) => {
  const sig = req.headers['stripe-signature'].toString();
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    next(new AppError(`Webhook Error:${err.message}`, 404));
    return;
  }
  if (event.type == 'checkout.session.completed') {
    const checkoutSessionCompleted = event.data.object;
    const cart = await cartModel.findById(
      checkoutSessionCompleted.client_reference_id
    );
    if (!cart) return next(new AppError(`No cart found`, 404));
    const totalOrderPrice = cart.totalPriceAfterDiscount
      ? cart.totalPriceAfterDiscount
      : cart.totalPrice;
    let user = userModel.findOne({
      email: checkoutSessionCompleted.customer_email,
    });
    const order = new orderModel({
      user: user._id,
      cartItems: cart.cartItems,
      totalOrderPrice,
      shippingAddress: checkoutSessionCompleted.metadata.shippingAddress,
      paymentMethod: 'card',
      isPaid: true,
      paidAt: Date.now(),
    });
    await order.save();

    if (order) {
      let options = cart.cartItems.map((item) => ({
        updateOne: {
          filter: { _id: item.product },
          update: { $inc: { stock: -item.quantity, sold: +item.quantity } },
        },
      }));
      await productModel.bulkWrite(options);
      await cartModel.findByIdAndDelete(cart._id);
      return res.status(201).json({ message: 'success', order });
    } else {
      return next(new AppError(`error in creating order`, 404));
    }
  } else {
    console.log(`Unhandled event type ${event.type}`);
  }
});

export {
  getLoggedUserOrders,
  getAllOrders,
  createCashOrder,
  createCheckoutSession,
  createOnlineOrder,
};
