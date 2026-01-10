import userModel from '../models/user.model.js';
import { config } from '../config/index.js';
import {
	verifyAccessToken,
	verifyRefreshToken,
	signAccessToken,
} from '../libs/token.js';

export const AuthGuard = async (req, res, next) => {
	const accessToken = req?.cookies.accessToken;
	const refreshToken = req?.cookies.refreshToken;

	if (!refreshToken) {
		req.flash('error', 'Unauthorized Access');
		return res.redirect('/auth/login');
	}

	if (accessToken) {
		const decoded = verifyAccessToken(accessToken);
		if (!decoded) {
			req.flash('error', 'Unauthorized Access');
			return res.redirect('/auth/login');
		}
		req.user = decoded;
		return next();
	}

	console.log(`ACCESS TOKEN EXPIRED or NOT FOUND....`);

	const decoded = verifyRefreshToken(refreshToken);
	if (!decoded) {
		req.flash('error', 'Unauthorized Access');
		return res.redirect('/auth/login');
	}

	// Check if user exists or not
	const user = await userModel.findById(decoded?.sub).select('+refreshToken');
	if (!user || user.refreshToken !== refreshToken) {
		req.flash('error', 'Unauthorized Access');
		return res.redirect('/auth/login');
	}

	const newAccessToken = signAccessToken(user);

	res.cookie('accessToken', newAccessToken, {
		httpOnly: true,
		sameSite: 'lax',
		secure: env.NODE_ENV === 'production',
		maxAge: config.ACCESS_TOKEN_TTL * 1000,
	});

	req.user = verifyAccessToken(newAccessToken);
	next();
};
