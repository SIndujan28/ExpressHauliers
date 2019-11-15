import HTTPStatus from 'http-status';
import AWS from 'aws-sdk';
import uuid from 'uuid';
import Post from './post.model';

import { nsp } from './../../services/socket.service';
import constants from './../../config/constants';

AWS.config.update({
  accessKeyId: constants.AWS_KEY_ID,
  secretAccessKey: constants.AWS_ACCESS_KEY,
});
const s3 = new AWS.S3();
export async function createPost(req, res) {
  try {
    const post = await Post.createPost(req.body, req.user._id);

    return res.status(HTTPStatus.CREATED).json(post);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
}
export async function getPostById(req, res) {
  try {
    const post = await Post.findById(req.params.id).populate('user');

    return res.status(HTTPStatus.OK).json(post);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
}
export async function getPostsList(req, res) {
  const limit = parseInt(req.query.limit, 0);
  const skip = parseInt(req.query.skip, 0);
  const status = req.query.status;
  try {
    const posts = await Post.list({ status, limit, skip });
    return res.status(HTTPStatus.OK).json(posts);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
}

export async function imageUpload(req, res) {
  try {
    const post = await Post.findById(req.params.id).populate('user');
    if (req.user._id === post.user._id) {
      const file = req.files.photo;
      if (file.mimetype !== 'image/jpg' && file.mimetype !== 'image/png') {
        return res.status(HTTPStatus.UNSUPPORTED_MEDIA_TYPE).json({
          error: 'invalid_file_type',
          message: 'Please upload .png or .jpg file',
        });
      }
      if (file.data.byteLength / 1024 > constants.MAX_FILE_SIZE) {
        return res.status(HTTPStatus.UNAVAILABLE_FOR_LEGAL_REASONS).json({
          error: 'file_size_exceeded',
          message: '`The image size exceeds the allowed limit, please upload a file below ${constants.MAX_FILE_SIZE / 1024}MB`',
        });
      }
      const filename = `${uuid()}.${file.mimetype.split('/')[1]}`;
      const params = {
        Bucket: constants.S3_BOCKET_NAME,
        Key: `${constants.S3_POST_PATH}/${filename}`,
        Body: file.data,
      };
      const s3upload = await new Promise(((resolve, reject) => {
        s3.putObject(params, (err, data) => {
          if (err) reject(err);
          if (data) resolve(data);
        });
      }));

      await post.update({ image: filename });

      return res.status(HTTPStatus.CREATED).send({
        image: `${constants.S3_POST_URL}/${filename}`,
        post,
      });
    }

    return res.status(HTTPStatus.FORBIDDEN).json({
      error: 'Unauthorized user',
      message: 'You\'re not the owner of this post ',
    });
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
}
export async function toggle(req, res) {
  try {
    const status1 = req.body.status;
    switch (status1) {
      case 'awaiting_to_verify': {
        const post = await Post.findByIdAndUpdate(req.params.id, {
          status: status1,
        }, { new: true });
        res.status(HTTPStatus.OK).json(post);
        break;
      }
      case 'verified': {
        const post = await Post.findByIdAndUpdate(req.params.id, {
          status: status1,
        }, { new: true });
        res.status(HTTPStatus.OK).json(post);
        break;
      }
      case 'awaiting_bid': {
        const post = await Post.findByIdAndUpdate(req.params.id, {
          status: status1,
        }, { new: true });
        nsp.emit('awaiting_bid', post._id);
        res.status(HTTPStatus.OK).json(post);
        break;
      }
      case 'bidding_started': {
        const post = await Post.findByIdAndUpdate(req.params.id, {
          status: status1,
        }, { new: true });
        nsp.emit('bidding_started', post._id);
        res.status(HTTPStatus.OK).json(post);
        break;
      }
      case 'bidding_done': {
        const post = await Post.findByIdAndUpdate(req.params.id, {
          status: status1,
        }, { new: true });
        nsp.emit('bidding_done', post._id);
        res.status(HTTPStatus.OK).json(post);
        break;
      }
      default:
        res.status(HTTPStatus.BAD_REQUEST).json('Provide valide status');
    }
  } catch (e) {
    res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
}
