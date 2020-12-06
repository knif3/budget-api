import Joi from '@hapi/joi';

export const companySchema = Joi.object({
    title: Joi.string().required(),
    transactionType: Joi.number().required(),
});
