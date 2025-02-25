import Joi from "joi";

export const loginSchema = Joi.object({
    email: Joi.string().min(3).max(70).required(),
    password: Joi.string().min(3).required()
    });