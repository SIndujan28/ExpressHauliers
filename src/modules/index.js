import customerRoutes from './customer/customer.routes';
import transporterRoutes from './transporter/transporter.routes';
import postRoutes from './post/post.routes';

export default app => {
  app.use('/api/v1/customer', customerRoutes);
  app.use('/api/v1/transporter', transporterRoutes);
  app.use('/api/v1/post', postRoutes);
};
