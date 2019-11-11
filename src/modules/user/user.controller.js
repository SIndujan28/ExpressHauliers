import HTTPStatus from 'http-status';
import jwt from 'jsonwebtoken';
import { hashSync } from 'bcrypt-nodejs';
import User from './user.model';
import constants from './../../config/constants';
import sendFPEmail from './../../helpers/email.send.helper';

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
  console.log(req.user);
  try {
    if (req.user.isNewUser) {
      const profile = req.user.profile;
      const user = await User.create({
        email: profile.emails[0].value,
        userName: profile.displayName,
        type: 'google',
        metadata: {
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
        },
      });
      return res.status(HTTPStatus.CREATED).send(user.toAuthJSON());
    }
    return res.status(HTTPStatus.OK).json(req.user.toAuthJSON());
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error);
  }
}

export async function twitterOAuth(req, res) {
  console.log(req.user);
  try {
    if (req.user.isNewUser) {
      const profile = req.user.profile;
      const user = await User.create({
        email: profile.emails[0].value,
        userName: profile.displayName,
        type: 'twitter',
        metadata: {
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
        },
      });
      return res.status(HTTPStatus.CREATED).send(user.toAuthJSON());
    }
    return res.status(HTTPStatus.OK).json(req.user.toAuthJSON());
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error);
  }
}

export async function facebookOAuth(req, res) {
  console.log(req.user);
  try {
    if (req.user.isNewUser) {
      const profile = req.user.profile;
      const user = await User.create({
        email: profile.emails[0].value,
        userName: profile.displayName,
        type: 'facebook',
        metadata: {
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
        },
      });
      return res.status(HTTPStatus.CREATED).send(user.toAuthJSON());
    }
    return res.status(HTTPStatus.OK).json(req.user.toAuthJSON());
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error);
  }
}
export async function forget(req, res) {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(HTTPStatus.BAD_REQUEST).json('user doent exists signup first');
    }
    const rememberToken = jwt.sign({ exp: Math.floor(Date.now() / 1000) + (60 * 60), email: user.email }, constants.PASSWORD_RESET_JWT);
    await User.findByIdAndUpdate(user._id, { reset: true });
    sendFPEmail(user.email, rememberToken);
    return res.status(HTTPStatus.OK).json('email has sent');
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
}
export async function resetPassword(req, res) {
  const rememberToken = req.body.token;
  const password = req.body.password;
  try {
    const token = jwt.verify(rememberToken, constants.PASSWORD_RESET_JWT);
    const user = await User.findOne({ email: token.email, reset: true });
    if (!user) {
      return res.status(HTTPStatus.NOT_ACCEPTABLE).json('lease try again, password token expired');
    }
    await User.update({ email: token.email }, { password: hashSync(password), reset: false });
    return res.status(HTTPStatus.OK).json('password has been updated');
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
}
