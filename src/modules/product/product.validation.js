import Joi from 'joi';

const addProductValidation = Joi.object({
  title: Joi.string().min(5).max(20).required(),
  price: Joi.number().min(0).required(),
  description: Joi.string().min(10).max(300).required(),
  stock: Joi.number().min(0).required(),
  category: Joi.string().hex().length(24).required(),
  subCategory: Joi.string().hex().length(24).required(),
  brand: Joi.string().hex().length(24).required(),
});
const updateProductValidation = Joi.object({
  id: Joi.string().hex().length(24).required(),
  title: Joi.string().min(5).max(20),
  price: Joi.number().min(0),
  description: Joi.string().min(10).max(300),
  stock: Joi.number().min(0),
  category: Joi.string().hex().length(24),
  subCategory: Joi.string().hex().length(24),
  brand: Joi.string().hex().length(24),
  imageIndex: Joi.number().min(0).max(4),
});
const deleteProductValidation = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

export {
  addProductValidation,
  updateProductValidation,
  deleteProductValidation,
};
