import express from 'express';
import * as orderController from './order.controller.js';
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js';

const orderRouter = express.Router();

orderRouter
  .route('/')
  .post(protectedRoutes, orderController.createCashOrder)
  .get(protectedRoutes, orderController.getLoggedUserOrders);
orderRouter.get(
  'getAllOrders',
  protectedRoutes,
  allowedTo('admin'),
  orderController.getAllOrders
);

export default orderRouter;
