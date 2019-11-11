import passport from 'passport';
import LocalStrategy from 'passport-local';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import constants from './../config/constants';

import Customer from '../modules/customer/customer.model';
import Transporter from '../modules/transporter/transporter.model';
import User from './../modules/user/user.model';

const LocalOpts = {
  usernameField: 'email',
};

const customerLocalStrategy = new LocalStrategy(LocalOpts, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return done(null, false);
    } else if (!user.authenticateUser(password)) {
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

const googleTokenStartegy = new GoogleStrategy({
  clientID: constants.GOOGLE_ID,
  clientSecret: constants.GOOGLE_SECRET,
  callbackURL: '/api/v1/customer/oauth/google/redirect',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const customer = await Customer.findOne({ email: profile.emails[0].value });
    if (!customer) {
      return done(null, { isNewUser: true, profile });
    }
    return done(null, customer);
  } catch (error) {
    done(error, false, error.message);
  }
});

const twitterTokenStrategy = new TwitterStrategy({
  consumerKey: constants.TWITTER_ID,
  consumerSecret: constants.TWITTER_SECRET,
  callbackURL: '/api/v1/customer/oauth/twitter/redirect',
}, async (token, tokenSecret, profile, done) => {
  try {
    const customer = await Customer.findOne({ email: profile.emails[0].value });
    if (!customer) {
      return done(null, { isNewUser: true, profile });
    }
    return done(null, customer);
  } catch (error) {
    done(error, false, error.message);
  }
});
const facebookTokenStartegy = new FacebookStrategy({
  clientID: constants.FACEBOOK_ID,
  clientSecret: constants.FACEBOOK_SECRET,
  callbackURL: '/api/v1/customer/oauth/facebook/redirect',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const customer = await Customer.findOne({ email: profile.emails[0].value });
    if (!customer) {
      return done(null, { isNewUser: true, profile });
    }
    return done(null, customer);
  } catch (error) {
    done(error, false, error.message);
  }
});
passport.use('facebookToken', facebookTokenStartegy);
passport.use('twitterToken', twitterTokenStrategy);
passport.use('googleToken', googleTokenStartegy);
passport.use('local.customer', customerLocalStrategy);
passport.use('local.transporter', transporterLocalStrategy);
passport.use(jwtStrategy);
export const authLocalCustomer = passport.authenticate('local.customer', { session: false });
export const authLocalTransporter = passport.authenticate('local.transporter', { session: false });
export const authGoogle = passport.authenticate('googleToken', { scope: ['profile', 'email'], session: false });
export const authTwitter = passport.authenticate('twitterToken', { session: false });
export const authFacebook = passport.authenticate('facebookToken', { session: false });
export const authJwt = passport.authenticate('jwt', { session: false });
