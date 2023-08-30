import express from 'express';
import * as BC from './brand.controller.js';
import { allowedTypes, multerCloudinary } from '../../utils/multerCloud.js';
import { validation } from '../../middleware/validation.js';
import {
  addBrandValidation,
  updateBrandValidation,
} from './brand.validation.js';

const brandRouter = express.Router();

brandRouter
  .route('/')
  .post(
    multerCloudinary(allowedTypes.image).single('image'),
    validation(addBrandValidation),
    BC.addBrand
  )
  .get(BC.getAllBrands);
brandRouter
  .route('/:id')
  .get(BC.getBrand)
  .put(
    multerCloudinary(allowedTypes.image).single('image'),
    validation(updateBrandValidation),
    BC.updateBrand
  )
  .delete(BC.deleteBrand);

export default brandRouter;
