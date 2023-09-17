import Joi from 'joi';

const addReviewValidation = Joi.object({
  text: Joi.string().min(3).max(300).required(),
  product: Joi.string().hex().length(24).required(),
  rating: Joi.number().min(1).max(5).required(),
});

const updateReviewValidation = Joi.object({
  text: Joi.string().min(3).max(300).required(),
  rating: Joi.number().min(1).max(5).required(),
});

const deleteReviewValidation = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

export { addReviewValidation, updateReviewValidation, deleteReviewValidation };
