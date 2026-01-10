import userModel from '../models/user.model.js';
import blogModel from '../models/blog.model.js';
import categoryModel from '../models/category.model.js';
import commentModel from '../models/category.model.js';
import {
	deleteFromCloudinary,
	uploadOnCloudinary,
} from '../libs/cloudinary.js';
import fs from 'node:fs';

export const getUsersPage = async (req, res) => {
	try {
		const users = await userModel
			.find({ role: { $ne: 'admin' } })
			.select('-password');

		res.render('admin/users', {
			admin: req.user,
			users,
		});
	} catch (error) {
		console.error('Admin get users Error:', error?.message || error);
		req.flash('error', 'Some thing went wrong please try again');
		return res.redirect('/admin/dashboard');
	}
};

export const toggleUserStatus = async (req, res) => {
	const user = await userModel.findById(req.params.id);

	if (user.role === 'admin') {
		req.flash('error', 'Admin account cannot be disabled');
		return res.redirect('/admin/users');
	}

	user.isActive = !user.isActive;
	await user.save();

	req.flash(
		'success',
		`User ${user.isActive ? 'enabled' : 'disabled'} successfully`,
	);

	res.redirect('/admin/users');
};

export const addBlogPage = async (req, res) => {
	try {
		const { sub } = req?.user;
		const adminUserName = await userModel.findById(sub).select('username');
		const categories = await categoryModel.find().select('_id name');
		if (!categories.length) {
			return res.render('admin/add-blog');
		}

		return res.render('admin/add-blog', { admin: adminUserName, categories });
	} catch (error) {
		console.error('Create Blog Error:', error?.message || error);
		req.flash('error', 'Some thing went wrong please try again');
		return res.redirect('/admin/blogs/add');
	}
};

