import Joi from 'joi';

const createCashOrderValidation = Joi.object({
  shippingAddress: Joi.object({
    address: Joi.string().required(),
    city: Joi.string().required(),
  }).required(),
});

const createCheckoutSessionValidation = Joi.object({
  shippingAddress: Joi.object({
    address: Joi.string().required(),
    city: Joi.string().required(),
  }).required(),
});

export { createCashOrderValidation, createCheckoutSessionValidation };
