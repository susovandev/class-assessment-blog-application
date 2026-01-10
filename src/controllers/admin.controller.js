import userModel from '../models/user.model.js';
import blogModel from '../models/blog.model.js';
import categoryModel from '../models/category.model.js';
import commentModel from '../models/category.model.js';
import { uploadOnCloudinary } from '../libs/cloudinary.js';
import fs from 'node:fs';
import mongoose from 'mongoose';
export const addBlogPage = async (req, res) => {
	try {
		req.flash('success', 'Blog created successfully');
		return res.render('admin/add-blog', {
			categories: [{ _id: 1, name: 'nunu' }],
		});
	} catch (error) {
		console.error('Create Blog Error:', error?.message || error);
		req.flash('error', 'Some thing went wrong please try again');
		return res.redirect('/admin/blogs/add');
	}
};

export const addBlogHandler = async (req, res) => {
	try {
		const { title, tags, content, categoryId } = req.body;
		const blogLocalImageFilePath = req?.file?.path;

		if (!blogLocalImageFilePath) {
			req.flash('error', 'Blog image should be required');
			return res.redirect('/admin/blogs/add');
		}

		// Check category exists
		// const category = await categoryModel.findById(categoryId);
		// if (!category) {
		// 	req.flash('error', 'Category not found');
		// 	return res.redirect('/admin/blogs/add');
		// }

		// upload image to cloudinary
		const cloudinaryResponse = await uploadOnCloudinary({
			localFilePath: blogLocalImageFilePath,
		});
		if (!cloudinaryResponse) {
			req.flash('error', 'Something went wrong please try again');
			return res.redirect('/admin/blogs/add');
		}

		const newBlog = await blogModel.create({
			title,
			content,
			authorId: req?.user?.sub,
			categoryId: new mongoose.Types.ObjectId().toHexString(),
			tags: tags.split(',').map((t) => t.trim()),
			image: {
				public_id: cloudinaryResponse?.public_id,
				secure_url: cloudinaryResponse?.secure_url,
			},
		});
		if (!newBlog) {
			req.flash('error', 'Something went wrong please try again');
			return res.redirect('/admin/blogs/add');
		}

		req.flash('success', 'Blog added successfully');
		return res.redirect('/admin/blogs');
	} catch (error) {
		console.error('Create Blog Error:', error?.message || error);
		req.flash('error', 'Some thing went wrong please try again');
		return res.redirect('/admin/blogs/add');
	} finally {
		if (req?.file?.path) {
			fs.unlinkSync(req?.file?.path);
			console.log('File deleted');
		}
	}
};

export const adminDashBoardPage = async (req, res) => {
	try {
		const [totalUsers, totalCategories, totalBlogs, totalComments] =
			await Promise.all([
				userModel.countDocuments({ role: 'user' }),
				categoryModel.countDocuments(),
				blogModel.countDocuments(),
				commentModel.countDocuments(),
			]);

		res.render('admin/dashboard', {
			admin: req.user,
			stats: {
				totalUsers,
				totalCategories,
				totalBlogs,
				totalComments,
			},
		});
	} catch (error) {
		console.error('Admin DashboardError:', error?.message || error);
		req.flash('error', 'Some thing went wrong please try again');
		return res.redirect('/admin/dashboard');
	}
};
