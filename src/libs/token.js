import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL } from '../constants/index.js';

export const signAccessToken = (user) => {
	return jwt.sign(
		{
			sub: user?._id,
			role: user?.role,
			username: user?.username,
		},
		config.ACCESS_TOKEN_SECRET_KEY,
		{ expiresIn: ACCESS_TOKEN_TTL },
	);
};

export const signRefreshToken = (user) => {
	return jwt.sign(
		{
			sub: user?._id,
			role: user?.role,
			username: user?.username,
		},
		config.REFRESH_TOKEN_SECRET_KEY,
		{ expiresIn: REFRESH_TOKEN_TTL },
	);
};

export const generateAccessAndRefreshToken = (user) => {
	const accessToken = signAccessToken(user);
	const refreshToken = signRefreshToken(user);
	return { accessToken, refreshToken };
};

export const verifyAccessToken = (accessToken) => {
	try {
		return jwt.verify(accessToken, config.ACCESS_TOKEN_SECRET_KEY);
	} catch (err) {
		return null;
	}
};

export const verifyRefreshToken = (refreshToken) => {
	try {
		return jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET_KEY);
	} catch (err) {
		return null;
	}
};
