import Joi from 'joi';

const addBrandValidation = Joi.object({
  name: Joi.string().min(3).max(15).required(),
});

const updateBrandValidation = Joi.object({
  id: Joi.string().hex().length(24).required(),
  name: Joi.string().min(3).max(15),
});

const deleteBrandValidation = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

export {
  addBrandValidation,
  updateBrandValidation,
  deleteBrandValidation,
};
