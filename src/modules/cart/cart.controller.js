import { cartModel } from '../../../database/models/cart.model.js';
import { couponModel } from '../../../database/models/coupon.model.js';
import { productModel } from '../../../database/models/product.model.js';
import { asyncErrorHandler } from '../../middleware/handleAsyncError.js';
import { AppError } from '../../utils/AppError.js';

function calcPrice(cart) {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  cart.totalPrice = totalPrice;

  if (cart.discountType == 'fixed') {
    console.log(cart.discountType);
    cart.totalPriceAfterDiscount = cart.totalPrice - cart.discount;
  }
  if (cart.discountType == 'percent') {
    cart.totalPriceAfterDiscount =
      cart.totalPrice - (cart.totalPrice * cart.discount) / 100;
  }
}

const addItemToCart = asyncErrorHandler(async (req, res, next) => {
  let product = await productModel.findById(req.body.product).select('price');
  !product && next(new AppError(`product not found`, 404));
  req.body.price = product.price;
  let isCartExist = await cartModel.findOne({ user: req.user._id });
  if (!isCartExist) {
    let cart = new cartModel({
      user: req.user._id,
      cartItems: [req.body],
    });
    calcPrice(cart);
    await cart.save();
    return res.status(201).json({ message: 'success', cart });
  }
  let item = isCartExist.cartItems.find(
    (item) => item.product == req.body.product
  );
  if (item) {
    item.quantity++;
  } else {
    isCartExist.cartItems.push(req.body);
  }
  calcPrice(isCartExist);
  await isCartExist.save();
  return res.status(201).json({ message: 'success', isCartExist });
});

const getLoggedUserCart = asyncErrorHandler(async (req, res, next) => {
  let cart = await cartModel
    .findOne({ user: req.user._id })
    .populate('cartItems.product');
  if (!cart) return next(new AppError(`No cart found`, 404));
  cart && res.status(200).json({ message: 'success', cart });
});

const removeItemFromCart = asyncErrorHandler(async (req, res, next) => {
  let cart = await cartModel.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { cartItems: { product: req.params.id } } },
    { new: true }
  );
  !cart && next(new AppError(`No item found`, 404));
  calcPrice(cart);
  await cart.save();
  cart && res.status(200).json({ message: 'success', cart });
});

const applyCoupon = asyncErrorHandler(async (req, res, next) => {
  let coupon = await couponModel.findOne({
    code: req.body.code,
    expires: { $gt: Date.now() },
  });
  if (!coupon) return next(new AppError(`No coupon found`, 404));
  let cart = await cartModel.findOne({ user: req.user._id });
  if (coupon.type == 'fixed') {
    cart.totalPriceAfterDiscount = cart.totalPrice - coupon.discount;
  }
  if (coupon.type == 'percent') {
    cart.totalPriceAfterDiscount =
      cart.totalPrice - (cart.totalPrice * coupon.discount) / 100;
  }
  cart.discountType = coupon.type;
  cart.discount = coupon.discount;
  await cart.save();
  res.status(200).json({ message: 'success', cart });
});

const updateQuantity = asyncErrorHandler(async (req, res, next) => {
  let product = await productModel.findById(req.params.id).select('price');
  !product && next(new AppError(`product not found`, 404));
  req.body.price = product.price;
  let cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) return next(new AppError(`No cart found`, 404));
  let item = cart.cartItems.find((item) => item.product == req.params.id);
  if (item) {
    item.quantity = req.body.quantity;
  } else {
    return next(new AppError(`item not found`, 404));
  }
  calcPrice(cart);
  await cart.save();
  return res.status(201).json({ message: 'success', cart });
});

export {
  addItemToCart,
  getLoggedUserCart,
  removeItemFromCart,
  applyCoupon,
  updateQuantity,
};
