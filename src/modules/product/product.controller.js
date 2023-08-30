import { productModel } from '../../../database/models/product.model.js';
import { asyncErrorHandler } from '../../middleware/handleAsyncError.js';
import slugify from 'slugify';
import { AppError } from '../../utils/AppError.js';
import { ApiFeatures } from '../../utils/ApiFeatures.js';
import cloudinary from '../../utils/cloudinary.js';
import { v4 as uuidv4 } from 'uuid';

const addProduct = asyncErrorHandler(async (req, res, next) => {
  let isExist = await productModel.findOne({ title: req.body.title });
  if (isExist) return next(new AppError(`The title is already is use`, 409));
  if (!req.files.coverImage)
    return next(new AppError(`The Product coverImage is required`, 400));
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.files.coverImage[0].path,
    {
      folder: `E-Commerce Application/products/coverImages`,
      public_id: uuidv4(),
    },
    (err, res) => {
      if (err) return next(new AppError(err, 400));
    }
  );
  req.body.coverImage = { secure_url, public_id };

  if (!req.files.images)
    return next(new AppError(`The Product Images is required`, 400));
  let imgsArr = [];
  for (const img of req.files.images) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      img.path,
      {
        folder: `E-Commerce Application/products/images/`,
        public_id: uuidv4(),
      },
      (err, res) => {
        if (err) return next(new AppError(err, 400));
      }
    );
    imgsArr.push({ secure_url, public_id });
  }
  req.body.images = imgsArr;
  req.body.slug = slugify(req.body.title);
  let Product = new productModel(req.body);
  await Product.save();
  res.status(201).json({ message: 'success', Product });
});

const getAllProducts = asyncErrorHandler(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(productModel.find(), req.query)
    .paginate()
    .filter()
    .sort()
    .search()
    .fields();
  let Products = await apiFeatures.mongooseQuery;
  if (!Products.length) return next(new AppError(`No Products found`, 404));
  Products &&
    res
      .status(200)
      .json({ message: 'success', CurrentPage: apiFeatures.PAGE, Products });
});

const getProduct = asyncErrorHandler(async (req, res, next) => {
  let { id } = req.params;
  let Product = await productModel.findById(id);
  if (!Product) return next(new AppError(`No Product found`, 404));
  Product && res.status(200).json({ message: 'success', Product });
});

const updateProduct = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  let Product = await productModel.findById(id);
  if (!Product) return next(new AppError(`No Product found`, 404));
  if (req.files.coverImage) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.files.coverImage[0].path,
      {
        folder: `E-Commerce Application/products/coverImages`,
        public_id: uuidv4(),
      },
      (err, res) => {
        if (err) return next(new AppError(err, 400));
      }
    );
    if (Product.coverImage)
      await cloudinary.uploader.destroy(Product.coverImage.public_id);
    req.body.coverImage = { secure_url, public_id };
  }
  if (req.files.image && req.body.imageIndex) {
    let imgsArr = Product.images;
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.files.image[0].path,
      {
        folder: `E-Commerce Application/products/images/`,
        public_id: uuidv4(),
      },
      (err, res) => {
        if (err) return next(new AppError(err, 400));
      }
    );
    if (Product.images[req.body.imageIndex])
      await cloudinary.uploader.destroy(
        Product.images[req.body.imageIndex].public_id
      );
    imgsArr.splice(req.body.imageIndex, 1, { secure_url, public_id });
    req.body.images = imgsArr;
  }
  if (req.body.title) req.body.slug = slugify(req.body.title);
  let updatedProduct = await productModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  updatedProduct &&
    res.status(200).json({ message: 'success', updatedProduct });
});

const deleteProduct = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  let Product = await productModel.findByIdAndDelete(id);
  if (Product.coverImage) {
    await cloudinary.uploader.destroy(Product.coverImage.public_id);
  }
  if (Product.images) {
    Product.images.map(
      async (image) => await cloudinary.uploader.destroy(image.public_id)
    );
  }
  if (!Product) return next(new AppError(`No Product found`, 404));
  Product && res.status(200).json({ message: 'success', Product });
});

export { addProduct, getAllProducts, getProduct, updateProduct, deleteProduct };
