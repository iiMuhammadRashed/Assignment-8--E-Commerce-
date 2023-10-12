import express from 'express';
import * as SC from './subCategory.controller.js';
import { validation } from '../../middleware/validation.js';
import {
  addSubCategoryValidation,
  deleteSubCategoryValidation,
  updateSubCategoryValidation,
} from './subCategory.validation.js';
import { protectedRoutes } from '../auth/auth.controller.js';

const subCategoryRouter = express.Router({ mergeParams: true });

subCategoryRouter
  .route('/')
  .post(
    validation(addSubCategoryValidation),
    protectedRoutes,
    SC.addSubCategory
  )
  .get(SC.getAllSubCategories);

subCategoryRouter
  .route('/:id')
  .get(protectedRoutes, SC.getSubCategory)
  .put(
    validation(updateSubCategoryValidation),
    protectedRoutes,
    SC.updateSubCategory
  )
  .delete(
    validation(deleteSubCategoryValidation),
    protectedRoutes,
    SC.deleteSubCategory
  );

export default subCategoryRouter;
