import { Router } from 'express';
import * as userController from './user.controller';
import { authLocalCustomer, authFacebook, authGoogle, authTwitter } from './../../services/auth.service';

const routes = new Router();

routes.post('/signup', userController.Signup);
routes.post('/login', authLocalCustomer, userController.login);
routes.get('/oauth/google', (req, res, next) => {
  req.app.locals.role = req.params.role;
  next();
}, authGoogle);
routes.get('/oauth/google/redirect', authGoogle, userController.googleOAuth);
// routes.get('/oauth/twitter', authTwitter);
// routes.get('/oauth/twitter/redirect', authTwitter, userController.facebookOAuth);
// routes.get('/oauth/facebook', authFacebook);
// routes.get('/oauth/facebook/redirect', authFacebook, userController.facebookOAuth);
export default routes;
