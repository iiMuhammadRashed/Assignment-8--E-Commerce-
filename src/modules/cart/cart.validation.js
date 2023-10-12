import Joi from 'joi';

const addItemToCartValidation = Joi.object({
  product: Joi.string().hex().length(24).required(),
});
const removeItemFromCartValidation = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

const applyCouponValidation = Joi.object({
  code: Joi.string().required(),
});

const updateQuantityValidation = Joi.object({
  id: Joi.string().hex().length(24).required(),
  quantity: Joi.number().min(1).required(),
});

export {
  addItemToCartValidation,
  removeItemFromCartValidation,
  applyCouponValidation,
  updateQuantityValidation,
};
