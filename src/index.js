/* eslint-disable no-console */

import './config/database';

import apiRoutes from './modules';

import middlewaresConfig from './config/middlewares';

import { app, server } from './services/socket.service';

middlewaresConfig(app);
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('alo amigos');
});

apiRoutes(app);
server.listen(PORT, err => {
  if (err) {
    throw err;
  } else {
    console.log(`
        Death star deployed on port: ${PORT}
        ----------
        Running on ${process.env.NODE_ENV}
        ----------
        Waiting for the command sir!!
         `);
  }
});
