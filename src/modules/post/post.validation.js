import Joi from 'joi';

export default {
  createPost: {
    body: {
      source: Joi.string().required(),
      destination: Joi.string().required(),
      distance: Joi.number().required(),
      itemDescription: Joi.string().max(40).required(),

    },
  },
};
