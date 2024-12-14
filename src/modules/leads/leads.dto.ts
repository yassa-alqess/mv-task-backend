import Joi from 'joi';

export const CreateLeadDto = Joi.object({
    fullName: Joi.string().max(200).required(),
    email: Joi.string().email().max(200).regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).required(),
    phone: Joi.string().length(11).required(),
    nid: Joi.string().length(14).required(),
});

