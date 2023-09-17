import express from 'express';
import * as reviewController from './review.controller.js';
import { validation } from '../../middleware/validation.js';
import {
  addReviewValidation,
  deleteReviewValidation,
  updateReviewValidation,
} from './review.validation.js';
import { protectedRoutes } from '../auth/auth.controller.js';

const reviewRouter = express.Router();

reviewRouter
  .route('/')
  .post(
    protectedRoutes,
    validation(addReviewValidation),
    reviewController.addReview
  )
  .get(reviewController.getAllReviews);
reviewRouter
  .route('/:id')
  .get(reviewController.getReview)
  .put(
    protectedRoutes,
    validation(updateReviewValidation),
    reviewController.updateReview
  )
  .delete(
    protectedRoutes,
    validation(deleteReviewValidation),
    reviewController.deleteReview
  );

export default reviewRouter;
