import express from 'express';
import * as CC from './category.controller.js';
import subCategoryRouter from '../subCategory/subCategory.routes.js';
import { validation } from '../../middleware/validation.js';
import {
  addCategoryValidation,
  deleteCategoryValidation,
  updateCategoryValidation,
} from './category.validation.js';
import { allowedTypes, multerCloudinary } from '../../utils/multerCloud.js';
import { protectedRoutes } from '../auth/auth.controller.js';

const categoryRouter = express.Router();

categoryRouter.use('/:categoryId/subCategories', subCategoryRouter);
categoryRouter
  .route('/')
  .post(
    multerCloudinary(allowedTypes.image).single('image'),
    validation(addCategoryValidation),
    protectedRoutes,
    CC.addCategory
  )
  .get(protectedRoutes, CC.getAllCategories);
categoryRouter
  .route('/:id')
  .get(protectedRoutes, CC.getCategory)
  .put(
    multerCloudinary(allowedTypes.image).single('image'),
    validation(updateCategoryValidation),
    protectedRoutes,
    CC.updateCategory
  )
  .delete(
    validation(deleteCategoryValidation),
    protectedRoutes,
    CC.deleteCategory
  );

export default categoryRouter;
