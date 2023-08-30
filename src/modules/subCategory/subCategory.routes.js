import express from 'express';
import * as SC from './subCategory.controller.js';
import { validation } from '../../middleware/validation.js';
import {
  addSubCategoryValidation,
  deleteSubCategoryValidation,
  updateSubCategoryValidation,
} from './subCategory.validation.js';

const subCategoryRouter = express.Router({ mergeParams: true });

subCategoryRouter
  .route('/')
  .post(validation(addSubCategoryValidation), SC.addSubCategory)
  .get(SC.getAllSubCategories);

subCategoryRouter
  .route('/:id')
  .get(SC.getSubCategory)
  .put(validation(updateSubCategoryValidation), SC.updateSubCategory)
  .delete(validation(deleteSubCategoryValidation), SC.deleteSubCategory);

export default subCategoryRouter;
