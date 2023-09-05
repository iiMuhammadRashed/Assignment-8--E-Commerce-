import express from 'express';
import * as authController from './auth.controller.js';

const authRouter = express.Router();

authRouter.post('/signUp', authController.signUp);
authRouter.post('/signIn', authController.signIn);
authRouter.get('/verify/:email', authController.verifyEmail);

export default authRouter;
