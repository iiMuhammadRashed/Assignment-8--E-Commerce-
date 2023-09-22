import express from 'express';
import * as SC from './coupon.controller.js';
import { validation } from '../../middleware/validation.js';
import {
  addCouponValidation,
  updateCouponValidation,
  deleteCouponValidation,
} from './coupon.validation.js';

const couponRouter = express.Router({ mergeParams: true });

couponRouter
  .route('/')
  .post(validation(addCouponValidation), SC.addCoupon)
  .get(SC.getAllCoupons);

couponRouter
  .route('/:id')
  .get(SC.getCoupon)
  .put(validation(updateCouponValidation), SC.updateCoupon)
  .delete(validation(deleteCouponValidation), SC.deleteCoupon);

export default couponRouter;
