import Joi from 'joi';

export const passwordConfig = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

export default {
  signup: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().regex(passwordConfig).required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      userName: Joi.string().required(),
      address: Joi.string().required(),
    } },
  forget: {
    body: {
      email: Joi.string().email().required(),
    },
  },

  reset: {
    body: {
      token: Joi.string().required(),
      password: Joi.string().min(6).required(),
    },
  },
};
