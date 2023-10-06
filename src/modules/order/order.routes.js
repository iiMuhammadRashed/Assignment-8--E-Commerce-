import express from 'express';
import * as orderController from './order.controller.js';
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js';

const orderRouter = express.Router();

orderRouter
  .route('/')
  .get(protectedRoutes, orderController.getLoggedUserOrders);
orderRouter.post(
  '/createCashOrder',
  protectedRoutes,
  orderController.createCashOrder
);
orderRouter.post(
  '/checkout',
  protectedRoutes,
  orderController.createCheckoutSession
);
orderRouter.get(
  'getAllOrders',
  protectedRoutes,
  allowedTo('admin'),
  orderController.getAllOrders
);

export default orderRouter;
