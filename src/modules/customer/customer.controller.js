/* eslint-disable no-console*/
import HTTPStatus from 'http-status';
import Customer from './customer.model';

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
