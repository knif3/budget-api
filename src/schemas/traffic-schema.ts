import Joi from '@hapi/joi';

export const trafficSchema = Joi.object({
    title: Joi.string().required(),
    amount: Joi.number().required(),
});
