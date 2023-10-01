import Joi from 'joi';

const addCouponValidation = Joi.object({
  code: Joi.string(),
  expires: Joi.date(),
  discount: Joi.number(),
  type: Joi.string().valid('fixed', 'percent').required(),
});

const updateCouponValidation = Joi.object({
  id: Joi.string().hex().length(24).required(),
  expires: Joi.date(),
  discount: Joi.number(),
});

const deleteCouponValidation = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

export { addCouponValidation, updateCouponValidation, deleteCouponValidation };
