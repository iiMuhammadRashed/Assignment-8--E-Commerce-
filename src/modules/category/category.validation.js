import Joi from 'joi';

const addCategoryValidation = Joi.object({
  name: Joi.string().min(3).max(15).required(),
});

const updateCategoryValidation = Joi.object({
  id: Joi.string().hex().length(24).required(),
  name: Joi.string().min(3).max(15),
});

const deleteCategoryValidation = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

export {
  addCategoryValidation,
  updateCategoryValidation,
  deleteCategoryValidation,
};
