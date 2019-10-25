/* eslint-disable no-console*/

import mongoose from 'mongoose';

import constants from './constants';

mongoose.Promise = global.Promise;

try {
  mongoose.connect(constants.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
  mongoose.set('useCreateIndex', true);
} catch (error) {
  mongoose.createConnection(constants.MONGO_URL);
}

mongoose.connection
  .once('open', () => { console.log('Mongo database running .....'); })
  .on('error', e => {
    throw e;
  });
