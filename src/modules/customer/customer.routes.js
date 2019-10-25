import { Router } from 'express';
import validate from 'express-validation';
import * as customerController from './customer.controller';
import customerValidation from './customer.validation';

import { authLocalCustomer } from './../../services/auth.service';

const routes = new Router();

routes.post('/signup', validate(customerValidation.signup), customerController.Signup);
routes.post('/login', authLocalCustomer, customerController.login);

export default routes;
