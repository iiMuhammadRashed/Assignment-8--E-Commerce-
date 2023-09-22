import { couponModel } from '../../../database/models/coupon.model.js';
import { asyncErrorHandler } from '../../middleware/handleAsyncError.js';
import { AppError } from '../../utils/AppError.js';
import { ApiFeatures } from '../../utils/ApiFeatures.js';
import QRCode from 'qrcode';

const addCoupon = asyncErrorHandler(async (req, res, next) => {
  let coupon = new couponModel(req.body);
  await coupon.save();
  res.status(201).json({ message: 'success', coupon });
});

const getAllCoupons = asyncErrorHandler(async (req, res, next) => {
  let filterObj = {};

  let apiFeatures = new ApiFeatures(couponModel.find(filterObj), req.query)
    .paginate()
    .filter()
    .sort()
    .search()
    .fields();
  let coupon = await apiFeatures.mongooseQuery;
  if (!coupon.length) return next(new AppError(`No coupon found`, 404));
  coupon &&
    res.status(200).json({
      message: 'success',
      CurrentPage: apiFeatures.PAGE,
      coupon,
    });
});

const getCoupon = asyncErrorHandler(async (req, res, next) => {
  let { id } = req.params;
  let coupon = await couponModel.findById(id);
  if (!coupon) return next(new AppError(`No coupon found`, 404));
  let qrCode = await QRCode.toDataURL(coupon.code);
  coupon && res.status(200).json({ message: 'success', coupon, qrCode });
});

const updateCoupon = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  let coupon = await couponModel.findById(id);
  if (!coupon) return next(new AppError(`No Coupon found`, 404));
  let updatedCoupon = await couponModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  updatedCoupon && res.status(200).json({ message: 'success', updatedCoupon });
});

const deleteCoupon = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  let coupon = await couponModel.findByIdAndDelete(id);
  if (!coupon) return next(new AppError(`No coupon found`, 404));
  coupon && res.status(200).json({ message: 'success', coupon });
});

export { addCoupon, getAllCoupons, getCoupon, updateCoupon, deleteCoupon };
