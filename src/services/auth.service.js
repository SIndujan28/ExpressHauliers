import passport from 'passport';
import LocalStrategy from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import constants from './../config/constants';

import Customer from '../modules/customer/customer.model';
import Transporter from '../modules/transporter/transporter.model';

const LocalOpts = {
  usernameField: 'email',
};

const customerLocalStrategy = new LocalStrategy(LocalOpts, async (email, password, done) => {
  try {
    const user = await Customer.findOne({ email });

    if (!user) {
      return done(null, false);
    } else if (!user.authenticateCustomer(password)) {
      return done(null, false);
    }
    return done(null, user);
  } catch (e) {
    return done(e, false);
  }
});

const transporterLocalStrategy = new LocalStrategy(LocalOpts, async (email, password, done) => {
  try {
    const user = await Transporter.findOne({ email });

    if (!user) {
      return done(null, false);
    } else if (!user.authenticateTransporter(password)) {
      return done(null, false);
    }
    return done(null, user);
  } catch (e) {
    return done(e, false);
  }
});
const jwtOpts = {

  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: constants.JWT_SECRET,
};

const jwtStrategy = new JWTStrategy(jwtOpts, async (payload, done) => {
  try {
    const user = await Customer.findById(payload._id);
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (e) {
    return done(e, false);
  }
});

passport.use('local.customer', customerLocalStrategy);
passport.use('local.transporter', transporterLocalStrategy);
passport.use(jwtStrategy);
export const authLocalCustomer = passport.authenticate('local.customer', { session: false });
export const authLocalTransporter = passport.authenticate('local.transporter', { session: false });
export const authJwt = passport.authenticate('jwt', { session: false });
