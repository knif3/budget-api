import Joi from '@hapi/joi';

export const groupSchema = Joi.object({
  name: Joi.string().required(),
});
