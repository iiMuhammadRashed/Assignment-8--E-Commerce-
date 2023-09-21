import { userModel } from '../../../database/models/user.model.js';
import { asyncErrorHandler } from '../../middleware/handleAsyncError.js';
import { AppError } from '../../utils/AppError.js';

const addWishlist = asyncErrorHandler(async (req, res, next) => {
  let { product } = req.body;
  let wishlist = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: product },
    },
    { new: true }
  );
  res.status(201).json({ message: 'success', wishlist: wishlist.wishlist });
});

const getAllUserWishlist = asyncErrorHandler(async (req, res, next) => {
  let wishlist = await userModel.findById(req.user._id).populate('wishlist');
  if (!wishlist) return next(new AppError(`No wishlist found`, 404));
  wishlist &&
    res.status(200).json({ message: 'success', wishlist: wishlist.wishlist });
});

const deleteWishlist = asyncErrorHandler(async (req, res, next) => {
  let { product } = req.params;
  let wishlist = await userModel.findByIdAndUpdate(
    req.user._id,
    { $pull: { wishlist: product } },
    { new: true }
  );
  wishlist &&
    res.status(200).json({ message: 'success', wishlist: wishlist.wishlist });
});

export { addWishlist, getAllUserWishlist, deleteWishlist };
