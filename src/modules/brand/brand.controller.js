import { brandModel } from '../../../database/models/brand.model.js';
import { asyncErrorHandler } from '../../middleware/handleAsyncError.js';
import slugify from 'slugify';
import { AppError } from '../../utils/AppError.js';
import cloudinary from '../../utils/cloudinary.js';
import { v4 as uuidv4 } from 'uuid';

const addBrand = asyncErrorHandler(async (req, res, next) => {
  let isExist = await brandModel.findOne({ name: req.body.name });
  if (isExist)
    return next(new AppError(`The Brand name is already is use`, 409));
  if (!req.file) return next(new AppError(`The Brand logo is required`, 400));
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `E-Commerce Application/brands/`,
      public_id: uuidv4(),
    },
    (err, res) => {
      if (err) return next(new AppError(err, 400));
    }
  );
  req.body.logo = { secure_url, public_id };
  req.body.slug = slugify(req.body.name);
  let Brand = new brandModel(req.body);
  await Brand.save();
  res.status(201).json({ message: 'success', Brand });
});

const getAllBrands = asyncErrorHandler(async (req, res, next) => {
  let Brands = await brandModel.find();
  if (!Brands.length) return next(new AppError(`No Brands found`, 404));
  Brands && res.status(200).json({ message: 'success', Brands });
});

const getBrand = asyncErrorHandler(async (req, res, next) => {
  let { id } = req.params;
  let Brand = await brandModel.findById(id);
  if (!Brand) return next(new AppError(`No Brand found`, 404));
  Brand && res.status(200).json({ message: 'success', Brand });
});

const updateBrand = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  let Brand = await brandModel.findById(id);
  if (!Brand) return next(new AppError(`No Brand found`, 404));
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `E-Commerce Application/Brands/`,
        public_id: uuidv4(),
      },
      (err, res) => {
        if (err) return next(new AppError(err, 400));
      }
    );
    if (Brand.logo) await cloudinary.uploader.destroy(Brand.logo.public_id);
    req.body.logo = { secure_url, public_id };
  }
  req.body.slug = slugify(req.body.name);
  let updatedBrand = await brandModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  updatedBrand && res.status(200).json({ message: 'success', updatedBrand });
});

const deleteBrand = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  let Brand = await brandModel.findByIdAndDelete(id);
  if (!Brand) return next(new AppError(`No Brand found`, 404));
  if (Brand.logo) await cloudinary.uploader.destroy(Brand.logo.public_id);
  Brand && res.status(200).json({ message: 'success', Brand });
});

export { addBrand, getAllBrands, getBrand, updateBrand, deleteBrand };
