import HTTPStatus from 'http-status';
import jwt from 'jsonwebtoken';
import { hashSync } from 'bcrypt-nodejs';
import AWS from 'aws-sdk';
import uuid from 'uuid';
import User from './user.model';
import constants from '../../config/constants';
import sendFPEmail from './../../helpers/email.send.helper';

AWS.config.update({
  accessKeyId: constants.AWS_KEY_ID,
  secretAccessKey: constants.AWS_ACCESS_KEY,
});
const s3 = new AWS.S3();
export async function Signup(req, res) {
  try {
    const profile = req.body;
    const user = await User.create({
      userName: profile.userName,
      role: profile.role,
      email: profile.email,
      metadata: {
        password: profile.password,
      },
    });

    res.status(HTTPStatus.CREATED).json(user.toAuthJSON());
  } catch (error) {
    res.status(HTTPStatus.BAD_REQUEST).json(error);
  }
}
export async function login(req, res, next) {
  try {
    res.status(HTTPStatus.OK).json(req.user.toAuthJSON());
    next();
  } catch (e) {
    res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
}

export async function uploadPhoto(req, res) {
  try {
    const file = req.files.photo;
    console.log(file.data);
    const filename = `${uuid()}.${file.mimetype.split('/')[1]}`;
    const params = {
      Bucket: constants.S3_BUCKET_NAME,
      Key: `${constants.S3_USER_PROFILE_PATH}/${filename}`,
      Body: file.data,
    };
    const s3upload = await new Promise(((resolve, reject) => {
      s3.putObject(params, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    }));
    const user = await User.findOneAndUpdate({ _id: req.user._id }, { profileImage: filename });
    return res.status(HTTPStatus.CREATED).send({
      profileImage: `${constants.S3_USER_URL}/${filename}`,
      user,
    });
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
}
export async function googleOAuth(req, res) {
  try {
    if (req.user.isNewUser) {
      const role = req.user.role;
      const profile = req.user.profile;
      const user = User.create({
        email: profile.email,
        userName: profile.displayName,
        role,
        type: 'google',
        metadata: {
          firstName: profile.givenName,
          lastName: profile.familyName,
        },
      });
      return res.status(HTTPStatus.CREATED).json(user.toAuthJSON());
    }
    return res.status(HTTPStatus.OK).json(req.user.toAuthJSON());
  } catch (e) {
    res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
}

export async function twitterOAuth(req, res) {
  try {
    if (req.user.isNewUser) {
      const profile = req.user.profile;
      const role = req.user.role;
      const user = await User.create({
        email: profile.email,
        role,
        type: 'twitter',
        userName: profile.displayName,
        metadata: {
          firstName: profile.givenName,
          lastName: profile.familyName,
        },
      });
      return res.status(HTTPStatus.CREATED).json(user.toAuthJSON());
    }
    return res.status(HTTPStatus.OK).json(req.user.toAuthJSON());
  } catch (e) {
    res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
}

export async function facebookOAuth(req, res) {
  try {
    if (req.user.isNewUser) {
      const profile = req.user.profile;
      const role = req.user.role;
      const user = await User.create({
        email: profile.email,
        role,
        type: 'facebook',
        userName: profile.displayName,
        metadata: {
          firstName: profile.givenName,
          lastName: profile.familyName,
        },
      });
      return res.status(HTTPStatus.CREATED).json(user.toAuthJSON());
    }
    return res.status(HTTPStatus.OK).json(req.user.toAuthJSON());
  } catch (e) {
    res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
}

export async function forget(req, res) {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(HTTPStatus.BAD_REQUEST).json('user doesn\'t exist signup first');
    }
    const rememberToken = jwt.sign({ exp: Math.floor(Date.now() / 1000) + (60 * 60), email: user.email }, constants.PASSWORD_RESET_JWT);
    await User.findByIdAndUpdate(user._id, { reset: true });
    sendFPEmail(user.email, rememberToken);
    res.status(HTTPStatus.OK).json('email has been sent');
  } catch (e) {
    res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
}

export async function resetPassword(req, res) {
  const rememberToken = req.body.token;
  const password = req.body.password;
  try {
    const token = jwt.verify(rememberToken, constants.PASSWORD_RESET_JWT);
    const user = await User.findOne({ email: token.email, reset: true });
    if (!user) {
      return res.status(HTTPStatus.BAD_REQUEST).json('please try again!!!');
    }
    await User.update({ email: token.email }, { password: hashSync(password), reset: false });
    return res.status(HTTPStatus.OK).json('password has been updated');
  } catch (e) {
    res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
}
