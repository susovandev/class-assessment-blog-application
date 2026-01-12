import userModel from '../models/user.model.js';
import { verifyAccessToken } from '../libs/token.js';

export const optionalAuth = async (req, res, next) => {
  const accessToken = req.cookies?.accessToken;

  if (!accessToken) {
    res.locals.currentUser = null;
    return next();
  }

  const decoded = verifyAccessToken(accessToken);
  if (!decoded) {
    res.locals.currentUser = null;
    return next();
  }

  const user = await userModel.findById(decoded.sub);
  res.locals.currentUser = user || null;
  next();
};
