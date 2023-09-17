import { reviewModel } from '../../../database/models/review.model.js';
import { asyncErrorHandler } from '../../middleware/handleAsyncError.js';
import { ApiFeatures } from '../../utils/ApiFeatures.js';
import { AppError } from '../../utils/AppError.js';

const addReview = asyncErrorHandler(async (req, res, next) => {
  req.body.user = req.user._id;
  let isExist = await reviewModel.findOne({
    user: req.user._id,
    product: req.body.product,
  });
  if (isExist)
    return next(new AppError(`already added review for this product`, 409));
  let review = new reviewModel(req.body);
  await review.save();
  res.status(201).json({ message: 'success', review });
});

const getAllReviews = asyncErrorHandler(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(reviewModel.find(), req.query)
    .paginate()
    .filter()
    .sort()
    .search()
    .fields();
  let reviews = await apiFeatures.mongooseQuery;
  if (!reviews.length) return next(new AppError(`No reviews found`, 404));
  reviews &&
    res.status(200).json({
      message: 'success',
      CurrentPage: apiFeatures.PAGE,
      reviews,
    });
});

const getReview = asyncErrorHandler(async (req, res, next) => {
  let { id } = req.params;
  let review = await reviewModel.findById(id);
  if (!review) return next(new AppError(`No review found`, 404));
  review && res.status(200).json({ message: 'success', review });
});

const updateReview = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  let review = await reviewModel.findOne({ _id: id, user: req.user._id });
  if (!review) return next(new AppError(`No review found`, 404));
  if (req.body.text) {
    if (review.text == req.body.text.toLowerCase())
      return next(new AppError(`New review text match old review`, 400));
  }
  let updatedReview = await reviewModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  updatedReview && res.status(200).json({ message: 'success', updatedReview });
});

const deleteReview = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  let review = await reviewModel.findOneAndDelete({
    _id: id,
    user: req.user._id,
  });
  if (!review) return next(new AppError(`No review found`, 404));
  review && res.status(200).json({ message: 'success', review });
});

export { addReview, getAllReviews, getReview, updateReview, deleteReview };
