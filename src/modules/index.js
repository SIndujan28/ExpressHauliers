import postRoutes from './post/post.routes';
import userRoutes from './user/user.routes';

export default app => {
  app.use('/api/v1/post', postRoutes);
  app.use('/api/v2/user', userRoutes);
};
