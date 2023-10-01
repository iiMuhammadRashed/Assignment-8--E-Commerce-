import express from 'express';
import * as cartController from './cart.controller.js';
import { protectedRoutes } from '../auth/auth.controller.js';

const cartRouter = express.Router();

cartRouter
  .route('/')
  .post(protectedRoutes, cartController.addItemToCart)
  .get(protectedRoutes, cartController.getLoggedUserCart);
cartRouter
  .route('/:id')
  .delete(protectedRoutes, cartController.removeItemFromCart);
cartRouter.patch('/applyCoupon', protectedRoutes, cartController.applyCoupon);
cartRouter.patch(
  '/updateQuantity/:id',
  protectedRoutes,
  cartController.updateQuantity
);

export default cartRouter;
