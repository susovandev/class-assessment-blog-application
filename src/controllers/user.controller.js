import userModel from '../models/user.model.js';
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from '../libs/cloudinary.js';
import { comparePasswordHelper, hashPasswordHelper } from '../libs/password.js';
import fs from 'node:fs';
export const getUserProfilePage = async (req, res) => {
  try {
    return res.render('user/profile', { user: req.user });
  } catch (error) {
    console.error('User Profile Error:', error?.message || error);
    req.flash('error', 'Some thing went wrong please try again');
    return res.redirect('/auth/login');
  }
};

export const updateProfilePage = async (req, res) => {
  try {
    return res.render('user/update-profile', { user: req.user });
  } catch (error) {
    console.error('User Profile Error:', error?.message || error);
    req.flash('error', 'Some thing went wrong please try again');
    return res.redirect('/auth/login');
  }
};

export const updateProfileHandler = async (req, res) => {
  try {
    const { username } = req.body;
    const userProfileImageLocalFilePath = req?.file?.path;

    if (userProfileImageLocalFilePath && req?.user?.profileImage?.publicId) {
      await deleteFromCloudinary(req?.user?.profileImage?.publicId);
      console.log(
        `Deleted image from cloudinary: ${req?.user?.profileImage?.publicId}`
      );
    }

    let updateData = {
      username,
    };

    if (userProfileImageLocalFilePath) {
      const uploaded = await uploadOnCloudinary({
        localFilePath: userProfileImageLocalFilePath,
      });
      if (uploaded) {
        updateData.profileImage = {
          public_id: uploaded.public_id,
          secure_url: uploaded.secure_url,
        };
      }
      console.log(`Image uploaded to cloudinary: ${uploaded?.public_id}`);
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      updateData,
      {
        new: true,
      }
    );

    if (!updatedUser) {
      req.flash('error', 'Some thing went wrong please try again');
      return res.redirect('/user/profile/edit');
    }

    req.flash('success', 'Profile updated successfully');
    return res.redirect('/user/profile');
  } catch (error) {
    console.error('User Profile update :', error?.message || error);
    req.flash('error', 'Some thing went wrong please try again');
    return res.redirect('/user/profile/edit');
  } finally {
    if (req?.file?.path) {
      fs.unlinkSync(req?.file?.path);
      console.log(`Deleted local file: ${req?.file?.path}`);
    }
  }
};

export const getChangePasswordPage = (req, res) => {
  try {
    const user = req.user;
    return res.render('user/change-password', { user });
  } catch (error) {
    console.error('User Profile update :', error?.message || error);
    req.flash('error', 'Some thing went wrong please try again');
    return res.redirect('/user/profile/edit');
  }
};

export const changePasswordHandler = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      req.flash('error', 'New password and confirm password does not match');
      return res.redirect('/user/profile/edit');
    }

    const user = req.user;
    const isPasswordMatch = await comparePasswordHelper(
      currentPassword,
      user?.password
    );
    if (!isPasswordMatch) {
      req.flash('error', 'Current password is incorrect');
      return res.redirect('/user/profile/edit');
    }

    const hashedPassword = await hashPasswordHelper(newPassword);
    const updatedAdmin = await userModel.findByIdAndUpdate(
      user?._id,
      {
        password: hashedPassword,
      },
      { new: true }
    );
    if (!updatedAdmin) {
      req.flash('error', 'Some thing went wrong please try again');
      return res.redirect('/user/profile/edit');
    }

    req.flash('success', 'Password changed successfully');
    return res.redirect('/user/profile');
  } catch (error) {
    console.error('User Profile update :', error?.message || error);
    req.flash('error', 'Some thing went wrong please try again');
    return res.redirect('/user/profile/edit');
  }
};
