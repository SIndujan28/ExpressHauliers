import AWS from 'aws-sdk';
import path from 'path';
import axios from 'axios';
import fs from 'fs';
import constants from './../config/constants';

AWS.config.update({
  accessKeyId: constants.AWS_KEY_ID,
  secretAccessKey: constants.AWS_ACCESS_KEY,
});
const s3 = new AWS.S3();

export default async function download(obj, fileName, pathToDownload) {
  let url;

  switch (obj.type) {
    case 'facebook':
      url = `https://graph.facebook.com/${obj.value}/picture?height=1000&width=1000&access_token=${obj.access_token}`;
      break;
    case 'google':
      url = `${obj.value}?sz=1000`;
      break;
    default:
      url = obj.value;
      break;
  }
  const location = path.resolve(pathToDownload, fileName);
  const response = await axios({
    method: 'GET',
    url,
    responseType: 'stream',
  });
  response.data.pipe(fs.createWriteStream(location));

  return await new Promise(((resolve, reject) => {
    response.data.on('end', async () => {
      await upload(location, fileName);
      resolve();
    });
    response.data.on('error', () => {
      reject();
    });
  }));
}

async function upload(location, fileName) {
  const readStream = fs.createReadStream(location);
  const params = {
    Bucket: constants.S3_BUCKET_NAME,
    Key: `${constants.S3_USER_PROFILE_PATH}/${fileName}`,
    Body: readStream,
  };
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) reject(err.stack());
      else resolve(data);
    });
  });
}
