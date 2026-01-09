import { comparePasswordHelper, hashPasswordHelper } from '../libs/password.js';
import userModel from '../models/user.model.js';
import { generateAccessAndRefreshToken } from '../libs/token.js';
import { ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL } from '../constants/index.js';
import { config } from '../config/index.js';

export const registerPage = async (req, res) => {
	res.render('auth/register');
};
export const loginPage = async (req, res) => {
	res.render('auth/login');
};

export const forgotPasswordPage = async (req, res) => {
	res.render('auth/forgot-password');
};

export const changePasswordPage = async(req, res) => {
	res.render('auth/change-password');
}
export const registerHandler = async (req, res) => {
	try {
		const { username, email, password } = req.body;
		const normalizedEmail = email.trim().toLowerCase();

		const user = await userModel.findOne({ email: normalizedEmail });
		if (user) {
			req.flash('error', 'Email already exists');
			return res.redirect('/auth/register');
		}

		// Hash password
		const hashedPassword = await hashPasswordHelper(password);
		if (!hashedPassword) {
			req.flash('error', 'Something went wrong please try again');
			res.redirect('/auth/register');
		}

		const newUser = userModel.create({
			username,
			email: normalizedEmail,
			password: hashedPassword,
			role: 'user',
		});
		if (!newUser) {
			req.flash('error', 'Something went wrong please try again');
			return res.redirect('/auth/register');
		}

		req.flash('success', 'Your account has been created successfully');
		return res.redirect('/auth/login');
	} catch (error) {
		console.error('Register Error:', error?.message || error);
		req.flash('error', 'Some thing went wrong please try again');
		return res.redirect('/auth/register');
	}
};

export const loginHandler = async (req, res) => {
	try {
		const { email, password, remember } = req.body;
		const normalizedEmail = email.trim().toLowerCase();

		const user = await userModel.findOne({ email: normalizedEmail });
		if (!user) {
			req.flash('error', 'Invalid email or password');
			return res.redirect('/auth/login');
		}

		const isPasswordMatch = await comparePasswordHelper(
			password,
			user?.password,
		);
		if (!isPasswordMatch) {
			req.flash('error', 'Invalid email or password');
			return res.redirect('/auth/login');
		}

		const { accessToken, refreshToken } = generateAccessAndRefreshToken(user);
		if (!accessToken || !refreshToken) {
			req.flash('error', 'Something went wrong please try again');
			return res.redirect('/auth/login');
		}

		res.cookie('accessToken', accessToken, {
			httpOnly: true,
			secure: config.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: ACCESS_TOKEN_TTL * 1000,
		});

		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: config.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: REFRESH_TOKEN_TTL * 1000,
		});

		// TODO: Remember me implementation
		// if(remember) {
		// 	// TODO: implement
		// 	set email and password to the cookies
		// }
		req.flash('success', 'You have logged in successfully');
		return res.redirect('/user/profile');
	} catch (error) {
		console.error('Register Error:', error?.message || error);
		req.flash('error', 'Some thing went wrong please try again');
		return res.redirect('/auth/login');
	}
};
