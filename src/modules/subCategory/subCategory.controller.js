import { subCategoryModel } from '../../../database/models/subCategory.model.js';
import { categoryModel } from '../../../database/models/category.model.js';
import { asyncErrorHandler } from '../../middleware/handleAsyncError.js';
import slugify from 'slugify';
import { AppError } from '../../utils/AppError.js';
import { ApiFeatures } from '../../utils/ApiFeatures.js';

const addSubCategory = asyncErrorHandler(async (req, res, next) => {
  let isCategoryExist = await categoryModel.findById(req.body.category);
  if (!isCategoryExist) return next(new AppError(`Invalid category`, 404));
  let isNameExist = await subCategoryModel.findOne({ name: req.body.name });
  if (isNameExist)
    return next(new AppError(`The SubCategory name is already is use`, 409));
  req.body.slug = slugify(req.body.name);
  let SubCategory = new subCategoryModel(req.body);
  await SubCategory.save();
  res.status(201).json({ message: 'success', SubCategory });
});

const getAllSubCategories = asyncErrorHandler(async (req, res, next) => {
  let filterObj = {};
  if (req.params.categoryId) {
    filterObj = { category: req.params.categoryId };
  }
  let apiFeatures = new ApiFeatures(subCategoryModel.find(filterObj), req.query)
    .paginate()
    .filter()
    .sort()
    .search()
    .fields();
  let SubCategories = await apiFeatures.mongooseQuery;
  if (!SubCategories.length)
    return next(new AppError(`No SubCategories found`, 404));
  SubCategories &&
    res.status(200).json({
      message: 'success',
      CurrentPage: apiFeatures.PAGE,
      SubCategories,
    });
});

const getSubCategory = asyncErrorHandler(async (req, res, next) => {
  let { id } = req.params;
  let SubCategory = await subCategoryModel.findById(id);
  if (!SubCategory) return next(new AppError(`No SubCategory found`, 404));
  SubCategory && res.status(200).json({ message: 'success', SubCategory });
});

const updateSubCategory = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.category) {
    let isCategoryExist = await categoryModel.findById(req.body.category);
    if (!isCategoryExist) return next(new AppError(`Invalid Category`, 404));
  }
  if (req.body.name) {
    let isNameExist = await subCategoryModel.findOne({ name: req.body.name });
    if (isNameExist)
      return next(new AppError(`The SubCategory name is already is use`, 409));
    req.body.name = slugify(req.body.name);
  }
  let SubCategory = await subCategoryModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!SubCategory) return next(new AppError(`No SubCategory found`, 404));
  SubCategory && res.status(200).json({ message: 'success', SubCategory });
});

const deleteSubCategory = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  let SubCategory = await subCategoryModel.findByIdAndDelete(id);
  if (!SubCategory) return next(new AppError(`No SubCategory found`, 404));
  SubCategory && res.status(200).json({ message: 'success', SubCategory });
});

export {
  addSubCategory,
  getAllSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
};
