import { Router } from 'express';
import validate from 'express-validation';
import * as userController from './user.controller';
import userValidation from './user.validation';
import { authLocalCustomer, authFacebook, authGoogle, authTwitter, authJwt } from './../../services/auth.service';

const routes = new Router();

routes.post('/signup', validate(userValidation.signup), userController.Signup);
routes.post('/login', authLocalCustomer, userController.login);
routes.post('/forget', validate(userValidation.forget), userController.forget);
routes.post('/reset', validate(userValidation.reset), userController.resetPassword);
routes.post('/upload', authJwt, userController.uploadPhoto);
routes.get('/oauth/google', (req, res, next) => {
  req.app.locals.role = req.params.role;
  next();
}, authGoogle);
routes.get('/oauth/google/redirect', authGoogle, userController.googleOAuth);
routes.get('/oauth/twitter', (req, res, next) => {
  req.app.locals.role = req.params.role;
  next();
}, authTwitter);
routes.get('/oauth/twitter/redirect', authTwitter, userController.facebookOAuth);
routes.get('/oauth/facebook', (req, res, next) => {
  req.app.locals.role = req.params.role;
  next();
}, authFacebook);
routes.get('/oauth/facebook/redirect', authFacebook, userController.facebookOAuth);
export default routes;
