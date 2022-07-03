import Joi from '@hapi/joi';

export const budgetSchema = Joi.object({
  budgetType: Joi.number().required(),
  currency: Joi.string().required(),
  title: Joi.string().required(),
});
