import { Router } from 'express';
import validate from 'express-validation';
import * as postController from './post.controller';
import postValidation from './post.validation';
import { authJwt } from './../../services/auth.service';

const routes = new Router();

routes.post('/', authJwt, validate(postValidation.createPost), postController.createPost);
routes.get('/:id', authJwt, postController.getPostById);
routes.get('/', authJwt, postController.getPostsList);
routes.post('/toggle/:id', authJwt, postController.toggle);
routes.post('/:id/image/upload', authJwt, postController.imageUpload);

export default routes;
