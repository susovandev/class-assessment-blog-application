import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const _config = {
	NODE_ENV: process.env.NODE_ENV || 'development',
	PORT: process.env.PORT || 3000,
	DATABASE_URI: process.env.DATABASE_URI,
	ACCESS_TOKEN_SECRET_KEY: process.env.ACCESS_TOKEN_SECRET_KEY,
	REFRESH_TOKEN_SECRET_KEY: process.env.REFRESH_TOKEN_SECRET_KEY,
};

export const config = Object.freeze(_config);
