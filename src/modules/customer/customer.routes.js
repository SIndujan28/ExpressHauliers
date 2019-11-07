import { Router } from 'express';
import validate from 'express-validation';
import * as customerController from './customer.controller';
import customerValidation from './customer.validation';

import { authLocalCustomer, authGoogle, authTwitter, authFacebook } from './../../services/auth.service';

const routes = new Router();

routes.post('/signup', validate(customerValidation.signup), customerController.Signup);
routes.post('/login', authLocalCustomer, customerController.login);
routes.post('/forget', validate(customerValidation.forget), customerController.forget);
routes.post('/reset', validate(customerValidation.reset), customerController.resetPassword);
routes.get('/oauth/google', authGoogle);
routes.get('/oauth/google/redirect', authGoogle, customerController.googleOAuth);
routes.get('/oauth/twitter', authTwitter);
routes.get('/oauth/twitter/redirect', authTwitter, customerController.facebookOAuth);
routes.get('/oauth/facebook', authFacebook);
routes.get('/oauth/facebook/redirect', authFacebook, customerController.facebookOAuth);
export default routes;
