import express from 'express';
import * as brandController from './brand.controller.js';
import { allowedTypes, multerCloudinary } from '../../utils/multerCloud.js';
import { validation } from '../../middleware/validation.js';
import {
  addBrandValidation,
  deleteBrandValidation,
  updateBrandValidation,
} from './brand.validation.js';

const brandRouter = express.Router();

brandRouter
  .route('/')
  .post(
    multerCloudinary(allowedTypes.image).single('image'),
    validation(addBrandValidation),
    brandController.addBrand
  )
  .get(brandController.getAllBrands);
brandRouter
  .route('/:id')
  .get(brandController.getBrand)
  .put(
    multerCloudinary(allowedTypes.image).single('image'),
    validation(updateBrandValidation),
    brandController.updateBrand
  )
  .delete(validation(deleteBrandValidation), brandController.deleteBrand);

export default brandRouter;
