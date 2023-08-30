import { categoryModel } from '../../../database/models/category.model.js';
import { asyncErrorHandler } from '../../middleware/handleAsyncError.js';
import slugify from 'slugify';
import { AppError } from '../../utils/AppError.js';
import cloudinary from '../../utils/cloudinary.js';
import { v4 as uuidv4 } from 'uuid';
import { ApiFeatures } from '../../utils/ApiFeatures.js';

const addCategory = asyncErrorHandler(async (req, res, next) => {
  let isExist = await categoryModel.findOne({ name: req.body.name });
  if (isExist)
    return next(new AppError(`The Category name is already is use`, 409));
  if (!req.file)
    return next(new AppError(`The Category image is required`, 400));
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `E-Commerce Application/categories/`,
      public_id: uuidv4(),
    },
    (err, res) => {
      if (err) return next(new AppError(err, 400));
    }
  );
  req.body.image = { secure_url, public_id };
  req.body.slug = slugify(req.body.name);
  let Category = new categoryModel(req.body);
  await Category.save();
  if (!Category) await cloudinary.uploader.destroy(public_id);
  res.status(201).json({ message: 'success', Category });
});

const getAllCategories = asyncErrorHandler(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(categoryModel.find(), req.query)
    .paginate()
    .filter()
    .sort()
    .search()
    .fields();
  let Categories = await apiFeatures.mongooseQuery;
  if (!Categories.length) return next(new AppError(`No Categories found`, 404));
  Categories &&
    res
      .status(200)
      .json({ message: 'success', CurrentPage: apiFeatures.PAGE, Categories });
});

const getCategory = asyncErrorHandler(async (req, res, next) => {
  let { id } = req.params;
  let Category = await categoryModel.findById(id);
  if (!Category) return next(new AppError(`No Category found`, 404));
  Category && res.status(200).json({ message: 'success', Category });
});

const updateCategory = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  let Category = await categoryModel.findById(id);
  if (!Category) return next(new AppError(`No Category found`, 404));
  if (req.body.name) {
    if (Category.name == req.body.name.toLowerCase())
      return next(new AppError(`New name match old name`, 400));
    if (await categoryModel.findOne({ name: req.body.name.toLowerCase() }))
      return next(new AppError(`Name is already exist`, 400));
    req.body.slug = slugify(req.body.name);
  }
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `E-Commerce Application/categories/`,
        public_id: uuidv4(),
      },
      async (err, res) => {
        if (err) return next(new AppError(err, 400));
      }
    );
    if (Category.image)
      await cloudinary.uploader.destroy(Category.image.public_id);
    req.body.image = { secure_url, public_id };
  }
  let updatedCategory = await categoryModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  updatedCategory &&
    res.status(200).json({ message: 'success', Category: updatedCategory });
});

const deleteCategory = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  let Category = await categoryModel.findByIdAndDelete(id);
  if (!Category) return next(new AppError(`No Category found`, 404));
  if (Category.image)
    await cloudinary.uploader.destroy(Category.image.public_id);
  Category && res.status(200).json({ message: 'success', Category });
});

export {
  addCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
