import HTTPStatus from 'http-status';
import User from './user.model';

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
      const user = await User.create({
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
      const user = await User.create({
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
