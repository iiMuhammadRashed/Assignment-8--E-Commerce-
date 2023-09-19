import Joi from 'joi';

const addWishlistValidation = Joi.object({
  product: Joi.string().hex().length(24).required(),
});

const deleteWishlistValidation = Joi.object({
  product: Joi.string().hex().length(24).required(),
});

export { addWishlistValidation, deleteWishlistValidation };
