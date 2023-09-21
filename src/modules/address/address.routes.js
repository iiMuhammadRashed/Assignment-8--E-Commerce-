import express from 'express';
import * as addressController from './address.controller.js';
import { validation } from '../../middleware/validation.js';
import {
  addAddressValidation,
  deleteAddressValidation,
} from './address.validation.js';
import { protectedRoutes } from '../auth/auth.controller.js';

const addressRouter = express.Router();

addressRouter
  .route('/')
  .patch(
    protectedRoutes,
    validation(addAddressValidation),
    addressController.addAddress
  )
  .get(protectedRoutes, addressController.getAllUserAddresses);
addressRouter
  .route('/:id')
  .delete(
    protectedRoutes,
    validation(deleteAddressValidation),
    addressController.deleteAddress
  );

export default addressRouter;
