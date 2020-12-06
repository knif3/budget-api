import Joi from '@hapi/joi';

export const companySchema = Joi.object({
    userId: Joi.string().required(),
    title: Joi.string().required(),
    transactionType: Joi.number().required(),
});
