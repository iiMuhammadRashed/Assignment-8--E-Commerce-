import express from 'express';
import * as brandController from './brand.controller.js';
import { allowedTypes, multerCloudinary } from '../../utils/multerCloud.js';
import { validation } from '../../middleware/validation.js';
import {
  addBrandValidation,
  deleteBrandValidation,
  updateBrandValidation,
} from './brand.validation.js';
import { protectedRoutes } from '../auth/auth.controller.js';

const brandRouter = express.Router();

brandRouter
  .route('/')
  .post(
    multerCloudinary(allowedTypes.image).single('image'),
    validation(addBrandValidation),
    protectedRoutes,
    brandController.addBrand
  )
  .get(brandController.getAllBrands);
brandRouter
  .route('/:id')
  .get(brandController.getBrand)
  .put(
    multerCloudinary(allowedTypes.image).single('image'),
    validation(updateBrandValidation),
    protectedRoutes,
    brandController.updateBrand
  )
  .delete(
    validation(deleteBrandValidation),
    protectedRoutes,
    brandController.deleteBrand
  );

export default brandRouter;
