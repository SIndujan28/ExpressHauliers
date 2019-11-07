/* eslint-disable no-console*/
import HTTPStatus from 'http-status';
import jwt from 'jsonwebtoken';
import { hashSync } from 'bcrypt-nodejs';
import Customer from './customer.model';
import constants from './../../config/constants';
import sendFPEmail from './../../helpers/email.send.helper';

export async function Signup(req, res) {
  try {
    console.log('gek');
    const customer = await Customer.create(req.body);
    console.log(customer);
    return res.status(HTTPStatus.CREATED).json(customer.toAuthJSON());
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
}

export function login(req, res, next) {
  res.status(HTTPStatus.OK).json(req.user.toAuthJSON());
  return next();
}

export async function forget(req, res) {
  try {
    const email = req.body.email;
    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(HTTPStatus.BAD_REQUEST).json('user doent exists signup first');
    }
    const rememberToken = jwt.sign({ exp: Math.floor(Date.now() / 1000) + (60 * 60), email: customer.email }, constants.PASSWORD_RESET_JWT);
    await Customer.findByIdAndUpdate(customer._id, { reset: true });
    sendFPEmail(customer.email, rememberToken);
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
    const customer = await Customer.findOne({ email: token.email, reset: true });
    if (!customer) {
      return res.status(HTTPStatus.NOT_ACCEPTABLE).json('lease try again, password token expired');
    }
    await Customer.update({ email: token.email }, { password: hashSync(password), reset: false });
    return res.status(HTTPStatus.OK).json('password has been updated');
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
}

export async function googleOAuth(req, res) {
  console.log(req.user);
  try {
    if (req.user.isNewUser) {
      const profile = req.user.profile;
      const user = await Customer.create({
        email: profile.emails[0].value,
        userName: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        type: 'google',
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
      const user = await Customer.create({
        email: profile.emails[0].value,
        userName: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        type: 'twitter',
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
      const user = await Customer.create({
        email: profile.emails[0].value,
        userName: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        type: 'facebook',
      });
      return res.status(HTTPStatus.CREATED).send(user.toAuthJSON());
    }
    return res.status(HTTPStatus.OK).json(req.user.toAuthJSON());
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error);
  }
}
