import Joi from 'joi';

const addAddressValidation = Joi.object({
  city: Joi.string().min(3).max(30).required(),
  street: Joi.string().min(3).max(30).required(),
});

const deleteAddressValidation = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

export { addAddressValidation, deleteAddressValidation };
