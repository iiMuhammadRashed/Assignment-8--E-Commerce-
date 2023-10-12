import express from 'express';
import * as SC from './coupon.controller.js';
import { validation } from '../../middleware/validation.js';
import {
  addCouponValidation,
  updateCouponValidation,
  deleteCouponValidation,
} from './coupon.validation.js';
import { protectedRoutes } from '../auth/auth.controller.js';

const couponRouter = express.Router({ mergeParams: true });

couponRouter
  .route('/')
  .post(validation(addCouponValidation), protectedRoutes, SC.addCoupon)
  .get(protectedRoutes, SC.getAllCoupons);

couponRouter
  .route('/:id')
  .get(protectedRoutes, SC.getCoupon)
  .put(validation(updateCouponValidation), protectedRoutes, SC.updateCoupon)
  .delete(validation(deleteCouponValidation), protectedRoutes, SC.deleteCoupon);

export default couponRouter;
