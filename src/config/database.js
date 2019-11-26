/* eslint-disable no-console*/

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
mongoose.Promise = global.Promise;

try {
  mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
  mongoose.set('useCreateIndex', true);
} catch (error) {
  mongoose.createConnection(process.env.MONGO_URL);
}

mongoose.connection
  .once('open', () => { console.log('Mongo database running .....'); })
  .on('error', e => {
    throw e;
  });
