import express from 'express';
import * as cartController from './cart.controller.js';
import { protectedRoutes } from '../auth/auth.controller.js';
import { validation } from '../../middleware/validation.js';
import {
  addItemToCartValidation,
  applyCouponValidation,
  removeItemFromCartValidation,
  updateQuantityValidation,
} from './cart.validation.js';

const cartRouter = express.Router();

cartRouter
  .route('/')
  .post(
    protectedRoutes,
    validation(addItemToCartValidation),
    cartController.addItemToCart
  )
  .get(protectedRoutes, cartController.getLoggedUserCart);
cartRouter
  .route('/:id')
  .delete(
    protectedRoutes,
    validation(removeItemFromCartValidation),
    cartController.removeItemFromCart
  );
cartRouter.patch(
  '/applyCoupon',
  validation(applyCouponValidation),
  protectedRoutes,
  cartController.applyCoupon
);
cartRouter.patch(
  '/updateQuantity/:id',
  validation(updateQuantityValidation),
  protectedRoutes,
  cartController.updateQuantity
);

export default cartRouter;