export const getBlogsPage = async (req, res) => {
	try {
		const { sub } = req?.user;
		const adminUserName = await userModel.findById(sub).select('username');
		console.log(adminUserName);
		const blogs = await blogModel.aggregate([
			{
				$lookup: {
					from: 'comments',
					localField: '_id',
					foreignField: 'blogId',
					as: 'comments',
				},
			},
			{
				$lookup: {
					from: 'categories',
					localField: 'categoryId',
					foreignField: '_id',
					as: 'category',
				},
			},
			{
				$addFields: {
					totalComments: { $size: '$comments' },
					category: { $arrayElemAt: ['$category', 0] },
				},
			},
			{
				$sort: { createdAt: -1 },
			},
		]);

		res.render('admin/blogs', {
			admin: adminUserName,
			blogs,
		});
	} catch (error) {
		console.error('Admin Get Blogs Error:', error?.message || error);
		req.flash('error', 'Some thing went wrong please try again');
		return res.redirect('/admin/dashboard');
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
		const category = await categoryModel.findById(categoryId);
		if (!category) {
			req.flash('error', 'Category not found');
			return res.redirect('/admin/blogs/add');
		}

		// upload image to cloudinary
		const cloudinaryResponse = await uploadOnCloudinary({
			localFilePath: blogLocalImageFilePath,
		});
		if (!cloudinaryResponse) {
			req.flash('error', 'Something went wrong please try again');
			return res.redirect('/admin/blogs/add');
		}

		const tagsList = tags.split(',').map((t) => t.trim()) || [];
		const newBlog = await blogModel.create({
			title,
			content,
			authorId: req?.user?.sub,
			categoryId: category?._id,
			tags: tagsList,
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

export const getCategoriesPage = async (req, res) => {
	try {
		const { sub } = req?.user;
		const adminInfo = await userModel.findById(sub).select('username');

		const categories = await categoryModel.find().sort({ createdAt: -1 });

		return res.render('admin/categories', { admin: adminInfo, categories });
	} catch (error) {
		console.error('Admin get categories Error:', error?.message || error);
		req.flash('error', 'Some thing went wrong please try again');
		return res.redirect('/admin/dashboard');
	}
};

export const addCategoryHandler = async (req, res) => {
	try {
		const { sub } = req?.user;
		const { name } = req.body;
		const newCategory = await categoryModel.create({
			authorId: sub,
			name,
		});
		if (!newCategory) {
			req.flash('error', 'Some thing went wrong please try again');
			return res.redirect('/admin/categories');
		}

		req.flash('success', 'Category added successfully');
		return res.redirect('/admin/categories');
	} catch (error) {
		console.error('Admin Create Category Error:', error?.message || error);
		req.flash('error', 'Some thing went wrong please try again');
		return res.redirect('/admin/categories');
	}
};

export const deleteCategoryHandler = async (req, res) => {
	try {
		const { id } = req.params;

		const deletedCategory = await categoryModel.findByIdAndDelete(id);
		if (!deletedCategory) {
			req.flash('error', 'Some thing went wrong please try again');
			return res.redirect('/admin/categories');
		}

		req.flash('success', 'Category deleted successfully');
		return res.redirect('/admin/categories');
	} catch (error) {
		console.error('Admin Delete Category Error:', error?.message || error);
		req.flash('error', 'Some thing went wrong please try again');
		return res.redirect('/admin/categories');
	}
};

export const deleteBlogHandler = async (req, res) => {
	const { id } = req.params;
	try {
		const deletedBlog = await blogModel.findByIdAndDelete(id);
		if (!deletedBlog) {
			req.flash('error', 'Some thing went wrong please try again');
			return res.redirect('/admin/blogs');
		}

		// Delete image from the cloudinary
		await deleteFromCloudinary(deletedBlog?.image?.public_id);

		req.flash('success', 'Blog deleted successfully');
		return res.redirect('/admin/blogs');
	} catch (error) {
		console.error('Admin Delete Blog Error:', error?.message || error);
		req.flash('error', 'Some thing went wrong please try again');
		return res.redirect('/admin/blogs');
	}
};

export const updateBlogPage = async (req, res) => {
	try {
		const { sub } = req?.user;
		const { id } = req.params;
		const adminUserName = await userModel.findById(sub).select('username');
		const blog = await blogModel.findById(id);
		const categories = await categoryModel.find().select('_id name');
		if (!blog) {
			req.flash('error', 'Some thing went wrong please try again');
			return res.redirect('/admin/blogs');
		}

		return res.render('admin/update-blog', {
			admin: adminUserName,
			blog,
			categories,
		});
	} catch (error) {
		console.error('Admin Delete Blog Error:', error?.message || error);
		req.flash('error', 'Some thing went wrong please try again');
		return res.redirect('/admin/blogs');
	}
};

export const updateBlogHandler = async (req, res) => {
	try {
		const { id } = req.params;
		const { title, content, categoryId, tags } = req.body;

		const blog = await blogModel.findById(id);
		if (!blog) {
			req.flash('error', 'Blog not found');
			return res.redirect('/admin/blogs');
		}

		const updateData = {
			title,
			content,
			categoryId,
			tags: tags
				? tags
						.split(',')
						.map((t) => t.trim())
						.filter(Boolean)
				: [],
		};

		if (req.file?.path) {
			const uploaded = await uploadOnCloudinary(req.file.path, 'image');

			if (uploaded) {
				await deleteFromCloudinary(blog?.image?.public_id);
				updateData.image = {
					public_id: uploaded.public_id,
					secure_url: uploaded.secure_url,
				};
			}
		}

		await blogModel.findByIdAndUpdate(id, updateData, { new: true });

		req.flash('success', 'Blog updated successfully');
		return res.redirect('/admin/blogs');
	} catch (error) {
		console.error('Update Blog Error:', error);
		req.flash('error', 'Something went wrong');
		return res.redirect('/admin/blogs');
	} finally {
		try {
			if (req.file?.path) fs.unlinkSync(req.file.path);
		} catch {}
	}
};
