import Joi from 'joi';

const signUpValidation = Joi.object({
  username: Joi.string().min(4).max(20).required(),
  firstName: Joi.string().min(4).max(20).required(),
  lastName: Joi.string().min(4).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  rePassword: Joi.string().valid(Joi.ref('password')).required(),
  age: Joi.number().min(16).max(80),
  gender: Joi.string().valid('male', 'female', 'not specific'),
  role: Joi.string().valid('user', 'admin'),
});

const signInValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export { signUpValidation, signInValidation };
