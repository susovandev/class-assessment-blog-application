import userModel from '../models/user.model.js';
import {
  verifyAccessToken,
  verifyRefreshToken,
  signAccessToken,
} from '../libs/token.js';
import { ACCESS_TOKEN_TTL } from '../constants/index.js';
export const AuthGuard = async (req, res, next) => {
  const accessToken = req.cookies?.accessToken;
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.redirect('/auth/login');
  }

  // Try access token
  if (accessToken) {
    const decoded = verifyAccessToken(accessToken);
    if (decoded) {
      const user = await userModel.findById(decoded.sub);
      if (!user) return res.redirect('/auth/login');

      req.user = user;
      res.locals.currentUser = user;
      return next();
    }
  }

  // Fallback to refresh token
  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded) return res.redirect('/auth/login');

  const user = await userModel.findById(decoded.sub).select('+refreshToken');
  if (!user || user.refreshToken !== refreshToken)
    return res.redirect('/auth/login');

  const newAccessToken = signAccessToken(user);

  res.cookie('accessToken', newAccessToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: config.NODE_ENV === 'production',
    maxAge: ACCESS_TOKEN_TTL * 1000,
  });

  req.user = user;
  res.locals.currentUser = user;
  next();
};
