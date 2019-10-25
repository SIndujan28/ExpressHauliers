/* eslint-disable no-console*/
import HTTPStatus from 'http-status';
import Transporter from './transporter.model';

export async function Signup(req, res) {
  try {
    const transporter = await Transporter.create(req.body);
    return res.status(HTTPStatus.CREATED).json(transporter.toAuthJSON());
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
}

export function login(req, res, next) {
  res.status(HTTPStatus.OK).json(req.user.toAuthJSON());
  return next();
}
