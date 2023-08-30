import Joi from 'joi';

const addSubCategoryValidation = Joi.object({
  name: Joi.string().min(3).max(15).required(),
  category: Joi.string().hex().length(24).required(),
});

const updateSubCategoryValidation = Joi.object({
  id: Joi.string().hex().length(24).required(),
  name: Joi.string().min(3).max(15),
  category: Joi.string().hex().length(24),
});

const deleteSubCategoryValidation = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

export {
  addSubCategoryValidation,
  updateSubCategoryValidation,
  deleteSubCategoryValidation,
};
