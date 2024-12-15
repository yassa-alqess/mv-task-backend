import Joi from 'joi';

export const CreateLeadDto = Joi.object({
    fullName: Joi.string().max(200).required(),
    email: Joi.string().email().max(200)
        .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).message("email pattern is invalid")
        .required(),
    phone: Joi.string().length(11)
        .regex(/^[0-9]+$/).message("phone pattern is invalid")
        .required(),
    nid: Joi.string().length(14).required(),
});

