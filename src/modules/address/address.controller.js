import { userModel } from '../../../database/models/user.model.js';
import { asyncErrorHandler } from '../../middleware/handleAsyncError.js';
import { AppError } from '../../utils/AppError.js';

const addAddress = asyncErrorHandler(async (req, res, next) => {
  let address = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );
  res.status(201).json({ message: 'success', address: address.addresses });
});

const getAllUserAddresses = asyncErrorHandler(async (req, res, next) => {
  let addresses = await userModel.findById(req.user._id);
  if (!addresses) return next(new AppError(`No addresses found`, 404));
  addresses &&
    res
      .status(200)
      .json({ message: 'success', addresses: addresses.addresses });
});

const deleteAddress = asyncErrorHandler(async (req, res, next) => {
  let address = await userModel.findByIdAndUpdate(
    req.user._id,
    { $pull: { addresses: { _id: req.params.id } } },
    { new: true }
  );
  address &&
    res.status(200).json({ message: 'success', address: address.addresses });
});

export { addAddress, getAllUserAddresses, deleteAddress };
