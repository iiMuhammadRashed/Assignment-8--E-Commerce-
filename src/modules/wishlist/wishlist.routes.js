import express from 'express';
import * as wishListController from './wishlist.controller.js';
import { validation } from '../../middleware/validation.js';
import {
  addWishlistValidation,
  deleteWishlistValidation,
} from './wishlist.validation.js';
import { protectedRoutes } from '../auth/auth.controller.js';

const wishlistRouter = express.Router();

wishlistRouter
  .route('/')
  .patch(
    protectedRoutes,
    validation(addWishlistValidation),
    wishListController.addWishlist
  )
  .get(
    protectedRoutes,
    wishListController.getAllUserWishlist
  );
wishlistRouter
  .route('/:product')
  .delete(
    protectedRoutes,
    validation(deleteWishlistValidation),
    wishListController.deleteWishlist
  );

export default wishlistRouter;
