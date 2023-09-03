import express from 'express';
import * as userController from './user.controller.js';
import { validation } from '../../middleware/validation.js';
import {
  addUserValidation,
  deleteUserValidation,
  updateUserPasswordValidation,
  updateUserValidation,
} from './user.validation.js';

const userRouter = express.Router();
userRouter
  .route('/')
  .post(validation(addUserValidation), userController.addUser)
  .get(userController.getAllUsers);
userRouter
  .route('/:id')
  .get(userController.getUser)
  .put(validation(updateUserValidation), userController.updateUser)
  .patch(
    validation(updateUserPasswordValidation),
    userController.updateUserPassword
  )
  .delete(validation(deleteUserValidation), userController.deleteUser);

export default userRouter;
