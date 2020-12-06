import Joi from '@hapi/joi';

export const trafficSchema = Joi.object({
    budgetId: Joi.string().required(),
    companyId: Joi.string().required(),
    title: Joi.string().required(),
    amount: Joi.number().required(),
    payday: Joi.string().required(),
});
