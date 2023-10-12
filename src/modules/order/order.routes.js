import express from 'express';
import * as orderController from './order.controller.js';
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js';
import { validation } from '../../middleware/validation.js';
import {
  createCashOrderValidation,
  createCheckoutSessionValidation,
} from './order.validation.js';

const orderRouter = express.Router();

orderRouter
  .route('/')
  .get(protectedRoutes, orderController.getLoggedUserOrders);
orderRouter.post(
  '/createCashOrder',
  validation(createCashOrderValidation),
  protectedRoutes,
  orderController.createCashOrder
);
orderRouter.post(
  '/checkout',
  validation(createCheckoutSessionValidation),

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
