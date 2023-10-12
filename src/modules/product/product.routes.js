import express from 'express';
import * as PC from './product.controller.js';
import { allowedTypes, multerCloudinary } from '../../utils/multerCloud.js';
import { validation } from '../../middleware/validation.js';
import {
  addProductValidation,
  deleteProductValidation,
  updateProductValidation,
} from './product.validation.js';
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js';

const productRouter = express.Router();
productRouter
  .route('/')
  .post(
    protectedRoutes,
    multerCloudinary(allowedTypes.image).fields([
      { name: 'cover', maxCount: 1 },
      { name: 'images', maxCount: 5 },
    ]),
    validation(addProductValidation),
    PC.addProduct
  )
  .get(protectedRoutes, allowedTo('admin'), PC.getAllProducts);
productRouter
  .route('/:id')
  .get(PC.getProduct)
  .put(
    multerCloudinary(allowedTypes.image).fields([
      { name: 'cover', maxCount: 1 },
      { name: 'image', maxCount: 1 },
    ]),
    validation(updateProductValidation),
    protectedRoutes,
    PC.updateProduct
  )
  .delete(
    validation(deleteProductValidation),
    protectedRoutes,
    PC.deleteProduct
  );

export default productRouter;
