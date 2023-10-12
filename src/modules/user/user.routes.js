import express from 'express';
import * as userController from './user.controller.js';
import { validation } from '../../middleware/validation.js';
import {
  addUserValidation,
  deleteUserValidation,
  resetPasswordValidation,
  sendForgetPasswordCodeValidation,
  updateUserPasswordValidation,
  updateUserValidation,
} from './user.validation.js';
import { protectedRoutes } from '../auth/auth.controller.js';

const userRouter = express.Router();
userRouter
  .route('/')
  .post(validation(addUserValidation), protectedRoutes, userController.addUser)
  .get(userController.getAllUsers);
userRouter
  .route('/:id')
  .get(userController.getUser)
  .put(
    validation(updateUserValidation),
    protectedRoutes,
    userController.updateUser
  )
  .patch(
    validation(updateUserPasswordValidation),
    protectedRoutes,
    userController.updateUserPassword
  )
  .delete(
    validation(deleteUserValidation),
    protectedRoutes,
    userController.deleteUser
  );
userRouter.patch(
  '/sendForgetPasswordCode',
  validation(sendForgetPasswordCodeValidation),
  userController.sendForgetPasswordCode
);
userRouter.patch(
  '/resetPassword',
  validation(resetPasswordValidation),
  userController.resetPassword
);
export default userRouter;
