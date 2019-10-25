import { Router } from 'express';
import validate from 'express-validation';
import * as transporterController from './transporter.controller';
import transporterValidation from './transporter.validation';

import { authLocalTransporter } from './../../services/auth.service';

const routes = new Router();

routes.post('/signup', validate(transporterValidation.signup), transporterController.Signup);
routes.post('/login', authLocalTransporter, transporterController.login);

export default routes;
