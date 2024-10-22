import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import passport from 'passport';
import express from 'express';
import fileUpload from 'express-fileupload';

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

export default app => {
  if (isProd) {
    app.use(compression());
    app.use(helmet());
  }
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(passport.initialize());
  app.use(fileUpload());

  if (isDev) {
    app.use(morgan('dev'));
  }
};
