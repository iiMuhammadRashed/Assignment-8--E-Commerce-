import { cartModel } from '../../../database/models/cart.model.js';
import { orderModel } from '../../../database/models/order.model.js';
import { productModel } from '../../../database/models/product.model.js';
import { asyncErrorHandler } from '../../middleware/handleAsyncError.js';
import { AppError } from '../../utils/AppError.js';

const createCashOrder = asyncErrorHandler(async (req, res, next) => {
  const cart = await cartModel.findOne({ user: req.user._id });
  !cart && next(new AppError(`No cart found`, 404));
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

export { createCashOrder, getLoggedUserOrders, getAllOrders };
