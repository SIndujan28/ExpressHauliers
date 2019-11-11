import { Router } from 'express';
import * as userController from './user.controller';
import { authLocalCustomer } from './../../services/auth.service';

const routes = new Router();

routes.get('/', (req, res) => res.send('ollla amigos'));
routes.post('/signup', userController.Signup);
routes.post('/login', authLocalCustomer, userController.login);
export default routes;
