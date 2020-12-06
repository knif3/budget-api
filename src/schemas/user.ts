import Joi from '@hapi/joi';

export const userSchema = Joi.object({
    login: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).regex(/^(?=.*[a-zA-Z])(?=.*\d)/).required(),
});
