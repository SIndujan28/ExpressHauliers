import HTTPStatus from 'http-status';
// import jwt from 'jsonwebtoken';
// import { hashSync } from 'bcrypt-nodejs';
import User from './user.model';
// import constants from './../../config/constants';
// import sendFPEmail from './../../helpers/email.send.helper';

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
